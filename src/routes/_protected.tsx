import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@heroui/react'
import {
  RiDashboardLine,
  RiLogoutBoxLine,
  RiSettingsLine,
  RiUserLine,
  RiPriceTag3Line,
} from 'react-icons/ri'
import { Logo } from '#/components/Logo'
import { authClient } from '#/lib/auth-client'
import { getSession } from '#/lib/session'

// ---------------------------------------------------------------------------
// Auth guard — redirect to /login if no session
// ---------------------------------------------------------------------------
export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session?.user) {
      throw redirect({ to: '/login' })
    }
    return { user: session.user }
  },
  component: ProtectedLayout,
})

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
function ProtectedLayout() {
  const router = useRouter()
  const { user } = Route.useRouteContext()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.navigate({ to: '/login' })
  }

  // Derive initials / display values
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase()

  const displayName = user?.name ?? user?.email ?? 'User'
  const displayEmail = user?.email ?? ''

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Navbar
        isBordered
        maxWidth="full"
        classNames={{
          base: 'bg-white',
          wrapper: 'mx-auto max-w-6xl px-4 sm:px-6',
        }}
      >
        {/* Brand — click to dashboard */}
        <NavbarBrand>
          <Logo to="/dashboard" size="sm" />
        </NavbarBrand>

        {/* Right — user dropdown */}
        <NavbarContent justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              {/* Trigger: avatar + name/email */}
              <button className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-gray-100 focus:outline-none">
                <Avatar
                  src={user?.image ?? undefined}
                  name={initials}
                  size="sm"
                  classNames={{
                    base: 'shrink-0 bg-rose-100',
                    name: 'text-rose-700 text-xs font-semibold',
                  }}
                />
                <span className="hidden text-sm font-medium text-gray-800 sm:block">
                  {displayName}
                </span>
                {/* Chevron */}
                <svg
                  className="ml-0.5 h-3.5 w-3.5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="User menu"
              variant="flat"
              classNames={{ base: 'w-64' }}
            >
              {/* Identity header */}
              <DropdownSection showDivider>
                <DropdownItem
                  key="identity"
                  isReadOnly
                  className="cursor-default opacity-100"
                  textValue="user identity"
                >
                  <div className="flex items-center gap-3 py-1">
                    <Avatar
                      src={user?.image ?? undefined}
                      name={initials}
                      size="md"
                      classNames={{
                        base: 'shrink-0 bg-indigo-100',
                        name: 'text-indigo-700 font-semibold',
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                </DropdownItem>
              </DropdownSection>

              {/* Navigation items */}
              <DropdownSection showDivider>
                <DropdownItem
                  key="dashboard"
                  startContent={<RiDashboardLine className="text-base text-gray-500" />}
                  onPress={() => router.navigate({ to: '/dashboard' })}
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="pricing"
                  startContent={<RiPriceTag3Line className="text-base text-gray-500" />}
                  onPress={() => router.navigate({ to: '/pricing' })}
                >
                  Pricing
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  startContent={<RiUserLine className="text-base text-gray-500" />}
                  onPress={() => router.navigate({ to: '/dashboard' })}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<RiSettingsLine className="text-base text-gray-500" />}
                  onPress={() => router.navigate({ to: '/dashboard' })}
                >
                  Settings
                </DropdownItem>
              </DropdownSection>

              {/* Sign out */}
              <DropdownSection>
                <DropdownItem
                  key="signout"
                  color="danger"
                  startContent={<RiLogoutBoxLine className="text-base" />}
                  onPress={handleSignOut}
                >
                  Sign out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
