import Link from "next/link";
import { resetPasswordAction } from "@/app/(auth)/actions";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-300">
          Enter your account email and we will send a reset link.
        </p>

        <form action={resetPasswordAction} className="mt-6 space-y-4">
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
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Send reset link
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          Back to{" "}
          <Link href="/sign-in" className="text-cyan-300 hover:text-cyan-200">
            sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
