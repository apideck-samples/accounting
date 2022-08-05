import { Button, TextInput } from '@apideck/components'

import { NextPage } from 'next'
import { useSession } from 'utils'
import { useState } from 'react'

const InvalidSessionPage: NextPage = () => {
  const [consumerId, setConsumerId] = useState('test-consumer')
  const [userName, setUserName] = useState('Elon Musk')
  const [email, setEmail] = useState('elon@tesla.com')
  const [image, setImage] = useState(
    'https://cdn.vox-cdn.com/thumbor/K7XIfxK1FAlscCjGinG9JvkMiMk=/0x0:2040x1360/920x613/filters:focal(857x517:1183x843):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/71204583/VRG_Illo_STK022_K_Radtke_Musk_Crazy.0.jpg'
  )
  const { createSession, isLoading } = useSession()

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
                Consumer ID
              </label>
              <div className="flex space-x-3">
                <TextInput
                  onChange={(e) => setConsumerId(e.currentTarget.value)}
                  value={consumerId}
                  name="consumerId"
                  placeholder="Consumer ID"
                />
                <Button
                  onClick={() =>
                    createSession({ consumerId, consumerMetadata: { userName, email, image } })
                  }
                  text="Create session"
                  className="whitespace-nowrap"
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvalidSessionPage
