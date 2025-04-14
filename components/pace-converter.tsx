'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

export function PaceConverter() {
  const [kph, setKph] = useState('')
  const [paceResult, setPaceResult] = useState('')

  const [pace, setPace] = useState('')
  const [kphResult, setKphResult] = useState('')

  function calculatePace(kph: string) {
    const kphValue = parseFloat(kph)
    if (isNaN(kphValue) || kphValue <= 0) {
      setPaceResult('Invalid speed')
      return
    }
    const paceInMinutes = 60 / kphValue
    const minutes = Math.floor(paceInMinutes)
    const seconds = Math.round((paceInMinutes - minutes) * 60)
    setPaceResult(`${minutes}:${seconds < 10 ? '0' : ''}${seconds} min/km`)
  }

  function calculateKph(pace: string) {
    // If user is using "dot" instead of ":", replace it
    if (pace.includes('.')) {
      pace = pace.replace('.', ':')
    }

    // Check if the pace is in the format "min:sec"
    // If not, treat it as "min:00"
    if (!/^\d+:\d+$/.test(pace)) {
      pace = `${pace}:00`
    }

    // Validate the pace format
    const paceParts = pace.split(':')
    if (paceParts.length !== 2) {
      setKphResult('Invalid pace format')
      return
    }

    const [minutes, seconds] = pace.split(':').map(Number)
    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0) {
      setKphResult('Invalid pace')
      return
    }
    const totalMinutes = minutes + seconds / 60
    const kphValue = 60 / totalMinutes
    setKphResult(kphValue.toFixed(2) + ' km/h')
  }

  function handleKphChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setKph(value)
    if (value) {
      calculatePace(value)
    } else {
      setPaceResult('')
    }
  }

  function handlePaceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPace(value)
    if (value) {
      calculateKph(value)
    } else {
      setKphResult('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pace Converter</CardTitle>
        <CardDescription>
          Convert between kph (km/h) and pace (min/km)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-xs">Kph to pace</div>
          <Input
            type="text"
            placeholder="Enter speed in kph"
            value={kph}
            onChange={handleKphChange}
          />
          <Input
            type="text"
            placeholder="Pace (min:sec per km)"
            value={paceResult}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs">Pace to kph</div>
          <Input
            type="text"
            placeholder="Enter pace"
            value={pace}
            onChange={handlePaceChange}
          />
          <Input
            type="text"
            placeholder="Speed in kph"
            value={kphResult}
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  )
}
