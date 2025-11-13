import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";

export default function Home() {
  const aboutRef = useRef(null);

  return (
    <div className="home">

      {/* HERO SECTION */}
      <header className="hero">
        {/* NAVBAR */}
        <Nav />

        <div className="hero-box">
          <h1>Find Government Schemes You Are Eligible For</h1>
          <p>Smart. Fast. Accurate. Powered by Supabase + React.</p>

          <div className="hero-actions">
            <Link to="/dashboard">
              <button className="start-btn">Get Started</button>
            </Link>
          </div>
        </div>
      </header>

      {/* LATEST SCHEMES SECTION */}
      <section className="latest">
        <h2>Latest Government Schemes</h2>
        <p>Auto-fetched from our database. Updated daily.</p>

        <div className="fake-schemes">
          <div className="scheme-item">📢 PM Awas Yojana update</div>
          <div className="scheme-item">📢 PM Kisan 16th installment</div>
          <div className="scheme-item">📢 New Student Scholarship</div>
        </div>
      </section>

      {/* ABOUT PROJECT */}
      <section className="about" ref={aboutRef}>
        <h2>About FindMyScheme</h2>
        <p>
          FindMyScheme is a smart and easy-to-use platform that helps people discover government schemes they are eligible for. India has hundreds of welfare schemes for students, farmers, women, workers, senior citizens, and many other groups — but most citizens never know which benefits they can actually apply for.
          FindMyScheme solves this problem by bringing all important schemes together in one place and matching them to the user's profile.
        </p>

        <div className="about-content">
          <div className="about-section">
            <h3>🚀 How It Works</h3>
            <ul>
              <li><strong>Create Your Account:</strong> Login securely using your email.</li>
              <li><strong>Fill Your Profile:</strong> Add simple details like age, income, occupation, gender, state, and category. Your profile completion percentage helps you track progress.</li>
              <li><strong>Get Scheme Matches:</strong> Once your profile is complete, the system analyzes your details and shows you all the schemes you qualify for.</li>
              <li><strong>Read & Apply Easily:</strong> Each scheme includes an explanation, eligibility info, and the official government link.</li>
              <li><strong>Give Feedback:</strong> You can rate a scheme or leave a comment to help others.</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>⭐ Why This Platform Is Useful</h3>
            <ul>
              <li>Saves time</li>
              <li>Removes confusion about eligibility</li>
              <li>Shows only relevant schemes</li>
              <li>Simple, clean, and easy-to-use interface</li>
              <li>Helps people access real government benefits</li>
              <li>Works for all ages and backgrounds</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>🛠️ Technology Behind FindMyScheme</h3>
            <p>FindMyScheme is built using:</p>
            <ul>
              <li>React (JavaScript) – fast, responsive frontend</li>
              <li>Supabase – backend, authentication & database</li>
              <li>Rule-based matching system – checks your profile against scheme requirements</li>
              <li>Real-time updates – your profile and feedback update instantly</li>
            </ul>
            <p>The platform is designed to be lightweight, secure, and easily scalable.</p>
          </div>

          <div className="about-section">
            <h3>🌍 Our Mission</h3>
            <p>
              To make government benefits accessible, understandable, and available to every citizen — especially those who may not know where to start.
              FindMyScheme aims to bridge the gap between government welfare and the people who truly need it.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
