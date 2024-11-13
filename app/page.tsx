"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Brain, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/5 to-background py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Create Unique Emojis with{' '}
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Transform your ideas into expressive emojis instantly. Powered by advanced AI,
              designed for your creativity.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href={user ? "/generate" : "/signup"}>
                {user ? "Start Creating" : "Sign Up to Create"}
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/30 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Create your perfect emoji in three simple steps
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Describe Your Emoji
                </CardTitle>
                <CardDescription>
                  Tell us what you want your emoji to look like using natural language
                </CardDescription>
              </CardHeader>
              <CardContent>
                Simply type your idea in plain English. Want a happy cat with sunglasses? Just
                say so!
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Processing
                </CardTitle>
                <CardDescription>
                  Our AI understands your description and creates the perfect emoji
                </CardDescription>
              </CardHeader>
              <CardContent>
                Advanced AI technology processes your request and generates a unique emoji
                matching your description.
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Get Your Emoji
                </CardTitle>
                <CardDescription>
                  Download your custom emoji ready to use anywhere
                </CardDescription>
              </CardHeader>
              <CardContent>
                Your emoji is ready to download and use in messages, social media, or
                anywhere you want to express yourself.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}