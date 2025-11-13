// src/components/Spinner.jsx
import React from 'react'

export default function Spinner({ size = 32 }) {
  const style = {
    width: size,
    height: size,
    border: '4px solid #f8f9fa',
    borderTop: '4px solid #24E3A3',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite'
  }
  return <div style={style} />
}
