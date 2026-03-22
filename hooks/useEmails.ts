"use client"

import { useEffect, useState } from "react"
import rawEmails from "@/email.json" 
import { Email } from "@/lib/types" 

const STORAGE_KEY = "emaiq_emails_v3" 

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
        isSent: e.isSent || false, // New property
        isRead: e.isRead || false,
        isFavorite: e.isFavorite || false,
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

  const markAsSent = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isSent: true, isRead: true, snoozedUntil: null } : e))
  }

  const toggleFavorite = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e))
  }

  const snoozeEmail = (id: string, hours: number) => {
    const until = Date.now() + hours * 60 * 60 * 1000;
    setEmails(prev => prev.map(e => e.id === id ? { ...e, snoozedUntil: until, isRead: true } : e))
  }

  const inboxEmails = loading ? [] : emails
    .filter(e => {
      if (e.isActioned || e.isSent) return false; // Hide both from Inbox
      if (e.snoozedUntil && e.snoozedUntil > Date.now()) return false;
      return true;
    })
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

  return {
    emails: inboxEmails,
    allEmails: emails,
    loading,
    markAsRead,
    archiveEmail,
    markAsSent,
    snoozeEmail,
    toggleFavorite,
    archiveAllNoise: () => setEmails(prev => prev.map(e => e.suggestedAction === "Archive" ? { ...e, isActioned: true } : e))
  }
}