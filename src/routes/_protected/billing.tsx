import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Card, CardBody, CardHeader, Chip, Button, Spinner } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orpc } from '#/orpc/client'
import { PLANS, PLAN_RANK } from '#/lib/payments/plans'

export const Route = createFileRoute('/_protected/billing')({
  component: BillingPage,
})

function fmt(n: number) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

function BillingPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: sub, isLoading } = useQuery(orpc.billing.getSubscription.queryOptions())

  const cancelMutation = useMutation(
    orpc.billing.cancelSubscription.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(orpc.billing.getSubscription.queryOptions()),
    }),
  )
  const resumeMutation = useMutation(
    orpc.billing.resumeSubscription.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(orpc.billing.getSubscription.queryOptions()),
    }),
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No active subscription</h1>
        <p className="mt-2 text-gray-500">Pick a plan to start using Driz Pro.</p>
        <Button color="primary" className="mt-6" onPress={() => router.navigate({ to: '/pricing' })}>
          View pricing
        </Button>
      </div>
    )
  }

  const currentPlan = PLANS.find((p) => p.id === sub.planId)
  const currentRank = currentPlan ? PLAN_RANK[currentPlan.id] : -1

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Billing</h1>
      <p className="mb-8 text-sm text-gray-500">Manage your Driz subscription.</p>

      {/* Current plan */}
      <Card className="mb-8 bg-white">
        <CardHeader className="flex items-center justify-between pb-2">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {currentPlan?.name ?? sub.planId} plan
            </span>
            <div className="mt-1 flex items-center gap-2">
              <Chip
                size="sm"
                color={sub.status === 'active' ? 'success' : 'warning'}
                variant="flat"
              >
                {sub.status}
              </Chip>
              {sub.cancelAtNextBilling && (
                <Chip size="sm" color="danger" variant="flat">
                  Cancels at period end
                </Chip>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">
              {fmt(sub.billingInterval === 'annual' ? (currentPlan?.annualPrice ?? 0) : (currentPlan?.monthlyPrice ?? 0))}
            </span>
            <span className="text-sm text-gray-500">/mo</span>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Billing interval</dt>
              <dd className="font-medium text-gray-900">{sub.billingInterval}</dd>
            </div>
            {sub.currentPeriodEnd && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Current period ends</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            {sub.cancelAtNextBilling ? (
              <Button color="primary" isLoading={resumeMutation.isPending} onPress={() => resumeMutation.mutate()}>
                Resume subscription
              </Button>
            ) : (
              <Button
                color="danger"
                variant="bordered"
                isLoading={cancelMutation.isPending}
                onPress={() => cancelMutation.mutate()}
              >
                Cancel subscription
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Change plan */}
      <h2 className="mb-4 text-base font-semibold text-gray-900">Change plan</h2>
      <div className="space-y-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === sub.planId
          const rank = PLAN_RANK[plan.id]
          const label = rank > currentRank ? 'Upgrade' : rank < currentRank ? 'Downgrade' : null
          return (
            <Card key={plan.id} className="bg-white">
              <CardBody className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{plan.name}</span>
                  <span className="text-sm text-gray-500">
                    {fmt(plan.monthlyPrice)}/mo
                  </span>
                </div>
                {isCurrent ? (
                  <Chip size="sm" color="success" variant="flat">
                    Current
                  </Chip>
                ) : (
                  <Button
                    size="sm"
                    color={rank > currentRank ? 'primary' : 'default'}
                    variant={rank > currentRank ? 'solid' : 'bordered'}
                    onPress={() => router.navigate({ to: '/pricing' })}
                  >
                    {label ?? 'Switch'}
                  </Button>
                )}
              </CardBody>
            </Card>
          )
        })}
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Changing plans redirects to the pricing page to start a new checkout.
      </p>
    </div>
  )
}
