import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { useAccountInfo } from '../../hooks/useProfile';
import { Info, User as UserIcon, Calendar, Clock, CheckCircle2, XCircle, Shield } from 'lucide-react';

export const AccountInformation = ({ profile }) => {
  const { data: accountInfo, isLoading } = useAccountInfo();

  if (isLoading) {
    return <div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Loading account information...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Account Information
        </CardTitle>
        <CardDescription>
          Read-only information about your CodeGuardian AI account status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 max-w-3xl">
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              User ID
            </span>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded w-fit text-foreground truncate max-w-full">
              {profile?.id}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              Primary Authentication
            </span>
            <span className="text-sm text-foreground capitalize">
              {accountInfo?.authentication_provider === 'password_login' || accountInfo?.authentication_provider === 'email'
                ? 'Email & Password'
                : accountInfo?.authentication_provider}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Account Created
            </span>
            <span className="text-sm text-foreground">
              {formatDate(accountInfo?.account_created)}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last Profile Update
            </span>
            <span className="text-sm text-foreground">
              {formatDate(accountInfo?.last_login)}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Email Status
            </span>
            <span className="text-sm flex items-center gap-2">
              {accountInfo?.email_verified ? (
                <span className="text-green-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Verified
                </span>
              ) : (
                <span className="text-yellow-500 font-medium flex items-center gap-1">
                  <XCircle className="h-4 w-4" /> Unverified
                </span>
              )}
            </span>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};
