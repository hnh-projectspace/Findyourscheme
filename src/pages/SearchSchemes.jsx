import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import FeedbackModal from "../components/FeedbackModal";
import Nav from "../components/Nav";

export default function SearchSchemes() {
  const [user, setUser] = useState(null); // eslint-disable-line no-unused-vars
  const [profile, setProfile] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Load user + profile
  useEffect(() => {
    async function loadData() {
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

      if (!profileData) {
        setBlocked(true);
        return;
      }

      setProfile(profileData);

      // Check profile completion %
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
      const percent = Math.round((filled / 7) * 100);

      if (percent < 100) {
        setBlocked(true);
      }
    }

    loadData();
  }, []);

  // Search Schemes
  async function searchNow() {
    setLoading(true);

    // Fetch all schemes
    const { data } = await supabase.from("schemes").select("*");

    // Apply filtering
    const eligible = data.filter((s) => {
      const ageOK =
        (!s.min_age || profile.age >= s.min_age) &&
        (!s.max_age || profile.age <= s.max_age);

      const incomeOK =
        !s.income_limit || Number(profile.income) <= Number(s.income_limit);

      const genderOK = s.gender === "Any" || s.gender === profile.gender;
      const categoryOK = s.category === "Any" || s.category === profile.category;
      const occupationOK =
        s.occupation === "Any" || s.occupation === profile.occupation;

      const stateOK = s.state === "All" || s.state === profile.state;

      return ageOK && incomeOK && genderOK && categoryOK && occupationOK && stateOK;
    });

    setSchemes(eligible);
    setLoading(false);
  }

  function openFeedback(scheme) {
    setSelectedScheme(scheme);
    setShowModal(true);
  }

  function closeFeedback() {
    setShowModal(false);
    setSelectedScheme(null);
  }

  if (blocked)
    return (
      <div className="blocked">
        <h2>Complete Your Profile First</h2>
        <p>Your profile must be 100% complete to search schemes.</p>
        <Link to="/profile">
          <button>Go to Profile</button>
        </Link>
      </div>
    );

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="search-page">
      <Nav />

      <h1>Find Schemes</h1>
      <p>Your profile is complete. Click below to get your eligible schemes.</p>

      <button onClick={searchNow} className="search-btn">
        {loading ? "Searching..." : "Search Schemes"}
      </button>

      {schemes.length > 0 && (
        <div className="results">
          <h2>Eligible Schemes</h2>
          {schemes.map((s) => (
            <div key={s.id} className="scheme-card">
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <div className="button-group">
                <a href={s.link} target="_blank" rel="noreferrer">
                  <button className="apply-btn">Apply Now</button>
                </a>

                <button className="fb-btn" onClick={() => openFeedback(s)}>
                  Give Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FeedbackModal
          scheme={selectedScheme}
          user={user}
          onClose={closeFeedback}
        />
      )}
    </div>
  );
}
