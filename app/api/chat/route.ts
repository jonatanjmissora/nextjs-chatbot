import { google } from "@ai-sdk/google"
import { streamText, type Message } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
  })

  return result.toDataStreamResponse()
}
