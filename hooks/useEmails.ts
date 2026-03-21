"use client"

import { useEffect, useState } from "react"
import rawEmails from "@/email.json" 
import { Email } from "@/lib/types" 

const STORAGE_KEY = "emailiq_emails_v3" 

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setEmails(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse emails", e)
      }
    } else {
      const initialData = (rawEmails as any[]).map(e => ({
        ...e,
        isActioned: e.isActioned || false,
        isRead: e.isRead || false,
        snoozedUntil: null
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
      setEmails(initialData)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emails))
    }
  }, [emails, loading])

  const markAsRead = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isRead: true } : e))
  }

  const archiveEmail = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isActioned: true, snoozedUntil: null } : e))
  }

  const snoozeEmail = (id: string, hours: number) => {
    const until = Date.now() + hours * 60 * 60 * 1000;
    setEmails(prev => prev.map(e => e.id === id ? { ...e, snoozedUntil: until, isRead: true } : e))
  }

  // Logic to determine what to show and how to sort
  const processedEmails = loading ? [] : emails
    .filter(e => {
      if (e.isActioned) return false;
      // Hide if snoozed and time hasn't passed yet
      if (e.snoozedUntil && e.snoozedUntil > Date.now()) return false;
      return true;
    })
    .sort((a, b) => {
      // If an email's snooze just expired, it goes to the very top
      const aExpired = a.snoozedUntil && a.snoozedUntil <= Date.now() ? 1 : 0;
      const bExpired = b.snoozedUntil && b.snoozedUntil <= Date.now() ? 1 : 0;
      return bExpired - aExpired;
    });

  return {
    emails: processedEmails,
    loading,
    markAsRead,
    archiveEmail,
    snoozeEmail,
    archiveAllNoise: () => setEmails(prev => prev.map(e => e.suggestedAction === "Archive" ? { ...e, isActioned: true } : e))
  }
}