import React, { useState } from 'react'

const UserForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    income: '',
    occupation: '',
    category: '',
    state: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>Enter Your Details</h2>

      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
      <input name="income" type="number" placeholder="Annual Income" onChange={handleChange} required />

      <select name="gender" onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input name="occupation" placeholder="Occupation" onChange={handleChange} required />
      <input name="category" placeholder="Category (e.g., OBC, SC, General)" onChange={handleChange} required />
      <input name="state" placeholder="State" onChange={handleChange} required />

      <button type="submit">Find Schemes</button>
    </form>
  )
}

export default UserForm
