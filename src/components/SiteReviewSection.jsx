import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";

export default function SiteReviewSection({ user }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);

  async function loadReviews() {
    const { data, error } = await supabase
      .from("site_reviews")
      .select(`
        id,
        rating,
        comment,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (!error) setReviews(data);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function submitReview(e) {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("site_reviews")
.insert([
      {
        user_id: user.id,
        rating,
        comment,
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setComment("");
      loadReviews();
    }
  }

  return (
    <div className="review-section">
      <h2>Website Feedback</h2>

      <form className="review-form" onSubmit={submitReview}>
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>

        <label>Your Review</label>
        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>

        <button disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>

      <h3 className="review-title">User Reviews</h3>

      <div className="review-list">
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => (
          <div className="review-card" key={r.id}>
            <div className="review-header">
              <strong>Anonymous User</strong>
              <span className="stars">⭐ {r.rating}</span>
            </div>

            {r.comment && <p className="review-comment">{r.comment}</p>}

            <p className="review-date">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
