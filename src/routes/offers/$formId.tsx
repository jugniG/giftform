import { createFileRoute } from '@tanstack/react-router'
import { Card, CardBody, CardHeader, SelectItem } from '@heroui/react'
import { Select } from '#/components/Select'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '#/orpc/client'
import { Input } from '#/components/Input'
import { Button } from '#/components/Button'
import type { FormField } from '#/lib/forms'
import { RiCheckLine, RiGiftLine } from 'react-icons/ri'

export const Route = createFileRoute('/offers/$formId')({
  component: PublicAmazonFormPage,
})

function PublicAmazonFormPage() {
  const { formId } = Route.useParams()

  const { data: form, isLoading, isError } = useQuery(
    orpc.forms.getForm.queryOptions({ input: { id: formId } }),
  )

  const submitMutation = useMutation(orpc.forms.submitFormResponse.mutationOptions())

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAEDED]">
        <div className="text-center font-sans text-sm text-gray-600">Loading Amazon Offer...</div>
      </div>
    )
  }

  if (isError || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAEDED]">
        <div className="text-center font-sans text-sm text-red-600">
          This offer link is invalid or has expired.
        </div>
      </div>
    )
  }

  const fields = (form.fields as unknown as FormField[]) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitMutation.mutateAsync({
      formId,
      data: formData,
    })
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#EAEDED] font-sans antialiased">
      {/* Amazon Header Navbar */}
      <header className="bg-[#131921] px-4 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-start gap-2">
            <span className="text-2xl font-extrabold text-white">
              <span className="sr-only">Amazon</span>
              <img
                src="/az-logo.png"
                alt="Amazon"
                className="h-7 w-auto"
              />
            </span>
            <span className="hidden text-xs text-gray-300 sm:inline">
              | Great Indian Festival
            </span>
          </div>
          <div className="rounded bg-[#FF9900] px-2.5 py-1 text-xs font-bold text-black">
            FESTIVE SEASON
          </div>
        </div>
      </header>

      {/* Sub header banner */}
      <div className="bg-[#232F3E] py-2 text-center text-xs font-medium text-white">
        ✨ Amazon Great Indian Festival - Lucky Draw ✨
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Offer Hero Banner */}
        <div className="mb-6 overflow-hidden rounded-xl border border-amber-300 bg-gradient-to-br from-[#FEF8E7] to-[#FFF3CD] p-6 text-center shadow-sm">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FF9900] px-3 py-1 text-xs font-bold text-black">
            <RiGiftLine className="text-base" /> OFFICIAL FESTIVE LUCKY DRAW
          </div>
          <h1 className="text-2xl font-extrabold text-[#111111] sm:text-3xl">{form.title}</h1>
          {form.description && (
            <p className="mt-1 text-xs text-gray-700">{form.description}</p>
          )}

          {/* Prizes up for grabs */}
          <div className="mx-auto mt-4 max-w-md overflow-hidden rounded-lg border border-amber-200 bg-white/70 shadow-sm">
            <img
              src="/amazon-prizes.png"
              alt="Prizes up for grabs - iPhone 15 Pro, ₹10,000 Amazon Pay Balance, Sony headphones"
              className="w-full object-cover"
            />
            <div className="p-4 text-left">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-amber-700">
                🎁 Prizes up for grabs
              </p>
              <ul className="grid grid-cols-1 gap-1.5 text-sm font-semibold text-[#111111]">
                <li className="flex items-center gap-2">
                  iPhone 15 Pro
                </li>
                <li className="flex items-center gap-2">
                  ₹10,000 Amazon Pay Balance
                </li>
                <li className="flex items-center gap-2">
                  Sony Wireless Headphones
                </li>
              </ul>
              <p className="mt-2 border-t border-amber-100 pt-2 text-center text-[10px] text-gray-500">
                Lucky draw - winners selected at random and notified via email / SMS.
              </p>
            </div>
          </div>
        </div>

        {/* Entry Form */}
        <Card shadow="sm" className="border border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-100 bg-[#F7F7F7] px-6 py-4">
            <h2 className="text-sm font-bold text-[#111111]">
              {submitted ? 'Entry Submitted!' : 'Enter your details to participate'}
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <RiCheckLine className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">You're in the draw! 🎉</h3>
                <p className="mt-2 text-xs text-gray-600">
                  Your entry has been recorded successfully. If you're a winner, you'll be
                  notified on the contact details you provided.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {fields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-1">
                    {field.type === 'select' ? (
                      <Select
                        label={field.label}
                        required={field.required}
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      >
                        {(field.options || []).map((opt: string) => (
                          <SelectItem key={opt}>{opt}</SelectItem>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        label={field.label}
                        type={field.type}
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.id]: e.target.value })
                        }
                      />
                    )}
                  </div>
                ))}

                <Button
                  type="submit"
                  color="warning"
                  variant="solid"
                  className="mt-2 bg-[#FF9900] font-bold text-black hover:bg-[#e68a00]"
                  isLoading={submitMutation.isPending}
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Entry for Lucky Draw'}
                </Button>

                <p className="text-center text-[10px] text-gray-400">
                  No purchase or payment required to enter. Participation is voluntary.
                </p>
              </form>
            )}
          </CardBody>
        </Card>

        {/* Footer info */}
        <footer className="mt-8 text-center text-[10px] text-gray-500">
          © 1996-2026, Amazon.com, Inc. or its affiliates. All rights reserved.
        </footer>
      </main>
    </div>
  )
}