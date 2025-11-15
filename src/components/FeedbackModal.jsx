import React, { useState } from "react";
import supabase from "../supabaseClient";

export default function FeedbackModal({ scheme, user, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submitFeedback(e) {
    e.preventDefault();
    setSending(true);

    const { error } = await supabase.from("feedback").insert([
      {
        user_id: user.id,
        scheme_id: scheme.id,
        rating,
        comment,
      },
    ]);

    setSending(false);

    if (!error) setDone(true);
    else alert("Error submitting feedback: " + error.message);
  }

  if (done) {
    return (
      <div className="f-modal-bg">
        <div className="f-modal">
          <h2 className="f-thanks">Thank you for your feedback! 🎉</h2>
          <button className="f-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="f-modal-bg">
      <div className="f-modal">
        <button className="f-x-btn" onClick={onClose}>×</button>

        <h2 className="f-title">
          Feedback for <span>{scheme.name}</span>
        </h2>

        <form onSubmit={submitFeedback} className="f-form">
          <label>Rating (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />

          <label>Comment (optional)</label>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts..."
          />

          <button type="submit" className="f-submit" disabled={sending}>
            {sending ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
