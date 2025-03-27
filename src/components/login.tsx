import { useState } from 'react'
import Button from './button'

function Login({ setToken }: { setToken: (token: string | null) => void }) {
  const [tempToken, setTempToken] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVerification, setShowVerification] = useState(false)

  const fetchEphemeralAccount = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/newEphemeralAccount'
      )
      if (!res.ok) throw new Error('Failed to fetch ephemeral account')
      const data = await res.json()
      setTempToken(data.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!email || !tempToken) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tempToken}`
          },
          body: JSON.stringify({ email })
        }
      )

      if (!res.ok) throw new Error('Login failed: ' + res.statusText)
      await res.json() // Process response if needed

      // Show verification screen
      setShowVerification(true)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async () => {
    if (!code || !tempToken || !email) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tempToken}`
          },
          body: JSON.stringify({ code, email })
        }
      )

      if (!res.ok) throw new Error('Verification failed: ' + res.statusText)

      const data = await res.json()
      // Save the token to local storage
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  // Initial login button
  if (!tempToken) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-xs w-full">
          <div className="mb-4 text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome to DreamingSync
          </h2>
          <p className="text-gray-600 mb-5">
            Sign in to sync your Dreaming Spanish progress from different sites.
          </p>

          <Button
            onClick={fetchEphemeralAccount}
            loading={loading}
            color="orange"
            className="text-md font-bold w-full"
          >
            Sign In
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-100">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Verification screen
  if (showVerification) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg mb-3">Enter Verification Code</h2>
          <input
            type="text"
            placeholder="Enter the code sent to your email"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <Button
            color="blue"
            onClick={handleVerification}
            disabled={!code}
            loading={loading}
            className="mt-2 w-full"
          >
            Verify
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    )
  }

  // Email input screen
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg mb-3">Login with Email</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <Button
          color="blue"
          onClick={handleLogin}
          disabled={!email}
          loading={loading}
          className="mt-2 w-full"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
      {error && (
        <div className="mt-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}
    </div>
  )
}

export default Login
