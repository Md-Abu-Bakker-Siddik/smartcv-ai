import Link from "next/link";
import { signInAction } from "@/app/(auth)/actions";

type SignInPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

const errorMessages: Record<string, string> = {
  invalid_input: "Please enter a valid email and password.",
  invalid_credentials: "Email or password is incorrect.",
  email_not_confirmed: "Email not confirmed. Please verify your email first.",
};

const successMessages: Record<string, string> = {
  check_email: "Account created. Please confirm your email, then sign in.",
  confirmation_sent: "Confirmation email sent again. Please verify your inbox/spam.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : null;
  const successMessage = params.success ? successMessages[params.success] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Sign in to SmartCV AI</h1>
        <p className="mt-2 text-sm text-slate-300">
          Continue building your resume and ATS optimization workflow.
        </p>
        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}

        <form action={signInAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300 focus:ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300 focus:ring"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <Link href="/forgot-password" className="hover:text-cyan-300">
            Forgot password?
          </Link>
          <Link href="/sign-up" className="hover:text-cyan-300">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
