const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL ?? '/api/backend';

const handleResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.message ?? 'No se pudo completar la autenticación.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
};

export const loginUser = async ({ username, password }) => {
  const trimmedUsername = username?.trim();
  const trimmedPassword = password?.trim();

  if (!trimmedUsername || !trimmedPassword) {
    throw new Error('Introduce usuario y contraseña.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
  });

  const data = await handleResponse(response);
  return data.user;
};
