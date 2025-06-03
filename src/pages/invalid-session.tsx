import { Button, TextInput } from '@apideck/components'
import { useSession } from 'hooks'
import { NextPage } from 'next'
import { useState } from 'react'

const InvalidSessionPage: NextPage = () => {
  const [consumerId, setConsumerId] = useState('')
  const [userName, setUserName] = useState('Lebron James')
  const [email, setEmail] = useState('lebron@lakers.com')
  const [image, setImage] = useState(
    'https://pyxis.nymag.com/v1/imgs/847/0f7/504c63a03d8a751a5cbeda0bc064306bb4-lebron-james.rsquare.w400.jpg'
  )
  const { createSession, isLoading } = useSession()

  function generateRandomId() {
    return 'test_consumer_' + Math.random().toString(36).substring(2, 10)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-xl sm:max-w-sm sm:w-full">
        <img src="/img/logo.png" className="w-20 h-20 mx-auto -mt-10 rounded-full shadow-lg" />
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-xl font-semibold leading-6 text-gray-800">Invalid session</h3>

          <p className="my-3 text-gray-500 pb-3 border-b border-gray-100">
            You seem to have a invalid session. Enter a consumer ID and create a new test session.
          </p>
          <div className="space-y-3 text-left">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-5 text-gray-700 mb-1"
              >
                Username
              </label>
              <TextInput
                onChange={(e) => setUserName(e.currentTarget.value)}
                value={userName}
                name="username"
                placeholder="Username"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-5 text-gray-700 mb-1"
              >
                Email
              </label>
              <TextInput
                onChange={(e) => setEmail(e.currentTarget.value)}
                value={email}
                name="email"
                placeholder="Email"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-5 text-gray-700 mb-1"
              >
                Image
              </label>
              <TextInput
                onChange={(e) => setImage(e.currentTarget.value)}
                value={image}
                name="image"
                placeholder="Profile image"
              />
            </div>
            <div>
              <label
                htmlFor="consumerId"
                className="block text-sm font-medium leading-5 text-gray-700 mb-1"
              >
                Consumer ID*
              </label>
              <div className="flex space-x-3">
                <TextInput
                  onChange={(e) => setConsumerId(e.currentTarget.value)}
                  value={consumerId}
                  name="consumerId"
                  placeholder="Consumer ID"
                  autoFocus={true}
                />
                <Button
                  onClick={() => setConsumerId(generateRandomId())}
                  text="Generate ID"
                  variant="secondary"
                  className="whitespace-nowrap"
                />
              </div>
            </div>
            <div>
              <Button
                onClick={() =>
                  createSession({ consumerId, consumerMetadata: { userName, email, image } })
                }
                text="Create session"
                className="whitespace-nowrap w-full"
                isLoading={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                *Provide a unique ID. Most of the time, this is an ID of your internal data model
                that represents a user or account. For testing purposes, you can use a random
                string.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-4 flex justify-center">
            <a
              href="https://www.apideck.com/samples/accounting"
              className="text-sm text-cyan-600 hover:text-cyan-800 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Return to Apideck Samples
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvalidSessionPage
