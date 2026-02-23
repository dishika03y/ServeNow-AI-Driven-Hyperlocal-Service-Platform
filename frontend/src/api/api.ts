const BASE_URL = 'http://10.188.35.21:8000';

export async function apiRequest<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const error = await res.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}