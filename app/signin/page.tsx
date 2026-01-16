// app/signin/page.tsx
// FULL FILE — COPY / PASTE

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <a
        href="/api/auth/signin"
        className="px-4 py-2 rounded-lg bg-black text-white"
      >
        Sign in with Google
      </a>
    </div>
  );
}
