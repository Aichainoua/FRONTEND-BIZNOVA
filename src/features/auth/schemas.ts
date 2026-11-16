import { z } from 'zod';
import { isEmail, isPasswordValid } from '../../utils/validation';

const email = z
  .string()
  .trim()
  .min(1, 'Saisissez votre adresse email.')
  .refine((v) => v === '' || isEmail(v), 'Cette adresse email semble incorrecte.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Saisissez votre mot de passe.'),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Saisissez votre nom complet.'),
    email,
    password: z.string().refine(isPasswordValid, 'Utilisez au moins 8 caractères, avec une lettre et un chiffre.'),
    confirmPassword: z.string().min(1, 'Saisissez à nouveau votre mot de passe.'),
    acceptedTerms: z.boolean().refine((v) => v === true, 'Acceptez les conditions pour créer votre compte.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les deux mots de passe ne correspondent pas.',
  });

export const forgotPasswordSchema = z.object({ email });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
