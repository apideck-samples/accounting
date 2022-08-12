export const fetcher = (...args: any) => fetch(args).then((res) => res.json())
export const multiFetcher = (...urls: string[]) => {
  return Promise.all(urls.map((url) => fetcher(url)))
}
