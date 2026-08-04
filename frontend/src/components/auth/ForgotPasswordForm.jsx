import React, { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRHForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => authService.forgotPassword(data),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("If an account exists with this email, a password reset link has been sent.");
    },
    onError: () => {
      // Security: we don't reveal if the email exists, just show success anyway or a generic error.
      setIsSuccess(true);
      toast.success("If an account exists with this email, a password reset link has been sent.");
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <Button 
        type="submit" 
        className="w-full font-semibold" 
        size="lg"
        isLoading={mutation.isPending}
        disabled={isSuccess}
      >
        Send Reset Link
      </Button>
    </form>
  );
};
