import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { RiArrowRightLine, RiGiftFill } from 'react-icons/ri'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 text-white shadow-lg">
        <RiGiftFill className="text-3xl" />
      </span>
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">GiftForm</h1>
      <p className="mt-4 max-w-md text-lg text-gray-500">
        Create realistic lucky-draw offer forms and collect responses.
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
