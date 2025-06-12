import { openai } from '@ai-sdk/openai'
import { pipeDataStreamToResponse, streamText } from 'ai'
import { createAccountingTools } from 'lib/ai-tools'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, jwt, serviceId } = req.body

    console.log('Chat API called')
    console.log('Received data:', {
      hasMessages: !!messages,
      hasJwt: !!jwt,
      hasServiceId: !!serviceId
    })

    if (!messages || !jwt || !serviceId) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: { messages: !!messages, jwt: !!jwt, serviceId: !!serviceId }
      })
    }

    console.log('Creating tools and starting streaming response...')

    pipeDataStreamToResponse(res, {
      execute: async (dataStream) => {
        const result = await streamText({
          model: openai('gpt-4o-mini'),
          system:
            'You are a helpful assistant for accounting data. Use the available tools to answer user questions about customers, invoices, expenses, and financial reports. IMPORTANT: After calling any tool, you MUST provide a clear, formatted response summarizing the results in a user-friendly way.',
          messages,
          tools: createAccountingTools({ jwt, serviceId }),
          maxTokens: 1000,
          temperature: 0.7,
          toolChoice: 'auto'
        })

        result.mergeIntoDataStream(dataStream)
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
