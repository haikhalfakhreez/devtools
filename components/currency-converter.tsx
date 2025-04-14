'use client'

import React, { useState } from 'react'

export function CurrencyConverter() {
  const [myr, setMyr] = useState('')
  const [usd, setUsd] = useState('')
  const exchangeRate = 0.24 // Example rate, replace with real-time API if needed

  const convert = () => {
    if (!myr || isNaN(Number(myr))) return
    setUsd((Number(myr) * exchangeRate).toFixed(2))
  }

  return (
    <div className="p-4 border rounded-md bg-gray-900 text-gray-300">
      <h2 className="text-sm font-semibold mb-2">MYR to USD Converter</h2>
      <input
        type="text"
        placeholder="Enter amount in MYR"
        value={myr}
        onChange={(e) => setMyr(e.target.value)}
        className="w-full p-1 text-xs bg-gray-800 border border-gray-700 rounded"
      />
      <button
        onClick={convert}
        className="mt-2 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
      >
        Convert
      </button>
      {usd && <p className="mt-1 text-xs">USD: ${usd}</p>}
    </div>
  )
}
