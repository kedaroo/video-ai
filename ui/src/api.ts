const BASE_API_URL = 'http://localhost:3000/api/v1/'

export type Endpoint = 'chat'

interface ApiReq {
  chat: {
    method: 'POST',
    body: {query: string}
  }
}

export const api = async (endpoint: Endpoint, body?: ) => {
  const url = new URL(endpoint, BASE_API_URL)

  const res = await fetch(url.toString(), {
    method: body ? 'POST' : 'GET',
    body,
  })
}

api('chat')