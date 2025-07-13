"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { ContactSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";

function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  /* const [pending] = useFormStatus(); */
  const form = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      subject: "",
      email: "",
      content: "",
    },
  });
  const DynamicMap = dynamic(() => import("../_components/ui/map"), {
    ssr: false,
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    console.log("Submitted data:", data);
  };

  return (
    <div className="w-full h-full">
      <div className=" contact-section flex flex-col md:mx-32 lg:mx-2 lg:grid grid-cols-2 gap-10 mt-32 ">
        <div className="contact-form p-20">
          <h1> Contact Us</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                {/*  Subject field */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Contact title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="*******"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            type="text"
                            placeholder="I want to contact your regarding ..."
                            className="h-40 w-full focus:outline-green-800 focus:ring-green-800"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Button
                variant="outline"
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-gray-900 text-3xl
                 py-3 rounded-md hover:bg-green-700 hover:text-gray-200 transition"
              >
                {isLoading ? "Submitting..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="address-map p-20 z-0">
          <DynamicMap lat={41.102856} lng={28.984782} zoom={15} />
        </div>
      </div>
    </div>
  );
}

export default Contact;
