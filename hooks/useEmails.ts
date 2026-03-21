"use client"

import React, { useEffect, useState } from "react"
import rawEmails from "@/email.json" 
import { Email } from "@/lib/types" // Import the full interface here!

const STORAGE_KEY = "emailiq_emails_v2" // Changed key to force a refresh of data

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setEmails(JSON.parse(stored))
    } else {
      // Map the JSON to ensure isActioned and isRead are set
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
    if (!loading) {
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
    emails: emails.filter(e => !e.isActioned),
    loading,
    markAsRead,
    archiveEmail,
    archiveAllNoise
  }
}