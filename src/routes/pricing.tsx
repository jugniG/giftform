import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react'
import { Button } from '#/components/Button'
import { RiCheckLine, RiVipCrownLine, RiGiftFill } from 'react-icons/ri'
import { useMutation, useQuery } from '@tanstack/react-query'
import { orpc } from '#/orpc/client'
import { authClient } from '#/lib/auth-client'
import type { BillingInterval, PlanId } from '#/lib/payments/plans'
import { PLANS, PLAN_RANK } from '#/lib/payments/plans'
import { z } from 'zod'

export const Route = createFileRoute('/pricing')({
  validateSearch: z
    .object({
      planId: z.enum(['starter', 'pro', 'team']).optional(),
      interval: z.enum(['monthly', 'annual']).optional(),
      autoCheckout: z.coerce.number().optional(), // 1 = trigger checkout immediately
    })
    .parse,
  component: PricingPage,
})

function fmt(n: number) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

function PricingPage() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const { planId, interval, autoCheckout } = Route.useSearch()
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('monthly')

  const checkoutMutation = useMutation(orpc.billing.createCheckout.mutationOptions())
  const { data: subscription, isLoading: subLoading } = useQuery(
    orpc.billing.getSubscription.queryOptions(),
  )

  async function triggerCheckout(plan: PlanId, inv: BillingInterval) {
    if (!session?.user) {
      // Save intent, redirect to login - the login page resumes after auth
      sessionStorage.setItem('checkout_intent', JSON.stringify({ planId: plan, interval: inv }))
      navigate({ to: '/login', search: { callbackURL: '/pricing' } })
      return
    }
    try {
      const result = await checkoutMutation.mutateAsync({
        planId: plan,
        interval: inv,
        successUrl: `${window.location.origin}/billing?success=1`,
        cancelUrl: `${window.location.origin}/pricing`,
      })
      if (result.url) window.location.href = result.url
    } catch (err: any) {
      console.error(err)
      alert(err?.message ?? 'Something went wrong.')
    }
  }

  // Auto-trigger checkout if redirected back from login with intent
  useEffect(() => {
    if (autoCheckout && planId && interval && session?.user) {
      void triggerCheckout(planId, interval)
    }
  }, [autoCheckout, session])

  const currentPlan = subscription?.planId as PlanId | undefined
  const currentRank = currentPlan ? PLAN_RANK[currentPlan] : -1

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 text-white shadow-lg">
          <RiGiftFill className="text-2xl" />
        </span>
        <Chip color="primary" variant="flat" className="mb-4">
          7-day free trial · No credit card required
        </Chip>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Simple pricing for GiftForm
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-500">
          Start free, upgrade when you're ready. Every plan includes a 7-day trial.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="mb-10 flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setSelectedInterval('monthly')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              selectedInterval === 'monthly'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedInterval('annual')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              selectedInterval === 'annual'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs text-emerald-500">−20%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const price = plan[selectedInterval === 'annual' ? 'annualPrice' : 'monthlyPrice']
          const rank = PLAN_RANK[plan.id]
          const isCurrent = currentPlan === plan.id
          const isUpgrade = currentRank >= 0 && rank > currentRank

          return (
            <Card
              key={plan.id}
              className={`relative bg-white ${
                plan.popular
                  ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <Chip color="primary" size="sm" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1">
                    <RiVipCrownLine /> Most popular
                  </span>
                </Chip>
              )}
              <CardHeader className="flex-col items-start gap-1 pb-2">
                <span className="text-lg font-bold text-gray-900">{plan.name}</span>
                <span className="text-sm text-gray-500">{plan.tagline}</span>
              </CardHeader>
              <CardBody className="gap-0">
                <div className="mb-1 flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-gray-900">{fmt(price)}</span>
                  <span className="mb-1 text-sm text-gray-500">/month</span>
                </div>
                <p className="mb-6 text-xs text-gray-400">
                  {selectedInterval === 'annual' ? `Billed $${fmt(price * 12)}/year` : 'Billed monthly'}
                </p>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <RiCheckLine className="mt-0.5 shrink-0 text-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  color={plan.popular ? 'primary' : 'default'}
                  variant={plan.popular ? 'solid' : 'bordered'}
                  fullWidth
                  isLoading={checkoutMutation.isPending}
                  isDisabled={isCurrent}
                  onPress={() => triggerCheckout(plan.id, selectedInterval)}
                >
                  {isCurrent
                    ? 'Current plan'
                    : isUpgrade
                      ? 'Upgrade'
                      : checkoutMutation.isPending
                        ? 'Redirecting…'
                        : 'Get started'}
                </Button>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Current subscription status */}
      {subLoading ? (
        <div className="mt-10 flex justify-center">
          <Spinner size="sm" />
        </div>
      ) : subscription ? (
        <div className="mt-10 text-center text-sm text-gray-500">
          You're on the <span className="font-semibold text-gray-900">{PLANS.find((p) => p.id === subscription.planId)?.name}</span> plan ·{' '}
          <Chip size="sm" color={subscription.status === 'active' ? 'success' : 'warning'} variant="flat">
            {subscription.status}
          </Chip>
          <span className="ml-1">
            · <a href="/billing" className="text-indigo-600 hover:underline">Manage billing</a>
          </span>
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-gray-400">
          No active subscription - pick a plan above to get started.
        </p>
      )}

      {/* Footer note */}
      <p className="mt-8 text-center text-xs text-gray-400">
        Payments secured by DodoPayments · No hidden fees · Cancel anytime
      </p>
    </div>
  )
}
