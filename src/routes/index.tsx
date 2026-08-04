import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Logo } from '#/components/Logo'
import {
  RiGiftFill,
  RiArrowRightLine,
  RiSparkling2Line,
  RiEyeLine,
  RiEdit2Line,
  RiShareForwardLine,
} from 'react-icons/ri'

export const Route = createFileRoute('/')({ component: Home })

// ─── Scroll reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('revealed')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const stats = [
  { value: '₹2.4 Cr', label: 'prizes claimed to date' },
  { value: '38K+', label: 'entries collected' },
  { value: '4 min', label: 'to build your first draw' },
]

const features = [
  {
    icon: RiGiftFill,
    title: 'Lucky-draw that looks real',
    desc: 'Publish a festive offer page with genuine brand styling — winners are picked at random, no fake promises.',
    tint: 'from-rose-500 to-amber-500',
  },
  {
    icon: RiEdit2Line,
    title: 'Tweak every input',
    desc: 'Add fields, make them optional, reorder questions. The email field stays locked and required — always.',
    tint: 'from-indigo-500 to-cyan-400',
  },
  {
    icon: RiShareForwardLine,
    title: 'One link, infinite entries',
    desc: 'Share a clean /offers/:id link. No sign-up for your participants — they just fill it and enter.',
    tint: 'from-emerald-500 to-teal-500',
  },
  {
    icon: RiEyeLine,
    title: 'Watch responses land live',
    desc: 'Every submission streams into a tidy table. Export, filter, and see exactly what your page collected.',
    tint: 'from-fuchsia-500 to-pink-500',
  },
] as const

const steps = [
  {
    n: '01',
    icon: RiSparkling2Line,
    title: 'Pick your preset',
    desc: 'Start from a ready-made Amazon-style offer template with default inputs.',
  },
  {
    n: '02',
    icon: RiEdit2Line,
    title: 'Shape the form',
    desc: 'Add fields, swap types, make them optional. Your brand page, your rules.',
  },
  {
    n: '03',
    icon: RiShareForwardLine,
    title: 'Share & collect',
    desc: 'Drop the link anywhere. Entries land in your dashboard in real time.',
  },
] as const

function Home() {
  useReveal()

  return (
    <div className="min-h-screen overflow-x-clip bg-gray-50 text-gray-900 antialiased">
      {/* Nav — floating pill */}
      <nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="flex w-full max-w-xl items-center justify-between rounded-full border border-gray-200 bg-white/80 px-4 py-2 shadow-lg shadow-gray-900/5 backdrop-blur-md">
          <Logo to="/" />
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
            <a href="#how" className="transition hover:text-gray-900">How it works</a>
            <a href="#features" className="transition hover:text-gray-900">Features</a>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-1 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Open app <RiArrowRightLine />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/40 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute -z-10 h-[380px] w-[380px] translate-x-[-28%] translate-y-[-10%] rounded-full bg-amber-200/40 blur-[100px]"
        />

        <span
          data-reveal
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-600"
        >
          <RiSparkling2Line className="text-base" />
          Dummy offer pages · 100% safe &amp; playful
        </span>

        <h1
          data-reveal
          className="max-w-3xl text-balance text-[clamp(2.6rem,7.5vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-gray-900"
        >
          Build a lucky&nbsp;draw page people{' '}
          <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
            actually believe
          </span>
        </h1>

        <p
          data-reveal
          className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-gray-500"
        >
          GiftForm lets you spin up a realistic Amazon-style festival offer, collect entries in
          real time, and watch responses roll in — without ever promising anyone a real prize.
        </p>

        <div data-reveal className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-rose-500/30 transition hover:shadow-rose-500/50"
          >
            Create your first draw
            <RiArrowRightLine className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how"
            className="rounded-full border border-gray-300 px-7 py-3.5 text-base font-semibold text-gray-600 transition hover:border-gray-900 hover:text-gray-900"
          >
            See how it works
          </a>
        </div>

        {/* Proof visual — a real-looking offer page card */}
        <div
          data-reveal
          className="mt-16 w-full max-w-md -rotate-1 rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-900/10 transition-transform duration-500 hover:rotate-0"
        >
          <div className="mb-3 flex items-center justify-between">
            <img src="/az-logo.png" alt="Amazon" className="h-6 w-auto" />
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
              FESTIVE SEASON
            </span>
          </div>
          <img src="/amazon-prizes.png" alt="Prizes up for grabs" className="h-36 w-full rounded-xl object-cover" />
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700">
              Email Address
            </div>
            <div className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700">
              Full Name
            </div>
            <div className="col-span-2 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 py-2.5 text-center text-sm font-bold text-white">
              Submit Entry for Lucky Draw
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-200 bg-white px-6 py-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 sm:flex-row">
          {stats.map((s) => (
            <div key={s.label} data-reveal className="text-center sm:text-left">
              <div className="text-4xl font-extrabold tracking-tight text-rose-500">{s.value}</div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — numbered steps */}
      <section id="how" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <span data-reveal className="text-sm font-semibold uppercase tracking-widest text-rose-500">
            How it works
          </span>
          <h2 data-reveal className="mt-3 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
            3 steps from idea to live draw
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.n}
                data-reveal
                className="group relative rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-lg"
              >
                <span className="text-5xl font-extrabold text-gray-100 transition group-hover:text-rose-200">
                  {step.n}
                </span>
                <step.icon className="mt-4 h-7 w-7 text-rose-500" />
                <h3 className="mt-3 text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — bento */}
      <section id="features" className="border-t border-gray-200 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <span data-reveal className="text-sm font-semibold uppercase tracking-widest text-rose-500">
            Features
          </span>
          <h2 data-reveal className="mt-3 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
            Everything you need to run the fun
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                data-reveal
                className="group rounded-3xl border border-gray-200 bg-gray-50 p-8 transition hover:border-gray-300 hover:bg-white hover:shadow-lg"
              >
                <span
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.tint} text-white shadow-lg`}
                >
                  <f.icon className="text-2xl" />
                </span>
                <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div
          data-reveal
          className="mx-auto max-w-4xl rounded-[2.5rem] border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6 py-20 text-center"
        >
          <RiGiftFill className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-5 text-balance text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
            Ready to run an offer that looks real?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-gray-500">
            Spin up a festive draw, share the link, and watch entries land. Completely free to start.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-rose-500/30 transition hover:shadow-rose-500/50"
          >
            Start building free <RiArrowRightLine />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo to="/" size="sm" />
          <p className="text-xs text-gray-400">
            Playful dummy pages for fun &amp; demo. No real prizes, promise. 🎈
          </p>
        </div>
      </footer>

      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </div>
  )
}