'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut } from 'lucide-react';

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground">
          Signed in as {session.user?.email}
        </p>
        <Button
          variant="outline"
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn('google')} className="flex items-center gap-2">
      <LogIn className="h-4 w-4" />
      Sign In with Google
    </Button>
  );
}