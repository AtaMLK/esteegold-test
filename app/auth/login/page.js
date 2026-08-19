import { Suspense } from "react";
import LoginForm from "@/app/_components/auth/login-form";

function LoginFormFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="animate-pulse text-sm tracking-[0.25em]">
        ESTEEHOUSE
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="w-screen">
      <Suspense fallback={<LoginFormFallback />}>
        <div className="flex min-h-screen items-center justify-center">
          <LoginForm />
        </div>
      </Suspense>
    </section>
  );
}