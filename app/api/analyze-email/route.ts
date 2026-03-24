import { NextRequest, NextResponse } from 'next/server'

type EmailAnalysis = {
  priority: 'low' | 'medium' | 'high' | 'critical'
  summary: string[]
  recommendedAction: 'respond' | 'review_later' | 'delegate' | 'archive'
  draftReply: string
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const prompt = `
You are an AI executive email assistant.

Analyze the email below.

Email:
Subject: ${email.subject}
From: ${email.fromName}
Body: ${email.body}

Instructions:
- Do NOT assume actions are already completed
- Do NOT invent specific deliverables unless explicitly mentioned
- Use cautious, professional language
- Prefer phrases like "I will prepare", "I’ll confirm", "I’ll follow up"
- Do NOT assume actions are already completed
- Do NOT invent deliverables (e.g. files, decks) unless explicitly stated
- Keep replies realistic and slightly cautious
- Sound like a competent executive assistant, not overly confident
- draftReply must be concise, professional, and action-oriented
- Avoid sounding robotic
`

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: 'You are a precise executive email assistant that returns structured JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'email_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high', 'critical'],
                },
                summary: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 3,
                  maxItems: 3,
                },
                recommendedAction: {
                  type: 'string',
                  enum: ['respond', 'review_later', 'delegate', 'archive'],
                },
                draftReply: {
                  type: 'string',
                },
              },
              required: ['priority', 'summary', 'recommendedAction', 'draftReply'],
            },
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'OpenAI request failed',
          details: data,
        },
        { status: response.status }
      )
    }

    let parsed: EmailAnalysis | null = data.output_parsed ?? null

    if (!parsed) {
      const text =
        data.output?.[0]?.content?.find((item: any) => item.type === 'output_text')?.text ??
        data.output?.[0]?.content?.[0]?.text

      if (text) {
        try {
          parsed = JSON.parse(text) as EmailAnalysis
        } catch {
          return NextResponse.json(
            {
              error: 'Failed to parse model JSON',
              raw: text,
              details: data,
            },
            { status: 500 }
          )
        }
      }
    }

    if (!parsed) {
      return NextResponse.json(
        {
          error: 'No parsed output returned',
          details: data,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('analyze-email route error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}