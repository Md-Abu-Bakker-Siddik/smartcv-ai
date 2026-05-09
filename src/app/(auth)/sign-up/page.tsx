import Link from "next/link";
import { signUpAction } from "@/app/(auth)/actions";

type SignUpPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  invalid_input: "Please enter valid email and password.",
  email_exists: "This email is already registered. Please sign in.",
  signup_failed: "Could not create account. Please try again.",
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Create your SmartCV AI account</h1>
        <p className="mt-2 text-sm text-slate-300">
          Start with the free plan and build your first ATS-ready resume.
        </p>
        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </p>
        ) : null}

        <form action={signUpAction} className="mt-6 space-y-4">
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
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-cyan-300 hover:text-cyan-200">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
