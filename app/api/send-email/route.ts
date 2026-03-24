import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing to, subject, or body' },
        { status: 400 }
      )
    }

    const from = process.env.RESEND_FROM_EMAIL

    if (!from) {
      return NextResponse.json(
        { error: 'Missing RESEND_FROM_EMAIL' },
        { status: 500 }
      )
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text: body,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
    })
  } catch (err) {
    console.error('send-email route error:', err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}