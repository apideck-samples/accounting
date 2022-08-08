import cookie from 'cookie'
import { useState } from 'react'

export const getCookieValue = ({ key, cookies, options, defaultValue }) => {
  const value = cookie.parse(cookies || '', options)

  return value[key] ?? defaultValue
}

export const useCookieState = (key, initialValue, options) => {
  const getInitialValue = () => {
    // if we on the server just use an initial value
    if (typeof window === 'undefined') return initialValue

    // otherwise get initial cookie value from `document.cookies`
    return getCookieValue({
      key,
      cookies: document.cookie,
      options: options?.decodeOps,
      defaultValue: initialValue
    })
  }

  // get initial state value on component mounts
  const [value, setValue] = useState(getInitialValue)

  // encode and save the new cookie value
  const setNextValue = (value) => {
    document.cookie = cookie.serialize(key, value, options?.encodeOps)
    setValue(value)
  }

  return [value, setNextValue]
}
