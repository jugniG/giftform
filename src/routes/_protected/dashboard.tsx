import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from '@heroui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '#/orpc/client'
import { Input } from '#/components/Input'
import { Button } from '#/components/Button'
import {
  RiAddLine,
  RiFileList3Line,
  RiEditLine,
  RiBarChartBoxLine,
  RiDeleteBinLine,
} from 'react-icons/ri'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
})

const createFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
})

type CreateFormInput = z.infer<typeof createFormSchema>

function DashboardPage() {
  const { user } = Route.useRouteContext()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [serverError, setServerError] = useState<string | null>(null)

  const name = user?.name ?? user?.email ?? 'there'

  const { data: forms = [], isLoading } = useQuery(
    orpc.forms.listUserForms.queryOptions(),
  )

  const createFormMutation = useMutation(
    orpc.forms.createForm.mutationOptions({
      onSuccess: (newForm) => {
        queryClient.invalidateQueries(orpc.forms.listUserForms.queryOptions())
        onClose()
        router.navigate({ to: '/forms/$formId', params: { formId: newForm.id } })
      },
      onError: (err) => {
        setServerError(err.message)
      },
    }),
  )

  const deleteFormMutation = useMutation(
    orpc.forms.deleteForm.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(orpc.forms.listUserForms.queryOptions())
      },
    }),
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormInput>({
    resolver: zodResolver(createFormSchema),
  })

  const onSubmit = async (data: CreateFormInput) => {
    setServerError(null)
    await createFormMutation.mutateAsync({
      title: data.title,
      description: data.description,
      preset: 'amazon',
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, manage, and view responses for your offer forms.
          </p>
        </div>
        <Button
          color="primary"
          variant="solid"
          startContent={<RiAddLine className="text-lg" />}
          onPress={() => {
            reset()
            onOpen()
          }}
        >
          Create Form
        </Button>
      </div>

      {/* Forms List */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-gray-500">Loading your forms...</div>
      ) : forms.length === 0 ? (
        <Card shadow="sm" className="bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <RiFileList3Line className="text-2xl" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">No forms created yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create an Amazon offer / lucky draw form and start collecting responses.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              color="primary"
              variant="solid"
              startContent={<RiAddLine className="text-lg" />}
              onPress={() => {
                reset()
                onOpen()
              }}
            >
              Create Your First Form
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form: any) => (
            <Card key={form.id} shadow="sm" className="bg-white hover:border-amber-400 transition">
              <CardHeader className="flex items-center justify-between pb-2">
                <div className="min-w-0 pr-2">
                  <h3 className="truncate text-base font-bold text-gray-900">{form.title}</h3>
                  <p className="truncate text-xs text-gray-500">
                    {form.description || 'No description'}
                  </p>
                </div>
                <Chip size="sm" color="warning" variant="flat" className="capitalize">
                  {form.preset}
                </Chip>
              </CardHeader>
              <CardBody className="pt-2">
                <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span>Submissions</span>
                  <span className="font-bold text-gray-900">{form._count?.submissions ?? 0}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    as={Link}
                    to="/forms/$formId"
                    params={{ formId: form.id }}
                    size="sm"
                    variant="bordered"
                    className="flex-1"
                    startContent={<RiEditLine />}
                  >
                    Edit
                  </Button>
                  <Button
                    as={Link}
                    to="/forms/$formId/responses"
                    params={{ formId: form.id }}
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="flex-1"
                    startContent={<RiBarChartBoxLine />}
                  >
                    Responses
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    isIconOnly
                    isLoading={deleteFormMutation.isPending}
                    onPress={() => {
                      if (confirm('Are you sure you want to delete this form?')) {
                        deleteFormMutation.mutate({ id: form.id })
                      }
                    }}
                  >
                    <RiDeleteBinLine />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onCloseModal) => (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <ModalHeader className="flex flex-col gap-1">Create Amazon Lucky Draw Form</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Input
                  label="Form Title"
                  placeholder="e.g. Amazon Great Indian Festival Lucky Draw"
                  isInvalid={!!errors.title}
                  errorMessage={errors.title?.message}
                  {...register('title')}
                />
                <Input
                  label="Description (Optional)"
                  placeholder="e.g. Win iPhone 15 Pro & Amazon Pay Balance"
                  {...register('description')}
                />
                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                  <strong>Preset: Amazon Offer Form</strong>
                  <br />
                  Includes Amazon branding, lucky draw wheel styling, and customizable inputs.
                </div>
                {serverError && (
                  <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">
                    {serverError}
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onCloseModal}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                  Create &amp; Edit Inputs
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
