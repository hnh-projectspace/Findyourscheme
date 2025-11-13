import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const FeedbackForm = ({ userId, schemeId }) => {
  const [feedback, setFeedback] = useState({ rating: '', comment: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('feedback').insert([
      {
        user_id: userId,
        scheme_id: schemeId,
        rating: Number(feedback.rating),
        comment: feedback.comment,
      },
    ])
    if (!error) setSubmitted(true)
  }

  if (submitted) return <p>Thanks for your feedback!</p>

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h4>Rate this Scheme</h4>
      <input
        type="number"
        name="rating"
        min="1"
        max="5"
        placeholder="Rating (1-5)"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="comment"
        placeholder="Your comment"
        onChange={handleChange}
      />
      <button type="submit">Submit Feedback</button>
    </form>
  )
}

export default FeedbackForm
