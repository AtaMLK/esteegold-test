function AuthHeader({ title, label }) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center ">
      <h1 className="text-3xl font-semibold uppercase">{title}</h1>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

export default AuthHeader;
