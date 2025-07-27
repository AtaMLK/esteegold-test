import ToastContainer from "@/app/_components/ui/ToastContainer";

function AuthLayoutt({ children }) {
  return (
    <section className="w-full">
      <ToastContainer />
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}

export default AuthLayoutt;
