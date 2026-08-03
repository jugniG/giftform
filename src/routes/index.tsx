import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { RiArrowRightLine } from 'react-icons/ri'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">Driz</h1>
      <p className="mt-4 max-w-md text-lg text-gray-500">
        A modern SaaS starter with payments, auth, and a beautiful pricing page.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Button as={Link} to="/pricing" color="primary" endContent={<RiArrowRightLine />}>
          View pricing
        </Button>
        <Button as={Link} to="/login" variant="bordered">
          Sign in
        </Button>
      </div>
    </div>
  )
}
