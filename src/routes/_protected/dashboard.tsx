import { createFileRoute } from '@tanstack/react-router'
import { Card, CardBody, CardHeader } from '@heroui/react'
import {
  RiBarChartLine,
  RiUserLine,
  RiFileListLine,
  RiArrowUpLine,
} from 'react-icons/ri'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
})

const stats = [
  {
    label: 'Total Users',
    value: '1,284',
    change: '+12%',
    icon: RiUserLine,
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    label: 'Revenue',
    value: '$24,500',
    change: '+8%',
    icon: RiBarChartLine,
    color: 'bg-green-50 text-green-600',
  },
  {
    label: 'Active Projects',
    value: '34',
    change: '+3',
    icon: RiFileListLine,
    color: 'bg-amber-50 text-amber-600',
  },
]

function DashboardPage() {
  const { user } = Route.useRouteContext()
  const name = user?.name ?? user?.email ?? 'there'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {name.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} shadow="sm" className="bg-white">
            <CardHeader className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium text-gray-500">{s.label}</span>
              <span className={`rounded-lg p-2 ${s.color}`}>
                <s.icon className="text-lg" />
              </span>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <RiArrowUpLine />
                {s.change} from last month
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-base font-semibold text-gray-900">
          Recent activity
        </h2>
        <p className="text-sm text-gray-400">No activity yet.</p>
      </div>
    </div>
  )
}
