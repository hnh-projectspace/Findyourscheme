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

    const payload = {
      user_id: user.id,
      scheme_id: scheme.id,
      rating,
      comment,
    };

    const { error } = await supabase.from("feedback").insert([payload]);

    setSending(false);

    if (!error) setDone(true);
    else alert("Error submitting feedback: " + error.message);
  }

  if (done)
    return (
      <div className="modal-bg">
        <div className="modal-box">
          <h3>Thank you!</h3>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );

  return (
    <div className="modal-bg">
      <div className="modal-box">
        <h2>Feedback for {scheme.name}</h2>

        <form onSubmit={submitFeedback}>
          <label>Rating (1-5)</label>
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
          />

          <button type="submit" disabled={sending}>
            {sending ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
