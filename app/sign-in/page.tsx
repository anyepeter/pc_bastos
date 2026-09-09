import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import { sanitizeRedirect } from '@/lib/auth/redirect';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to the CEPCA dashboard.',
  robots: { index: false, follow: false },
};

/** The session is read live, so a signed-in visitor never sees this page. */
export const dynamic = 'force-dynamic';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { redirect?: string | string[] };
}) {
  const raw = Array.isArray(searchParams.redirect)
    ? searchParams.redirect[0]
    : searchParams.redirect;
  const redirectTo = sanitizeRedirect(raw);

  const session = await getSession();
  if (session) redirect(redirectTo);

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        {/* ------------------------------------------------------- brand side */}
        <aside className="relative hidden overflow-hidden bg-plum-900 lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-20">
          <Image
            src="/images/hero-image.jpg"
            alt=""
            fill
            priority
            sizes="55vw"
            className="object-cover opacity-25"
          />
          {/* Plum wash over the photograph so the type stays readable whatever
              the image does behind it. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-plum-950/[0.92] via-plum-900/[0.88] to-plum-800/[0.82]"
          />

          <div className="relative">
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-3 rounded-lg text-white/90 transition-colors hover:text-white"
            >
              <Image
                src="/images/logo_CEPCA.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-lg bg-white/90 object-contain p-1"
              />
              <span className="font-display text-xl font-semibold tracking-tight">
                CEPCA
              </span>
            </Link>
          </div>

          <div className="relative max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-leaf-300">
              Council secretariat
            </p>
            <h1 className="mt-5 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-white xl:text-[3.25rem]">
              The dashboard behind the council&apos;s public work.
            </h1>
            <p className="mt-6 max-w-md font-ui text-[15px] leading-relaxed text-white/70">
              Blog posts, events, workshops, charity programmes and the member
              church directory — all edited here, in English and French, and
              published when both languages are ready.
            </p>
          </div>

          <div className="relative flex items-center gap-3 font-ui text-[13px] text-white/60">
            <ShieldCheck className="h-4 w-4 text-leaf-300" aria-hidden />
            <span>Member churches see only their own page.</span>
          </div>
        </aside>

        {/* -------------------------------------------------------- form side */}
        <div className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-[26rem]">
            {/* Small-screen masthead — the brand panel is hidden below lg. */}
            <Link
              href="/"
              className="focus-ring mb-10 inline-flex items-center gap-2 rounded-lg font-ui text-[13px] font-medium text-ink-500 transition-colors hover:text-plum-700 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to cepca.org
            </Link>

            <div className="mb-9">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-plum-600">
                Dashboard
              </p>
              <h2 className="mt-3 font-display text-[2.125rem] font-semibold leading-tight tracking-tight text-ink-900">
                Sign in
              </h2>
              <p className="mt-3 font-ui text-[15px] leading-relaxed text-ink-500">
                Use the email address the secretariat set up for you.
              </p>
            </div>

            <div className="card rounded-2xl p-7 sm:p-8">
              <LoginForm redirectTo={redirectTo} />
            </div>

            <Link
              href="/"
              className="focus-ring mt-8 hidden items-center gap-2 rounded-lg font-ui text-[13px] font-medium text-ink-400 transition-colors hover:text-plum-700 lg:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to cepca.org
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
