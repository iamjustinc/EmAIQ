"use client"

// 1. Fixed the React imports to clear lines 3, 25, and 26
import React, { useState, useEffect } from "react"
import rawEmails from "@/email.json"

// 2. We define the Email structure clearly
export interface Email {
  id: string
  subject: string
  sender: {
    name: string
    email: string
    avatar?: string
  }
  isRead: boolean
  isActioned: boolean
  category: string
  priority: string
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
      // We ensure the data from your JSON fits the interface
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
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, isRead: true } : email
      )
    )
  }

  const archiveEmail = (id: string) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, isActioned: true } : email
      )
    )
  }

  return {
    emails: emails.filter(e => !e.isActioned),
    loading,
    markAsRead,
    archiveEmail,
  }
}