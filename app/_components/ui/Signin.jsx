import { signIn } from "next-auth/react";
function Signin() {
  return (
    <div>
      <button onClick={() => signIn("instagram")}>Sign in</button>
    </div>
  );
}

export default Signin;
