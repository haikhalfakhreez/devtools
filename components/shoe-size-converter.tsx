'use client'

import React, { useState } from 'react'

type SizeEntry = {
  uk: string
  cm: string
  eu: string
  us: string
  in: string
}

const sizeChart: SizeEntry[] = [
  { uk: '3.5', in: '8.7', cm: '22.1', eu: '36', us: '4' },
  { uk: '4', in: '8.9', cm: '22.6', eu: '36 2/3', us: '4.5' },
  { uk: '4.5', in: '9.0', cm: '22.9', eu: '37 1/3', us: '5' },
  { uk: '5', in: '9.2', cm: '23.4', eu: '38', us: '5.5' },
  { uk: '5.5', in: '9.4', cm: '23.9', eu: '38 2/3', us: '6' },
  { uk: '6', in: '9.5', cm: '24.1', eu: '39 1/3', us: '6.5' },
  { uk: '6.5', in: '9.7', cm: '24.6', eu: '40', us: '7' },
  { uk: '7', in: '9.9', cm: '25.1', eu: '40 2/3', us: '7.5' },
  { uk: '7.5', in: '10.0', cm: '25.4', eu: '41 1/3', us: '8' },
  { uk: '8', in: '10.2', cm: '25.9', eu: '42', us: '8.5' },
  { uk: '8.5', in: '10.4', cm: '26.4', eu: '42 2/3', us: '9' },
  { uk: '9', in: '10.5', cm: '26.7', eu: '43 1/3', us: '9.5' },
  { uk: '9.5', in: '10.7', cm: '27.2', eu: '44', us: '10' },
  { uk: '10', in: '10.9', cm: '27.7', eu: '44 2/3', us: '10.5' },
  { uk: '10.5', in: '11.0', cm: '27.9', eu: '45 1/3', us: '11' },
  { uk: '11', in: '11.2', cm: '28.4', eu: '46', us: '11.5' },
  { uk: '11.5', in: '11.4', cm: '28.9', eu: '46 2/3', us: '12' },
  { uk: '12', in: '11.5', cm: '29.2', eu: '47 1/3', us: '12.5' },
  { uk: '12.5', in: '11.7', cm: '29.7', eu: '48', us: '13' },
  { uk: '13', in: '11.9', cm: '30.2', eu: '48 2/3', us: '13.5' },
  { uk: '13.5', in: '12.0', cm: '30.5', eu: '49 1/3', us: '14' },
  { uk: '14', in: '12.2', cm: '31.0', eu: '50', us: '14.5' },
  { uk: '14.5', in: '12.4', cm: '31.5', eu: '50 2/3', us: '15' },
  { uk: '15', in: '12.7', cm: '32.3', eu: '51 1/3', us: '16' },
  { uk: '16', in: '13.0', cm: '33.0', eu: '52 2/3', us: '17' },
  { uk: '17', in: '13.4', cm: '34.0', eu: '53 1/3', us: '18' },
  { uk: '18', in: '13.7', cm: '34.8', eu: '54 2/3', us: '19' },
]

export function ShoeSizeConverter() {
  const [size, setSize] = useState('')
  const [unit, setUnit] = useState<keyof SizeEntry>('uk')
  const [converted, setConverted] = useState<SizeEntry | null>(null)

  const convertSize = () => {
    if (!size || isNaN(Number(size))) return
    const result = sizeChart.find((entry) => entry[unit] === size)
    setConverted(result || null)
  }

  return (
    <div className="p-4 border rounded-md bg-gray-900 text-gray-300">
      <h2 className="text-sm font-semibold mb-2">Shoe Size Converter</h2>
      <p className="text-xs mb-2">
        Source:{' '}
        <a
          href="https://www.adidas.com.my/en/help/sea-size-guide/men"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Adidas SEA Size Guide
        </a>
      </p>
      <input
        type="text"
        placeholder="Enter size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="w-full p-1 text-xs bg-gray-800 border border-gray-700 rounded mb-2"
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as keyof SizeEntry)}
        className="w-full p-1 text-xs bg-gray-800 border border-gray-700 rounded mb-2"
      >
        <option value="uk">UK</option>
        <option value="cm">CM</option>
        <option value="eu">EU</option>
        <option value="us">US</option>
        <option value="in">IN</option>
      </select>
      <button
        onClick={convertSize}
        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
      >
        Convert
      </button>
      {converted ? (
        <ul className="mt-2 text-xs">
          {Object.entries(converted).map(([key, value]) => (
            <li key={key}>{`${key.toUpperCase()}: ${value}`}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs">No matching size found.</p>
      )}
    </div>
  )
}
