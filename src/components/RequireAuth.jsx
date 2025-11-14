// src/components/RequireAuth.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import supabase from '../supabaseClient'

export default function RequireAuth({ children }) {
  const [checking, setChecking] = React.useState(true)
  const [session, setSession] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(session)
      setChecking(false)
    })()
    return () => { mounted = false }
  }, [])

  if (checking) return <div style={{padding:20}}>Checking session…</div>
  if (!session) return <Navigate to="/login" replace />
  return children
}
