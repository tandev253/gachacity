// src/api/auth/auth.js
export const AUTH_BACKEND_URL =
  "https://gachacity.onrender.com";

export async function login({
  identifier,
  password,
}) {
  const res = await fetch(
    `${AUTH_BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    },
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data.error || "Đăng nhập thất bại",
    );
  }

  return data;
}
