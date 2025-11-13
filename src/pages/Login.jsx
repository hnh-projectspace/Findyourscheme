import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard"
      }
    });

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
        <p>Check your email to log in.</p>
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
        <button type="submit">Send Magic Link</button>
      </form>
    </div>
  );
}
