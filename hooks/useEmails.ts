"use client"

import { useEffect, useState } from "react"
import rawEmails from "@/email.json" 
import { Email } from "@/lib/types" 

const STORAGE_KEY = "emailiq_emails_v2" 

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Browser Check: Prevent 'localStorage is not defined' error during Vercel build
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
        isRead: e.isRead || false
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
      setEmails(initialData)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // 2. Persistence: Only save if we aren't loading and are in the browser
    if (!loading && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emails))
    }
  }, [emails, loading])

  const markAsRead = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isRead: true } : e))
  }

  const archiveEmail = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isActioned: true } : e))
  }

  const archiveAllNoise = () => {
    setEmails(prev => prev.map(e => 
      e.suggestedAction === "Archive" ? { ...e, isActioned: true } : e
    ))
  }

  return {
    // Return empty list if loading to prevent layout shift during hydration
    emails: loading ? [] : emails.filter(e => !e.isActioned),
    loading,
    markAsRead,
    archiveEmail,
    archiveAllNoise
  }
}