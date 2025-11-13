import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import Nav from "../components/Nav";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);

      // calculate completion
      if (profileData) {
        const fields = [
          profileData.name,
          profileData.age,
          profileData.gender,
          profileData.income,
          profileData.occupation,
          profileData.category,
          profileData.state,
        ];

        const filled = fields.filter((v) => v && v !== "").length;
        const percent = Math.round((filled / fields.length) * 100);
        setCompletion(percent);
      }

      setLoading(false);
    }

    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) return (
    <div className="spinner-container">
      <Spinner />
    </div>
  );

  return (
    <div className="dashboard">
      {/* NAV */}
      <Nav />

      {/* HEADER */}
      <header className="dash-header">
        <h1>Welcome, {user.email}</h1>
        <p>Your scheme eligibility assistant</p>
      </header>

      {/* PROFILE COMPLETION BOX */}
      <div className="profile-box">
        <h3>Profile Completion</h3>
        <p>{completion}% completed</p>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${completion}%` }}></div>
        </div>

        {completion < 100 && (
          <Link to="/profile">
            <button className="fill-btn">
              Complete Your Profile
            </button>
          </Link>
        )}

        {completion === 100 && (
          <Link to="/search">
            <button className="fill-btn">
              Find Eligible Schemes
            </button>
          </Link>
        )}
      </div>

      {/* LATEST SCHEMES SECTION */}
      <section className="latest">
        <h2>Latest Government Schemes</h2>
        <p>Recently updated schemes from your database</p>

        <LatestSchemes />
      </section>
    </div>
  );
}

function LatestSchemes() {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    async function loadSchemes() {
      const { data } = await supabase
        .from("schemes")
        .select("*")
        .limit(5);

      setSchemes(data || []);
    }
    loadSchemes();
  }, []);

  return (
    <div className="latest-box">
      {schemes.map((s) => (
        <div key={s.id} className="latest-item">
          <strong>{s.name}</strong>
          <p>{s.description}</p>
        </div>
      ))}
    </div>
  );
}
