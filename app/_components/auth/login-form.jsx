"use client";
import CardWrapper from "./card-wrapper";

import { auth } from "@/app/firebase/firebase";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";

function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [isLoading, setIsLoading] = useState();

  const { pending } = useFormStatus();

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
      const user = await signInWithEmailAndPassword(data.email, data.password);
      {
        user
          ? router.push("/dashboard")
          : toast({
              variant: "destructive",
              description: "You should create account first.",
            });
      }
    } catch {
      consolge.error("login message", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardWrapper
      label="Login to your account"
      title="Login"
      backButtonHref="/auth/register"
      backButtonLabel="Dont have account ? Create here"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
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

          {/* Submit Button */}
          <Button
            variant="outline"
            type="submit"
            className="w-full text-green-200 bg-green-600 border-green-700 hover:bg-green-800"
            disabled={pending}
          >
            {isLoading ? "...Loading " : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default LoginForm;
