"use client";
import { useAuthStore } from "@/app/_lib/authStore";
import CardWrapper from "./card-wrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const signInWithEmail = useAuthStore((state) => state.signInWithEmail);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await signInWithEmail(data.email, data.password);
      if (!user) {
        throw new Error("Unable to sign in with these credentials.");
      }
      router.push("/");
    } catch (error) {
      console.error("Login error", error.message);
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login error", error.message);
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };

  return (
    <CardWrapper
      label="Login to your account"
      title="Login"
      backButtonHref="/register"
      backButtonLabel="Dont have account ? Create here"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="johndoe@gmail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              variant="outline"
              type="submit"
              className="w-full text-green-200 bg-green-600 border-green-700 hover:bg-green-800"
              disabled={isLoading}
            >
              {isLoading ? "...Loading" : "Login"}
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-2 text-white bg-blue-400 border-blue-900 hover:bg-red-500"
              disabled={isLoading}
            >
              Login With Google
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default LoginForm;
