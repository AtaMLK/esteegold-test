import { Toaster } from "@/components/ui/toaster";

function AuthLayoutt({ children }) {
  return (
    <section className="w-full">
      <Toaster />
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}

export default AuthLayoutt;
