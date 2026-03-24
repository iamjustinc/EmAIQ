import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing RESEND_API_KEY' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const { to, subject, body } = await req.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing to, subject, or body' },
        { status: 400 }
      )
    }

    // ✅ THIS is the correct way
    const from = 'Alex <onboarding@resend.dev>'

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text: body,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('send-email route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}