'use client';

import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw, Sparkles } from 'lucide-react';

export default function DemoPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <Header title="Demo Mode" showSearch={false} showFilters={false} />
        
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Demo Mode</h2>
            <p className="mt-3 text-muted-foreground">
              Experience EmailIQ with simulated real-time email processing. 
              Watch as AI analyzes incoming emails and provides smart recommendations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="h-4 w-4" />
                Start Demo
              </Button>
              <Button variant="outline" className="gap-2 border-border bg-card text-foreground hover:bg-sidebar-accent">
                <RefreshCw className="h-4 w-4" />
                Reset Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
