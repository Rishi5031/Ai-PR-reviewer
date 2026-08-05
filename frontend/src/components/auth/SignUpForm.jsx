import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { InputPassword } from '../ui/input-password';
import { useNavigate } from 'react-router-dom';

const signUpSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      const { confirmPassword, ...submitData } = data;
      return authService.signup(submitData);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Account created successfully! You can now sign in.", 3000);
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "An error occurred during sign up");
    }
  });

  const googleMutation = useMutation({
    mutationFn: (token) => authService.googleLogin(token),
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token);
      toast.success("Successfully signed in with Google!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Google sign in failed");
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      <div className="flex justify-center w-full pb-2">
        <GoogleLogin
          theme="outline"
          size="large"
          shape="rectangular"
          width="100%"
          logo_alignment="center"
          onSuccess={(credentialResponse) => {
            googleMutation.mutate(credentialResponse.credential);
          }}
          onError={() => {
            toast.error("Google sign in was unsuccessful");
          }}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">
            Or create account with email
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <Input
          id="full_name"
          type="text"
          label="Full Name"
          icon={User}
          {...register("full_name")}
        />
        {errors.full_name && <p className="text-sm text-destructive pl-1">{errors.full_name.message}</p>}
      </div>

      <div className="space-y-1">
        <Input
          id="email"
          type="email"
          label="Email Address"
          icon={Mail}
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-destructive pl-1">{errors.email.message}</p>}
      </div>
      
      <div className="space-y-1">
        <InputPassword
          id="password"
          label="Password"
          icon={Lock}
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-destructive pl-1">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <InputPassword
          id="confirmPassword"
          label="Confirm Password"
          icon={Lock}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-sm text-destructive pl-1">{errors.confirmPassword.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full font-semibold" 
        size="lg"
        isLoading={mutation.isPending || googleMutation.isPending}
        disabled={isSuccess}
      >
        Create Account
      </Button>
    </form>
  );
};
