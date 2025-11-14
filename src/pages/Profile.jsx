// src/pages/Profile.jsx
import React, { useEffect, useState, useCallback } from "react";
import supabase from "../supabaseClient";
import Spinner from "../components/Spinner";
import Nav from "../components/Nav";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    income: "",
    occupation: "",
    category: "",
    state: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState(0);

  // Load session/profile once
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
        return;
      }

      if (!mounted) return;
      setUser(session.user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = No rows — ignore
        console.error("Error loading profile:", error);
      }

      if (data) {
        // Ensure fields are strings for controlled inputs
        setProfile({
          name: data.name || "",
          age: data.age != null ? String(data.age) : "",
          gender: data.gender || "",
          income: data.income != null ? String(data.income) : "",
          occupation: data.occupation || "",
          category: data.category || "",
          state: data.state || "",
        });
      }
      setLoading(false);
    }

    loadProfile();
    return () => { mounted = false; };
  }, []);

  // compute completion whenever profile changes
  useEffect(() => {
    const computeCompletion = (p) => {
      const fields = [
        p.name,
        p.age,
        p.gender,
        p.income,
        p.occupation,
        p.category,
        p.state,
      ];

      // count non-empty trimmed values as filled
      const filled = fields.reduce((acc, v) => {
        if (v === null || v === undefined) return acc;
        if (typeof v === "string" && v.trim() === "") return acc;
        return acc + 1;
      }, 0);

      const percent = Math.round((filled / fields.length) * 100);
      return percent;
    };

    setCompletion(computeCompletion(profile));
  }, [profile]);

  // Generic controlled change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Save profile (upsert). Keep inputs as strings; convert when sending numeric values.
  async function saveProfile(e) {
    e?.preventDefault?.();
    if (!user) return alert("No user session");

    setSaving(true);

    // Prepare payload: convert numeric fields to numbers or null
    const payload = {
      id: user.id,
      name: profile.name?.trim() || null,
      age: profile.age !== "" ? Number(profile.age) : null,
      gender: profile.gender || null,
      income: profile.income !== "" ? Number(profile.income) : null,
      occupation: profile.occupation?.trim() || null,
      category: profile.category?.trim() || null,
      state: profile.state?.trim() || null,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(payload, { returning: "minimal" });

    setSaving(false);
    if (error) {
      console.error("Save error:", error);
      alert("Failed to save profile: " + error.message);
    } else {
      // optimistic UI: profile state already updated, completion recalculated automatically
      // optionally, show a small success hint
      const el = document.getElementById("save-hint");
      if (el) {
        el.innerText = "Saved ✓";
        setTimeout(() => { if (el) el.innerText = ""; }, 1500);
      }
    }
  }

  if (loading) return (
    <div className="spinner-container">
      <Spinner />
    </div>
  );

  return (
    <div className="profile-page">
      <Nav />

      <h1>Your Profile</h1>

      <div className="profile-progress">
        <p>Profile Completion: <strong>{completion}%</strong></p>
        <div className="progress-bar" aria-hidden>
          <div className="progress" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <form className="profile-form" onSubmit={saveProfile}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          value={profile.age}
          onChange={handleChange}
          min="0"
        />

        <select name="gender" value={profile.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Any">Any</option>
        </select>

        <input
          name="income"
          type="number"
          placeholder="Annual Income"
          value={profile.income}
          onChange={handleChange}
          min="0"
        />

        <select name="occupation" value={profile.occupation} onChange={handleChange}>
          <option value="">Select Occupation</option>
          <option value="Student">Student</option>
          <option value="Farmer">Farmer</option>
          <option value="Self Employed">Self Employed</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Private Job">Private Job</option>
          <option value="Government Job">Government Job</option>
          <option value="Labor / Daily Wage Worker">Labor / Daily Wage Worker</option>
          <option value="Business Owner">Business Owner</option>
          <option value="Retired">Retired</option>
          <option value="Homemaker">Homemaker</option>
          <option value="Other">Other</option>
        </select>

        <select name="category" value={profile.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="EWS">EWS</option>
          <option value="Other">Other</option>
        </select>

        <select name="state" value={profile.state} onChange={handleChange}>
          <option value="">Select State</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
          <option value="Assam">Assam</option>
          <option value="Bihar">Bihar</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Goa">Goa</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Haryana">Haryana</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Manipur">Manipur</option>
          <option value="Meghalaya">Meghalaya</option>
          <option value="Mizoram">Mizoram</option>
          <option value="Nagaland">Nagaland</option>
          <option value="Odisha">Odisha</option>
          <option value="Punjab">Punjab</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Sikkim">Sikkim</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Telangana">Telangana</option>
          <option value="Tripura">Tripura</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Uttarakhand">Uttarakhand</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Andaman & Nicobar Islands">Andaman & Nicobar Islands</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Dadra & Nagar Haveli and Daman & Diu">Dadra & Nagar Haveli and Daman & Diu</option>
          <option value="Delhi">Delhi</option>
          <option value="Jammu & Kashmir">Jammu & Kashmir</option>
          <option value="Ladakh">Ladakh</option>
          <option value="Lakshadweep">Lakshadweep</option>
          <option value="Puducherry">Puducherry</option>
        </select>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
          <span id="save-hint" style={{ color: "#1b8f1b" }} />
          <button type="button" onClick={() => {
            // reset profile to last-saved (re-fetch)
            (async () => {
              const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
              if (data) {
                setProfile({
                  name: data.name || "",
                  age: data.age != null ? String(data.age) : "",
                  gender: data.gender || "",
                  income: data.income != null ? String(data.income) : "",
                  occupation: data.occupation || "",
                  category: data.category || "",
                  state: data.state || "",
                });
              }
            })();
          }}>Reset</button>
          <button type="button" onClick={() => setProfile({
            name: "",
            age: "",
            gender: "",
            income: "",
            occupation: "",
            category: "",
            state: ""
          })}>Clear</button>
        </div>
      </form>
    </div>
  );
}
