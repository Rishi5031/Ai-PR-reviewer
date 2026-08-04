import React, { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { GoogleLogin } from '@react-oauth/google';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/auth.service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { InputPassword } from '../ui/input-password';
import { Link, useNavigate } from 'react-router-dom';

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRHForm({
    resolver: zodResolver(signInSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => authService.signin(data),
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token);
      toast.success("Successfully signed in!");
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "An error occurred during sign in");
    }
  });

  const googleMutation = useMutation({
    mutationFn: (token) => authService.googleLogin(token),
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token);
      toast.success("Successfully signed in with Google!");
      navigate('/');
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
            Or continue with email
          </span>
        </div>
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
        <div className="flex justify-end pt-1">
          <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full font-semibold" 
        size="lg"
        isLoading={mutation.isPending || googleMutation.isPending}
      >
        Sign In
      </Button>
    </form>
  );
};
