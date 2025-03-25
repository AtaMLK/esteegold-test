import { Toaster } from "@/components/ui/toaster";

function AuthLayoutt({ children }) {
  return (
    <section className="w-full" >
      <div className="h-screen flex items-center justify-center">{children}</div>
      <Toaster />
    </section>
  );
}

export default AuthLayoutt;
