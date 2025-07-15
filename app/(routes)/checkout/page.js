"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BillingSchema, PaymentSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useForm } from "react-hook-form";
import BankCard from "@/app/_components/ui/Moving3DCard";
import CheckoutButton from "@/app/_components/CheckoutButton";
import Loading from "@/app/_components/loading/loading";

function CheckOut() {
  const [isLoading, setIsLoading] = useState();
  const form = useForm({
    resolver: zodResolver(BillingSchema),
    defaultValues: {
      name: "",
      address: "",
      provience: "",
      city: "",
    },
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  function onSubmit(data) {
    setIsLoading(true);
    console.log(data);
  }
  return (
    <div className="w-full h-full flex flex-col gap-10 md:grid grid-cols-2">
      <div className="billing-section p-20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h1>Address</h1>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your fullname"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your address"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provience</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="choose your Provience"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Choose your city"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button
              variant="outline"
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:text-gray-400 text-3xl
                 py-3 rounded-md hover:bg-green-700 text-gray-200 transition"
            >
              Save Address
            </Button>
          </form>
        </Form>
      </div>
      <div className="payment-section p-20">
        <BankCard />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h1>Payment</h1>
              <FormField
                control={form.control}
                name="holder name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Holder Name </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the name on the card"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="card number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter card number "
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last usage date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provience</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="enter card usage date"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Choose your city"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Loading />
            <Button
              variant="outline"
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:text-gray-400 text-3xl
                 py-3 rounded-md hover:bg-green-700 text-gray-200 transition"
            >
              <CheckoutButton />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CheckOut;
