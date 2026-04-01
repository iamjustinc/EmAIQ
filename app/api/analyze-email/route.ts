import { NextRequest, NextResponse } from 'next/server'

type EmailAnalysis = {
  priority: 'low' | 'medium' | 'high' | 'critical'
  summaryMode: 'none' | 'quick' | 'full'
  quickTakeaway: string
  summary: string[]
  recommendedAction: 'respond' | 'review_later' | 'delegate' | 'archive'
  draftReply: string
}

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const safeFirstName =
      typeof firstName === 'string' && firstName.trim().length > 0
        ? firstName.trim()
        : 'there'

    const prompt = `
You are an AI executive email assistant.

Analyze the email below.

Email:
Subject: ${email.subject ?? ''}
From: ${email.fromName ?? ''}
Body: ${email.body ?? ''}

Your job is to decide whether this email actually needs a summary.

Rules:
- If the email is already short, obvious, and easy to read, do NOT force a full summary
- Can have less than 3 bullets if the email is short and obvious 
- If the email has one clear ask and little ambiguity, use summaryMode = "none" or "quick"
- Only use summaryMode = "full" when the email is dense, multi-part, has buried details, multiple asks, or meaningful complexity
- The AI output must always be faster to read than the original email
- Never make the summary longer or more complicated than the source email
- For summaryMode = "none", summary must be [] and quickTakeaway must be ""
- For summaryMode = "quick", summary must be [] and quickTakeaway must be exactly one concise sentence
- For summaryMode = "full", quickTakeaway must be "" and summary must contain 2 or 3 useful bullets
- Summary bullets must be short, concrete, and non-redundant
- NEVER include meta commentary about summarization
- NEVER say things like "a short summary", "bullet points", "this email is simple"
- NEVER explain how you are summarizing
- Only output the actual content of the summary itself
- Extract only what is explicitly supported by the email
- Do NOT assume actions are already completed
- Do NOT invent deliverables unless explicitly mentioned
- Never use placeholders like [your name], [name], or [company]
- Sign the reply as "${safeFirstName}"
- Return a complete usable draftReply
- Use cautious, professional language
- Prefer phrases like "I will prepare", "I’ll confirm", "I’ll follow up"
- Keep replies realistic and slightly cautious
- Sound like a competent executive assistant, not overly confident
- draftReply must be concise, professional, and action-oriented
- Avoid sounding robotic

Recommended action guidance:
- respond = sender expects or likely needs a reply/action now
- review_later = useful but not urgent
- delegate = clearly better handled by someone else
- archive = informational and no action needed
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
            content:
              'You are a precise executive email assistant that returns structured JSON. Be selective about summarization and avoid AI theater.',
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
                summaryMode: {
                  type: 'string',
                  enum: ['none', 'quick', 'full'],
                },
                quickTakeaway: {
                  type: 'string',
                },
                summary: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 0,
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
              required: [
                'priority',
                'summaryMode',
                'quickTakeaway',
                'summary',
                'recommendedAction',
                'draftReply',
              ],
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

    if (parsed.summaryMode === 'none') {
      parsed.quickTakeaway = ''
      parsed.summary = []
    }

    if (parsed.summaryMode === 'quick') {
      parsed.summary = []
      parsed.quickTakeaway = parsed.quickTakeaway.trim()
    }

    if (parsed.summaryMode === 'full') {
      parsed.quickTakeaway = ''
      parsed.summary = parsed.summary
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3)
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('analyze-email route error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}