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
  RiLockLine,
  RiSpyLine,
} from 'react-icons/ri'

export const Route = createFileRoute('/')({ component: Home })

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

const useCases = [
  { emoji: '🎂', label: 'Birthday surprise planning' },
  { emoji: '🎅', label: 'Secret Santa preferences' },
  { emoji: '💘', label: 'Crush recon mission' },
  { emoji: '😈', label: 'Prank your friends' },
]

function Home() {
  useReveal()

  return (
    <div className="min-h-screen overflow-x-clip bg-gray-50 text-gray-900 antialiased">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="flex w-full max-w-xl items-center justify-between rounded-full border border-gray-200 bg-white/80 px-4 py-2 shadow-lg shadow-gray-900/5 backdrop-blur-md">
          <Logo to="/" />
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
            <a href="#how" className="transition hover:text-gray-900">How it works</a>
            <a href="#usecases" className="transition hover:text-gray-900">Use cases</a>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-1 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Open app <RiArrowRightLine />
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* Hero                                                              */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
        {/* Ambient glow */}
        <div aria-hidden className="absolute left-1/2 top-1/3 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/40 blur-[120px]" />
        <div aria-hidden className="absolute -z-10 h-[380px] w-[380px] translate-x-[20%] translate-y-[-5%] rounded-full bg-amber-200/30 blur-[100px]" />

        <span
          data-reveal
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-600"
        >
          <RiSpyLine className="text-base" />
          The sneakiest form builder on the internet
        </span>

        <h1
          data-reveal
          className="max-w-3xl text-balance text-[clamp(2.4rem,7vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-gray-900"
        >
          Get answers{' '}
          <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
            without asking
          </span>{' '}
          the question
        </h1>

        <p
          data-reveal
          className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-gray-500"
        >
          You want to know their favorite color, cake flavor, shoe size —
          but you can't just <em>ask</em>. Wrap your questions inside a
          believable offer page, share the link, and read their answers.
        </p>

        <div data-reveal className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-rose-500/25 transition hover:shadow-rose-500/40"
          >
            Build your first form
            <RiArrowRightLine className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how"
            className="rounded-full border border-gray-300 px-7 py-3.5 text-base font-semibold text-gray-600 transition hover:border-gray-900 hover:text-gray-900"
          >
            See how it works
          </a>
        </div>

        {/* ── Split proof: what THEY see vs what YOU see ────────────────── */}
        <div data-reveal className="mt-16 w-full max-w-3xl">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Left — what they see */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-900/5">
              <span className="absolute -top-3 left-4 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-700">
                What they see
              </span>
              <div className="mb-3 flex items-center gap-2">
                <img src="/az-logo.png" alt="Amazon" className="h-5 w-auto" />
                <span className="text-[10px] font-semibold text-gray-400">Great Indian Festival</span>
              </div>
              <img src="/amazon-prizes.png" alt="Prizes" className="h-28 w-full rounded-lg object-cover" />
              <div className="mt-3 space-y-2">
                <div className="rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-500">📧 Email Address</div>
                <div className="rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-500">🎂 What's your favorite cake flavor?</div>
                <div className="rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-500">🎨 Pick a color</div>
                <div className="rounded-md bg-gradient-to-r from-rose-500 to-amber-500 py-2 text-center text-xs font-bold text-white">
                  Submit Entry for Lucky Draw
                </div>
              </div>
            </div>

            {/* Right — what you see */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-900/5">
              <span className="absolute -top-3 left-4 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">
                What you see
              </span>
              <div className="mb-3 text-sm font-bold text-gray-900">📊 Responses Dashboard</div>
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Cake</th>
                      <th className="px-3 py-2">Color</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800 font-medium">
                    <tr>
                      <td className="px-3 py-2">priya@gmail.com</td>
                      <td className="px-3 py-2">Red Velvet 🍰</td>
                      <td className="px-3 py-2">Lavender 💜</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">amit@yahoo.com</td>
                      <td className="px-3 py-2">Chocolate</td>
                      <td className="px-3 py-2">Blue</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">sneha@icloud.com</td>
                      <td className="px-3 py-2">Butterscotch</td>
                      <td className="px-3 py-2">Mint Green</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                <span className="text-xs font-semibold text-emerald-700">3 submissions</span>
                <span className="text-[10px] text-emerald-600">Now you know her favorites 😏</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* How it works                                                      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="how" className="border-t border-gray-200 bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <span data-reveal className="text-sm font-semibold uppercase tracking-widest text-rose-500">
            How it works
          </span>
          <h2 data-reveal className="mt-3 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
            3 steps. Zero suspicion.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: '01',
                icon: RiEdit2Line,
                title: 'Disguise your questions',
                desc: 'Pick the Amazon offer preset. Swap in your real questions — "favorite cake?", "pick a color" — they blend right in.',
              },
              {
                n: '02',
                icon: RiShareForwardLine,
                title: 'Share the link',
                desc: 'Send the /offers/ link to your target. They see a legit-looking lucky draw page. No sign-up, no suspicion.',
              },
              {
                n: '03',
                icon: RiEyeLine,
                title: 'Read their answers',
                desc: 'Every submission lands in your dashboard instantly. Their favorite color, cake flavor, shoe size — all yours.',
              },
            ].map((step) => (
              <div
                key={step.n}
                data-reveal
                className="group relative rounded-3xl border border-gray-200 bg-gray-50 p-7 transition hover:-translate-y-1 hover:border-rose-300 hover:bg-white hover:shadow-lg"
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

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* Use cases                                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="usecases" className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span data-reveal className="text-sm font-semibold uppercase tracking-widest text-rose-500">
            Use cases
          </span>
          <h2 data-reveal className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
            For every time you can't just ask
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {useCases.map((uc) => (
              <div
                key={uc.label}
                data-reveal
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-rose-300 hover:shadow-md"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
                  {uc.emoji}
                </span>
                <span className="text-base font-semibold text-gray-900">{uc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* Features — compact                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-gray-200 bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <span data-reveal className="text-sm font-semibold uppercase tracking-widest text-rose-500">
            Under the hood
          </span>
          <h2 data-reveal className="mt-3 max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
            Looks real. Works fast. Stays private.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: RiSparkling2Line,
                title: 'Amazon-grade preset',
                desc: 'Festival branding, prize banners, and styled inputs out of the box.',
              },
              {
                icon: RiLockLine,
                title: 'Email always captured',
                desc: 'The email field is locked, required, and can\'t be removed by anyone.',
              },
              {
                icon: RiEyeLine,
                title: 'Live response table',
                desc: 'See every submission the moment it lands. No refresh needed.',
              },
            ].map((f) => (
              <div
                key={f.title}
                data-reveal
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:bg-white hover:shadow-md"
              >
                <f.icon className="h-7 w-7 text-rose-500" />
                <h3 className="mt-3 text-base font-bold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* CTA                                                               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-24">
        <div
          data-reveal
          className="mx-auto max-w-3xl rounded-[2.5rem] border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6 py-20 text-center"
        >
          <RiGiftFill className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-5 text-balance text-3xl font-extrabold leading-tight tracking-tight text-gray-900">
            You already know what you want to find out.
            <br />
            <span className="text-gray-400">Now wrap it in a form they'll actually fill.</span>
          </h2>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-rose-500/25 transition hover:shadow-rose-500/40"
          >
            Build your first form <RiArrowRightLine />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo to="/" size="sm" />
          <p className="text-xs text-gray-400">
            Sneaky forms for sweet reasons. No real prizes, promise. 🎈
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
