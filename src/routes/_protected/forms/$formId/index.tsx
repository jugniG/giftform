import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardBody, CardHeader, SelectItem, Chip, Tooltip } from '@heroui/react'
import { Select } from '#/components/Select'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '#/orpc/client'
import { Input } from '#/components/Input'
import { Button } from '#/components/Button'
import type { FormField } from '#/lib/forms'
import { getOfferUrl } from '#/lib/forms'
import {
  RiAddLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiSaveLine,
  RiArrowLeftLine,
  RiBarChartBoxLine,
} from 'react-icons/ri'

export const Route = createFileRoute('/_protected/forms/$formId/')({
  component: FormBuilderPage,
})

function FormBuilderPage() {
  const { formId } = Route.useParams()
  const queryClient = useQueryClient()

  const { data: form, isLoading } = useQuery(
    orpc.forms.getForm.queryOptions({ input: { id: formId } }),
  )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<FormField[]>([])
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (form) {
      setTitle(form.title)
      setDescription(form.description || '')
      setFields((form.fields as unknown as FormField[]) || [])
    }
  }, [form])

  const updateMutation = useMutation(
    orpc.forms.updateFormFields.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          orpc.forms.getForm.queryOptions({ input: { id: formId } }),
        )
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      },
    }),
  )

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: 'New Question / Field',
      type: 'text',
      required: true,
    }
    setFields([...fields, newField])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, updated: Partial<FormField>) => {
    const copy = [...fields]
    copy[index] = { ...copy[index], ...updated }
    setFields(copy)
  }

  const handleSave = () => {
    updateMutation.mutate({
      id: formId,
      title,
      description,
      fields,
    })
  }

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-gray-500">Loading form builder...</div>
  }

  if (!form) {
    return <div className="py-12 text-center text-sm text-gray-500">Form not found</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <RiArrowLeftLine /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to="/forms/$formId/responses"
            params={{ formId }}
            variant="bordered"
            size="sm"
            startContent={<RiBarChartBoxLine />}
          >
            View Submissions
          </Button>
          <Button
            as="a"
            href={getOfferUrl(formId)}
            target="_blank"
            rel="noreferrer"
            color="secondary"
            variant="flat"
            size="sm"
            startContent={<RiExternalLinkLine />}
          >
            Open Live Form
          </Button>
          <Button
            color="primary"
            size="sm"
            isLoading={updateMutation.isPending}
            startContent={<RiSaveLine />}
            onPress={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Form saved successfully! Share link: <strong>{getOfferUrl(formId)}</strong>
        </div>
      )}

      {/* Main Settings Card */}
      <Card shadow="sm" className="mb-6 bg-white">
        <CardHeader className="flex items-center justify-between border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Form Details</h2>
          <Chip size="sm" color="warning" variant="flat">
            Amazon Preset
          </Chip>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardBody>
      </Card>

      {/* Form Inputs Editor */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Form Inputs / Questions</h2>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<RiAddLine />}
          onPress={addField}
        >
          Add Input Field
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {fields.map((field, idx) =>
          field.id === 'email' ? null : (
          <Card key={field.id} shadow="sm" className="bg-white">
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">FIELD #{idx + 1}</span>
                <Tooltip content="Delete field" showArrow>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    isIconOnly
                    onPress={() => removeField(idx)}
                  >
                    <RiDeleteBinLine />
                  </Button>
                </Tooltip>
              </div>

              <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Label / Question"
                      value={field.label}
                      onChange={(e) => updateField(idx, { label: e.target.value })}
                    />
                    <Select
                      label="Input Type"
                      selectedKeys={[field.type]}
                      onChange={(e) =>
                        updateField(idx, {
                          type: e.target.value as 'text' | 'email' | 'number' | 'select',
                        })
                      }
                    >
                      <SelectItem key="text">Text Input</SelectItem>
                      <SelectItem key="number">Number / Mobile</SelectItem>
                      <SelectItem key="email">Email Address</SelectItem>
                      <SelectItem key="select">Dropdown Select</SelectItem>
                    </Select>
                  </div>

                  {field.type === 'select' && (
                    <Input
                      label="Options (comma separated)"
                      placeholder="e.g. Prize A, Prize B, Prize C"
                      value={field.options?.join(', ') || ''}
                      onChange={(e) =>
                        updateField(idx, {
                          options: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                    />
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`opt_${field.id}`}
                      checked={!field.required}
                      onChange={(e) => updateField(idx, { required: !e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                    />
                    <label htmlFor={`opt_${field.id}`} className="text-xs text-gray-600 font-medium">
                      Optional Field
                    </label>
                  </div>
                </>
            </CardBody>
          </Card>
          )
        )}
      </div>
    </div>
  )
}
