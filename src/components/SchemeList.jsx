import React from 'react'

const SchemeList = ({ schemes }) => {
  if (schemes.length === 0) return <p>No schemes found for your profile.</p>

  return (
    <div className="scheme-list">
      <h2>Eligible Schemes</h2>
      {schemes.map((s) => (
        <div key={s.id} className="scheme-card">
          <h3>{s.name}</h3>
          <p>{s.description}</p>
          <a href={s.link} target="_blank" rel="noopener noreferrer">
            Apply / Learn More
          </a>
        </div>
      ))}
    </div>
  )
}

export default SchemeList
