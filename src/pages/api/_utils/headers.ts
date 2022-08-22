export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.API_KEY}`,
  'X-APIDECK-APP-ID': `${process.env.APP_ID}`,
  'X-APIDECK-CONSUMER-ID': `${process.env.NEXT_PUBLIC_CONSUMER_ID}`
}
