'use client'

import { useState } from 'react'

export default function Home() {
  const [textInput, setTextInput] = useState('')
  const [textOutput, setTextOutput] = useState('')
  const [imageOutput, setImageOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const encodeText = () => {
    const encoded = btoa(unescape(encodeURIComponent(textInput)))
    setTextOutput(encoded)
  }

  const decodeText = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(textInput)))
      setTextOutput(decoded)
    } catch {
      setTextOutput('Error: Invalid Base64 string')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImageOutput(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Base64 Encoder & Decoder
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Convert text and images to Base64 instantly. Free, fast, and no registration required.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#text-converter" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition">
            Text to Base64
          </a>
          <a href="#image-converter" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition">
            Image to Base64
          </a>
        </div>
      </section>

      {/* Text Converter */}
      <section id="text-converter" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Text ↔ Base64</h2>
          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text or Base64 string..."
              className="w-full h-32 bg-gray-700 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex gap-4">
              <button
                onClick={encodeText}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
              >
                Encode to Base64
              </button>
              <button
                onClick={decodeText}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold transition"
              >
                Decode from Base64
              </button>
            </div>
            {textOutput && (
              <div className="relative">
                <textarea
                  value={textOutput}
                  readOnly
                  className="w-full h-32 bg-gray-700 rounded-lg p-4 text-green-400 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(textOutput)}
                  className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Converter */}
      <section id="image-converter" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Image → Base64</h2>
          <div className="space-y-4">
            <label className="block w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-2xl mb-2">📁</p>
                <p className="text-gray-400">Drop an image or click to upload</p>
              </div>
            </label>
            {imageOutput && (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={imageOutput}
                    readOnly
                    className="w-full h-32 bg-gray-700 rounded-lg p-4 text-green-400 text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(imageOutput)}
                    className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  Size: {(imageOutput.length / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">🚀 API for Developers</h2>
          <p className="text-gray-300 mb-8">
            Need to integrate Base64 conversion in your app? Use our free API.
          </p>
          <div className="bg-gray-800 rounded-lg p-6 text-left">
            <code className="text-green-400 text-sm">
              POST /api/text-to-base64<br/>
              {`{ "text": "Hello World" }`}<br/><br/>
              POST /api/image-to-base64<br/>
              Form data: image file
            </code>
          </div>
          <p className="text-gray-400 mt-4 text-sm">
            Free tier: 100 requests/day • Pro plans coming soon
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 border-t border-gray-700">
        <p>© 2026 Base64 Tools by Orbit Labs</p>
      </footer>
    </main>
  )
}
