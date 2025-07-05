'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function BillsDivider() {
  const [total, setTotal] = useState(200)
  const [people, setPeople] = useState(4)
  const [splitterShare, setSplitterShare] = useState(0.5)

  const splitterAmount = (total / people) * splitterShare
  const restAmount = (total - splitterAmount) / (people - 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bills Divider</CardTitle>
        <CardDescription>
          Divide bills equally when one person pays half of their share.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <div className="text-xs">Total Bill (MYR)</div>
            <Input
              type="number"
              min={0}
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <div className="text-xs">Number of People</div>
            <Input
              type="number"
              min={2}
              value={people}
              onChange={(e) => setPeople(Math.max(2, Number(e.target.value)))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <div className="text-xs">Splitter's Share (in decimal)</div>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={splitterShare}
              onChange={(e) =>
                setSplitterShare(
                  Math.max(0, Math.min(1, Number(e.target.value)))
                )
              }
            />
          </label>

          <div className="space-y-2">
            <div className="text-xs">
              Splitter pays:{' '}
              <span className="font-semibold">
                MYR {splitterAmount.toFixed(2)}
              </span>
            </div>
            <div className="text-xs">
              Each of the rest pays:{' '}
              <span className="font-semibold">MYR {restAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
