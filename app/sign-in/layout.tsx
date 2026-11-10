import RootShell from '@/components/RootShell';

/** The dashboard login: a root layout of its own, in English (see app/layout.tsx). */
export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <RootShell language="en">{children}</RootShell>;
}
