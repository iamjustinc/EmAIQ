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
      try { setEmails(JSON.parse(stored)) } catch (e) { console.error(e) }
    } else {
      const initialData = (rawEmails as any[]).map(e => ({
        ...e,
        isActioned: e.isActioned || false,
        isRead: e.isRead || false,
        isFavorite: e.isFavorite || false, // Initialize favorite status
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

  const toggleFavorite = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e))
  }

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

  const processedEmails = loading ? [] : emails
    .filter(e => {
      if (e.isActioned) return false;
      if (e.snoozedUntil && e.snoozedUntil > Date.now()) return false;
      return true;
    })
    .sort((a, b) => (b.snoozedUntil || 0) - (a.snoozedUntil || 0));

  return {
    emails: processedEmails,
    loading,
    markAsRead,
    archiveEmail,
    snoozeEmail,
    toggleFavorite, // Exported this
    archiveAllNoise: () => setEmails(prev => prev.map(e => e.suggestedAction === "Archive" ? { ...e, isActioned: true } : e))
  }
}