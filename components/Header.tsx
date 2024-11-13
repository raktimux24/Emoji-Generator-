"use client";

import Link from 'next/link';
import { Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">KaraoGen</span>
            </Link>
            
            {user && (
              <div className="hidden space-x-6 sm:flex">
                <Link 
                  href="/generate" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Generate
                </Link>
                <Link 
                  href="/gallery" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Gallery
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default">
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}