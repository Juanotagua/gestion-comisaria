export const login = async (
  correo,
  password
) => {

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        correo,
        password
      })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  return data

}