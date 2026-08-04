import React, { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../ui/button';
import { InputPassword } from '../ui/input-password';

const resetPasswordSchema = z.object({
  new_password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenError, setIsTokenError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRHForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => authService.resetPassword({ token, ...data }),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Your password has been reset successfully. Redirecting to login...", 3000);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "An error occurred while resetting your password.");
    }
  });

  const onSubmit = (data) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    mutation.mutate(data);
  };

  if (!token && !isTokenError) {
    setIsTokenError(true);
    setTimeout(() => {
      toast.error("Missing password reset token. Please use the link sent to your email.");
    }, 100);
  }

  if (!token) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Missing password reset token. Please use the link sent to your email.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <InputPassword
          id="new_password"
          label="New Password"
          icon={Lock}
          {...register("new_password")}
        />
        {errors.new_password && (
          <p className="text-sm text-destructive pl-1">{errors.new_password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <InputPassword
          id="confirm_password"
          label="Confirm Password"
          icon={Lock}
          {...register("confirm_password")}
        />
        {errors.confirm_password && (
          <p className="text-sm text-destructive pl-1">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full font-semibold" 
        size="lg"
        isLoading={mutation.isPending}
        disabled={isSuccess || !token}
      >
        Reset Password
      </Button>
    </form>
  );
};
