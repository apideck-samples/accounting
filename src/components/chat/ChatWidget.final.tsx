'use client'

import { useChat } from '@ai-sdk/react'
import { useConnections } from 'hooks/useConnections'
import { useSession } from 'hooks/useSession'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ChatEmptyState } from './ChatEmptyState'
import { ChatHeader } from './ChatHeader'
import { ChatInputForm } from './ChatInputForm'
import { ToolResultRenderer } from './ToolResultRenderer'
import { TypingIndicator } from './TypingIndicator'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { session } = useSession()
  const { connection } = useConnections()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    body: {
      jwt: session?.jwt,
      serviceId: connection?.serviceId
    }
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  const handleExampleClick = (prompt: string) => {
    const event = {
      target: { value: prompt }
    } as React.ChangeEvent<HTMLInputElement>
    handleInputChange(event)
    setTimeout(() => {
      const submitEvent = new Event('submit') as any
      submitEvent.preventDefault = () => {
        /* no-op */
      }
      handleSubmit(submitEvent)
    }, 100)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 rounded-full shadow-xl transition-all duration-300 ease-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-500/50 flex items-center justify-center ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700 rotate-180'
            : 'bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg
            className="w-8 h-8 text-white transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-white transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
        {!isOpen && messages.length > 0 && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {messages.filter((m) => m.role === 'assistant').length}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[600px] h-700px] xl:w-[700px] xl:h-[800px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-out transform scale-100 origin-bottom-right animate-in slide-in-from-bottom-4">
          <ChatHeader connection={connection} />

          <div className="overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50 h-full">
            {messages.length === 0 ? (
              <ChatEmptyState onExampleClick={handleExampleClick} />
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-in slide-in-from-bottom-2 w-full`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                          : message.toolInvocations && message.toolInvocations.length > 0
                          ? ''
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {message.content && (
                        <div
                          className={`text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert ${
                            message.role === 'user' ? 'text-white' : ''
                          }`}
                        >
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                      {message.toolInvocations && message.toolInvocations.length > 0 && (
                        <div className={message.content ? 'mt-3' : ''}>
                          {message.toolInvocations.map((toolInvocation: any, toolIndex: number) => (
                            <ToolResultRenderer
                              key={`${message.id}-tool-${toolIndex}`}
                              toolInvocation={toolInvocation}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {status === 'streaming' && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2">
                    <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 max-w-[85%]">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInputForm
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            status={status}
            connectionName={connection?.name}
          />
        </div>
      )}
    </div>
  )
}
