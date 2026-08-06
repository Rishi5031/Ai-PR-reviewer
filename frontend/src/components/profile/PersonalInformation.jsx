import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useUpdateProfile } from '../../hooks/useProfile';
import { useToast } from '../../contexts/ToastContext';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  username: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  bio: z.string().optional(),
  timezone: z.string().optional(),
});

export const PersonalInformation = ({ profile }) => {
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      company: profile?.company || '',
      job_title: profile?.job_title || '',
      bio: profile?.bio || '',
      timezone: profile?.timezone || '',
    }
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        username: profile.username || '',
        company: profile.company || '',
        job_title: profile.job_title || '',
        bio: profile.bio || '',
        timezone: profile.timezone || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profile updated successfully');
      reset(data); // reset form with new values so isDirty becomes false
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Manage your personal details and how you appear on CodeGuardian AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input 
              type="email" 
              value={profile?.email || ''} 
              disabled 
              className="bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">Your email address is managed through your authentication provider.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
              <Input 
                id="full_name" 
                placeholder="John Doe" 
                {...register('full_name')} 
                className={errors.full_name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="johndoe" 
                {...register('username')} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                placeholder="OpenAI" 
                {...register('company')} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input 
                id="job_title" 
                placeholder="Senior AI Engineer" 
                {...register('job_title')} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input 
                id="timezone" 
                placeholder="Asia/Kolkata" 
                {...register('timezone')} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea 
              id="bio"
              placeholder="Building AI Developer Tools..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              {...register('bio')}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              disabled={!isDirty || isSubmitting}
              onClick={() => reset()}
            >
              Discard Changes
            </Button>
            <Button 
              type="submit" 
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
