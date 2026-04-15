const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string };
      throw new Error(body.message ?? fallbackMessage);
    } catch {
      throw new Error(fallbackMessage);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export { API_BASE_URL, request };
