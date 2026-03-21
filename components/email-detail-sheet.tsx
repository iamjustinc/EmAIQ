'use client';

import { Email } from '@/lib/types';
import { formatDateTime } from '@/lib/date-utils';
import { CategoryBadge } from '@/components/category-badge';
import { UrgencyBadge } from '@/components/urgency-badge';
import { ActionBadge } from '@/components/action-badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Reply,
  Clock,
  Archive,
  ListTodo,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Calendar,
  Zap,
  Target,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailDetailSheetProps {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive?: (emailId: string) => void;
}

const sentimentConfig: Record<Email['analysis']['sentiment'], { icon: typeof AlertCircle; style: string; bg: string }> = {
  Urgent: { icon: AlertCircle, style: 'text-danger', bg: 'bg-danger/10' },
  Formal: { icon: MessageSquare, style: 'text-info', bg: 'bg-info/10' },
  Casual: { icon: MessageSquare, style: 'text-success', bg: 'bg-success/10' },
  Frustrated: { icon: AlertCircle, style: 'text-warning', bg: 'bg-warning/10' },
};

const quickReplies = [
  "Got it, will send shortly.",
  "Thanks for the heads up. I'm on it.",
  "Let me check and get back to you.",
  "Can we sync on this briefly?",
];

export function EmailDetailSheet({ email, open, onOpenChange, onArchive }: EmailDetailSheetProps) {
  if (!email) return null;

  const sentimentStyle = sentimentConfig[email.analysis.sentiment];
  const SentimentIcon = sentimentStyle.icon;

  // Extract key request from first summary bullet
  const keyRequest = email.analysis.summary[0] || 'Review this email';

  const handleDraftReply = () => {
    toast.success('Draft reply started', {
      description: `Composing response to ${email.sender.name}`,
      icon: <Reply className="h-4 w-4" />,
    });
  };

  const handleSnooze = () => {
    toast('Email snoozed', {
      description: 'Will remind you in 2 hours',
      icon: <Clock className="h-4 w-4" />,
    });
  };

  const handleArchive = () => {
    onArchive?.(email.id);
    toast.success('Email archived', {
      description: `"${email.subject}" moved to archive`,
      icon: <Archive className="h-4 w-4" />,
    });
    onOpenChange(false);
  };

  const handleAddToTasks = () => {
    toast.success('Added to tasks', {
      description: `Created task from "${email.subject}"`,
      icon: <ListTodo className="h-4 w-4" />,
    });
  };

  const handleQuickReply = (reply: string) => {
    toast.success('Quick reply sent', {
      description: reply,
      icon: <Send className="h-4 w-4" />,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background border-border p-0 flex flex-col">
        <SheetHeader className="border-b border-border p-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base font-semibold text-foreground leading-snug pr-6">
                {email.subject}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Email details and AI analysis for {email.subject}
              </SheetDescription>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{email.sender.name}</span>
                <span className="text-muted-foreground text-xs">{email.sender.email}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateTime(email.receivedAt)}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Key Request */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Key Request</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{keyRequest}</p>
            </div>

            {/* AI Summary */}
            <div className="rounded-lg border border-border bg-card/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Summary</span>
              </div>
              <ul className="space-y-1.5">
                {email.analysis.summary.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detected Deadline */}
            {email.analysis.detectedDeadline && (
              <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
                <Calendar className="h-4 w-4 text-warning shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-warning uppercase tracking-wide">Deadline</p>
                  <p className="text-sm text-foreground font-medium">{email.analysis.detectedDeadline}</p>
                </div>
              </div>
            )}

            {/* Next Best Action */}
            <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-3">
              <Zap className="h-4 w-4 text-success shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-success uppercase tracking-wide">Next Best Action</p>
                <p className="text-sm text-foreground font-medium">{email.suggestedAction}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              <CategoryBadge category={email.category} />
              <UrgencyBadge label={email.urgency.label} score={email.urgency.score} showScore />
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${sentimentStyle.bg} ${sentimentStyle.style}`}>
                <SentimentIcon className="h-3 w-3" />
                {email.analysis.sentiment}
              </span>
              <ActionBadge action={email.suggestedAction} />
            </div>

            {/* Quick Replies */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">One-Click Replies</p>
              <div className="grid grid-cols-1 gap-1.5">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-left text-sm text-foreground/80 hover:bg-sidebar-accent hover:text-foreground hover:border-primary/30 transition-all duration-150"
                  >
                    <Send className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{reply}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Preview */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {email.bodyPreview}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border p-3 space-y-2 bg-card/30">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleDraftReply}
            >
              <Reply className="h-3.5 w-3.5" />
              Draft Reply
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1.5 border-border bg-card text-foreground hover:bg-sidebar-accent"
              onClick={handleSnooze}
            >
              <Clock className="h-3.5 w-3.5" />
              Snooze
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1.5 border-border bg-card text-foreground hover:bg-sidebar-accent"
              onClick={handleArchive}
            >
              <Archive className="h-3.5 w-3.5" />
              Archive
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1.5 border-border bg-card text-foreground hover:bg-sidebar-accent"
              onClick={handleAddToTasks}
            >
              <ListTodo className="h-3.5 w-3.5" />
              Add to Tasks
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
