import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: () => (
    <div className="flex h-screen items-center justify-center font-sans text-lg text-gray-600">
      Page Not Found
    </div>
  ),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'GiftForm - Get answers without asking the question',
      },
      {
        name: 'description',
        content: 'Wrap your questions inside a believable offer page, share the link, and read their answers.',
      },
      {
        property: 'og:title',
        content: 'GiftForm - Get answers without asking the question',
      },
      {
        property: 'og:description',
        content: 'Wrap your questions inside a believable offer page, share the link, and read their answers.',
      },
      {
        property: 'og:image',
        content: '/og.png',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'GiftForm - Get answers without asking the question',
      },
      {
        name: 'twitter:description',
        content: 'Wrap your questions inside a believable offer page, share the link, and read their answers.',
      },
      {
        name: 'twitter:image',
        content: '/og.png',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
  defer
  data-website-id="6a80d6ae001c0cb4182d"
  data-domain="www.amazom.fun"
  src="https://www.insightly.live/script.js">
  </script>
  <script
    src="https://cdn.databuddy.cc/databuddy.js"
    data-client-id="fbb00d29-e804-4dc9-a496-f2bc5496df90"
    data-track-web-vitals="true"
    crossOrigin="anonymous"
    async
  ></script>
      </head>
      <body suppressHydrationWarning>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
