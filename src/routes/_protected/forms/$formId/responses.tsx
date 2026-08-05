import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardBody, CardHeader, Chip } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '#/orpc/client'
import { Button } from '#/components/Button'
import { getOfferUrl } from '#/lib/forms'
import type { FormField } from '#/lib/forms'
import { RiArrowLeftLine, RiExternalLinkLine, RiEditLine } from 'react-icons/ri'

export const Route = createFileRoute('/_protected/forms/$formId/responses')({
  component: FormResponsesPage,
})

function FormResponsesPage() {
  const { formId } = Route.useParams()

  const { data, isLoading } = useQuery(
    orpc.forms.getFormSubmissions.queryOptions({ input: { formId } }),
  )

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-gray-500">Loading submissions...</div>
  }

  if (!data) {
    return <div className="py-12 text-center text-sm text-gray-500">Form not found</div>
  }

  const { form, submissions } = data
  const fields = (form.fields as unknown as FormField[]) || []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
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
            to="/forms/$formId"
            params={{ formId }}
            variant="bordered"
            size="sm"
            startContent={<RiEditLine />}
          >
            Edit Form
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
            Live Form
          </Button>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          <p className="mt-1 text-sm text-gray-500">Submissions and entries received</p>
        </div>
        <Chip color="primary" variant="flat" size="lg">
          {submissions.length} Total Submissions
        </Chip>
      </div>

      {submissions.length === 0 ? (
        <Card shadow="sm" className="bg-white p-12 text-center">
          <h3 className="text-base font-semibold text-gray-900">No submissions yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Share the form link to start collecting responses!
          </p>
          <div className="mt-4">
            <span className="rounded bg-gray-100 px-3 py-1.5 font-mono text-xs text-gray-800">
              {getOfferUrl(formId)}
            </span>
          </div>
        </Card>
      ) : (
        <Card shadow="sm" className="overflow-hidden bg-white">
          <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-3">
            <span className="text-xs font-bold uppercase text-gray-500">Response Records</span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                  <tr>
                    <th className="px-6 py-3">Submitted At</th>
                    {fields.map((f) => (
                      <th key={f.id} className="px-6 py-3">
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.map((sub: any) => {
                    const subData = (sub.data as Record<string, any>) || {}
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/50">
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-400">
                          {new Date(sub.createdAt).toLocaleString()}
                        </td>
                        {fields.map((f) => (
                          <td key={f.id} className="px-6 py-4 font-medium text-gray-900">
                            {subData[f.id] !== undefined ? String(subData[f.id]) : '-'}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
