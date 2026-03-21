"use client"

import React, { useEffect, useState } from "react"
import rawEmails from "@/email.json" // Updated to match your 'email.json' filename

export interface Email {
  id: string
  subject: string
  sender: { name: string; email: string; avatar?: string }
  isRead: boolean
  isActioned: boolean
  category: string
  priority: string
  suggestedAction?: string
}

const STORAGE_KEY = "emailiq_emails"

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setEmails(JSON.parse(stored))
    } else {
      const initialData = (rawEmails as any[]).map(e => ({
        ...e,
        isActioned: false,
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

  // 🧨 The Bonus: Archive All Noise logic
  const archiveAllNoise = () => {
    setEmails(prev => prev.map(e => e.suggestedAction === "Archive" ? { ...e, isActioned: true } : e))
  }

  return {
    emails: emails.filter(e => !e.isActioned), // Only show active emails
    loading,
    markAsRead,
    archiveEmail,
    archiveAllNoise
  }
}