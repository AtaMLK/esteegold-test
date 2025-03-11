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
