import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Plaese enter a valid email address",
  }),
  name: z.string().min(1, {
    message: "Please enter your name",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 chars.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 chars.",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Plaese enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 chars.",
  }),
});

export const ContactSchema = z.object({
  subject: z.string().min(10, {
    message: "Please write your contact subject",
  }),
  email: z.string().email({
    message: "Plaese enter a valid email address",
  }),
  Content: z.string().min(20, {
    message: "Please write your contact details",
  }),
});
export const BillingSchema = z.object({
  name: z.string().min(10, {
    message: "Please write your contact full name",
  }),
  adress: z.string().min(20, {
    message: "Plaese write your address",
  }),
  adress: z.string().min(20, {
    message: "Please write your address",
  }),
  provience: z.string().min(20, {
    message: "Please write your provience",
  }),
  city: z.string().min(20, {
    message: "Please write your city",
  }),
});
export const PaymentSchema = z.object({
  cardName: z
    .string()
    .min(3, { message: "Cardholder name must be at least 3 characters" }),
  cardNumber: z
    .string()
    .regex(/^[0-9]{16}$/, { message: "Card number must be 16 digits" }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, {
      message: "Expiry date must be MM/YY",
    }),
  cvv: z.string().regex(/^[0-9]{3,4}$/, {message: "Asdasdas"}),
});
