'use client'

import { useState, useEffect } from 'react'
import { XCircleIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function EpochConverter() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(0)
  const [inputEpoch, setInputEpoch] = useState<string>('')
  const [convertedDate, setConvertedDate] = useState<string>('')
  const [inputDate, setInputDate] = useState<string>('')
  const [convertedEpoch, setConvertedEpoch] = useState<string>('')

  useEffect(() => {
    updateCurrentEpoch()
    const interval = setInterval(updateCurrentEpoch, 1000)
    return () => clearInterval(interval)
  }, [])

  const updateCurrentEpoch = () => {
    setCurrentEpoch(Math.floor(Date.now() / 1000))
  }

  const handleEpochConvert = () => {
    try {
      const epoch = Number.parseInt(inputEpoch)
      if (isNaN(epoch)) {
        setConvertedDate('Invalid epoch timestamp')
        return
      }

      const date = new Date(epoch * 1000)
      setConvertedDate(date.toISOString())
    } catch (error) {
      setConvertedDate('Conversion error')
    }
  }

  const handleDateConvert = () => {
    try {
      const date = new Date(inputDate)
      if (isNaN(date.getTime())) {
        setConvertedEpoch('Invalid date')
        return
      }

      setConvertedEpoch(Math.floor(date.getTime() / 1000).toString())
    } catch (error) {
      setConvertedEpoch('Conversion error')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Epoch Converter</CardTitle>
        <CardDescription>
          Convert between epoch timestamps and human-readable dates
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex items-center justify-between p-2 border text-xs">
          <span className="text-muted-foreground">Current epoch seconds:</span>
          <span className="font-mono">{currentEpoch}</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs">Epoch to UTC</div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInputEpoch(currentEpoch.toString())}
                >
                  Set current epoch
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setInputEpoch('')
                    setConvertedDate('')
                  }}
                >
                  <XCircleIcon />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter epoch timestamp"
                value={inputEpoch}
                onChange={(e) => setInputEpoch(e.target.value)}
              />
              <Button onClick={handleEpochConvert}>Convert</Button>
            </div>
            <Input
              type="text"
              readOnly
              value={convertedDate}
              placeholder="Converted date/time"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs">UTC to epoch</div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInputDate(new Date().toISOString())}
                >
                  Set current date/time
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setInputDate('')
                    setConvertedEpoch('')
                  }}
                >
                  <XCircleIcon />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter date/time (YYYY-MM-DDTHH:mm:ssZ)"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
              />
              <Button onClick={handleDateConvert}>Convert</Button>
            </div>
            <Input
              type="text"
              readOnly
              value={convertedEpoch}
              placeholder="Converted epoch timestamp"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
