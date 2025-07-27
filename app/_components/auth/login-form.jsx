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
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { pending } = useFormStatus();
  const [isLoading, setIsLoading] = useState();
  const { signInWithEmail, signInWithGoogle } = useAuthStore();

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
      console.log("Logged in user:", user);

      if (user) {
        const adminEmails = ["setareh@gmail.com", "admin@admin.com"];
        if (adminEmails.includes(user.email)) {
          console.log("User is admin, redirecting to /admin");
          router.push("/admin");
        } else {
          console.log("User is normal, redirecting to /");
          router.push("/");
        }
      } else {
        toast({
          variant: "destructive",
          message: "You should create an account first.",
        });
      }
    } catch (error) {
      console.error("Login error", error.message);
      toast({
        variant: "destructive",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
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
