"use client";

import { signInWithGoogle, signInWithEmail } from "@/app/_lib/auth";
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
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { pending } = useFormStatus();
  const [isLoading, setIsLoading] = useState();

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
      const user = await signInWithEmail(data.email, data.password); // Use the correct function
      if (user) {
        router.push("/"); // Redirect to dashboard if user exists
      } else {
        toast({
          variant: "destructive",
          description: "You should create an account first.",
        });
      }
    } catch (error) {
      console.error("Login error", error.message); // Log detailed error
      toast({
        variant: "destructive",
        description: error.message, // Display error message
      });
    } finally {
      setIsLoading(false); // Stop loading state
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
          <div>
            <Button
              variant="outline"
              type="submit"
              className="w-full text-green-200 bg-green-600 border-green-700 hover:bg-green-800"
              disabled={pending}
            >
              {isLoading ? "...Loading " : "Login"}
            </Button>
            <Button
              variant="outline"
              onClick={() => signInWithGoogle()}
              className="w-full mt-2 text-white bg-blue-400 border-blue-900 hover:bg-red-500"
              disabled={pending}
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
