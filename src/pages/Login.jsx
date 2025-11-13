import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Spinner from "../components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/"
      }
    });

    setLoading(false);
    if (!error) {
      setSent(true);
    } else {
      alert("Error sending link: " + error.message);
    }
  }

  if (sent)
    return (
      <div className="login-container">
        <h2>Magic Link Sent</h2>
        <p>Check your email for the login link. Clicking it may open a new tab; you can close it after logging in.</p>
      </div>
    );

  return (
    <div className="login-container">
      <h1>Findyourscheme</h1>
      <p>Login with your email</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <Spinner size={20} /> : "Send Magic Link"}
        </button>
      </form>
    </div>
  );
}
