import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { InputPassword } from '../ui/input-password';
import { useChangePassword } from '../../hooks/useProfile';
import { useToast } from '../../contexts/ToastContext';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// Regex constants
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialRegex = /[!@#$%^&*(),.?":{}|<>]/;

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(uppercaseRegex, "Must contain uppercase letter")
    .regex(lowercaseRegex, "Must contain lowercase letter")
    .regex(numberRegex, "Must contain number")
    .regex(specialRegex, "Must contain special character"),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
}).refine((data) => data.current_password !== data.new_password, {
  message: "New password must be different from current password",
  path: ["new_password"],
});

export const SecuritySettings = () => {
  const { toast } = useToast();
  const changePassword = useChangePassword();
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  const newPassword = watch('new_password', '');

  // Calculate password strength
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (uppercaseRegex.test(pwd) && lowercaseRegex.test(pwd)) strength += 1;
    if (numberRegex.test(pwd)) strength += 1;
    if (specialRegex.test(pwd)) strength += 1;
    return strength;
  };

  const strength = calculateStrength(newPassword);

  const getStrengthLabel = () => {
    if (strength === 0) return 'None';
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const onSubmit = async (data) => {
    try {
      await changePassword.mutateAsync(data);
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
          
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <InputPassword 
              id="current_password" 
              placeholder="Enter your current password"
              {...register('current_password')}
              error={!!errors.current_password}
            />
            {errors.current_password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <InputPassword 
              id="new_password" 
              placeholder="Enter new password"
              {...register('new_password')}
              error={!!errors.new_password}
            />
            {/* Strength Indicator */}
            {newPassword && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={cn("font-medium", {
                    "text-red-500": strength <= 2,
                    "text-yellow-500": strength === 3,
                    "text-green-500": strength === 4
                  })}>{getStrengthLabel()}</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step} 
                      className={cn("h-full flex-1 transition-colors duration-300", 
                        strength >= step ? getStrengthColor() : "bg-transparent"
                      )} 
                    />
                  ))}
                </div>
              </div>
            )}
            {errors.new_password && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4 shrink-0" /> {errors.new_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <InputPassword 
              id="confirm_password" 
              placeholder="Confirm new password"
              {...register('confirm_password')}
              error={!!errors.confirm_password}
            />
            {errors.confirm_password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.confirm_password.message}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
