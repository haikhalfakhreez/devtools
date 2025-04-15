'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export function UrlTool() {
  const [input, setInput] = useState<string>('')
  const [output, setOutput] = useState<string>('')
  const [current, setCurrent] = useState<string>('encode')

  function handleEncode(str: string) {
    try {
      const lines = str.split('\n')
      const encodedLines = lines.map((line) => encodeURIComponent(line))
      const encodedString = encodedLines.join('\n')
      setOutput(encodedString)
    } catch (error) {
      setOutput('Encoding error')
    }
  }

  function handleDecode(str: string) {
    try {
      const lines = str.split('\n')
      const decodedLines = lines.map((line) => decodeURIComponent(line))
      const decodedString = decodedLines.join('\n')
      setOutput(decodedString)
    } catch (error) {
      setOutput('Decoding error')
    }
  }

  function handleTabChange(value: string) {
    setCurrent(value)
    if (value === 'encode') {
      handleEncode(input)
    } else {
      handleDecode(input)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setInput(value)
    if (current === 'encode') {
      handleEncode(value)
    } else {
      handleDecode(value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Encoder/Decoder</CardTitle>
        <CardDescription>Encode or decode URL components</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="encode"
          onValueChange={handleTabChange}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Textarea
            placeholder={`Enter text to ${current}`}
            value={input}
            onChange={handleInputChange}
          />

          <Textarea placeholder="Output" value={output} readOnly />
        </div>
      </CardContent>
    </Card>
  )
}
