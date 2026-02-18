'use client'

import { useState, useCallback } from 'react'

export default function Home() {
  const [textInput, setTextInput] = useState('')
  const [textOutput, setTextOutput] = useState('')
  const [imageOutput, setImageOutput] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleTextConvert = () => {
    if (!textInput.trim()) return
    if (mode === 'encode') {
      const encoded = btoa(unescape(encodeURIComponent(textInput)))
      setTextOutput(encoded)
    } else {
      try {
        const decoded = decodeURIComponent(escape(atob(textInput)))
        setTextOutput(decoded)
      } catch {
        setTextOutput('Error: Invalid Base64 string')
      }
    }
  }

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImageOutput(result)
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }, [handleImageUpload])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-semibold text-lg text-gray-900">Base64</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#tools" className="text-gray-600 hover:text-gray-900 text-sm">Tools</a>
            <a href="#api" className="text-gray-600 hover:text-gray-900 text-sm">API</a>
            <a href="#docs" className="text-gray-600 hover:text-gray-900 text-sm">Docs</a>
            <button className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition">
              Get API Key
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Convert text and images<br />to Base64 instantly
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
            Free online encoder and decoder. No signup required.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#tools" className="bg-white text-blue-950 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Start Converting
            </a>
            <a href="#api" className="border border-blue-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition">
              View API Docs
            </a>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-medium text-sm mb-2">Tools</p>
            <h2 className="text-3xl font-bold text-gray-900">Encode and decode with ease</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Text Converter */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Text ↔ Base64</h3>
              
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setMode('encode')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'encode' ? 'bg-blue-950 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Encode
                </button>
                <button 
                  onClick={() => setMode('decode')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'decode' ? 'bg-blue-950 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Decode
                </button>
              </div>

              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                className="w-full h-32 bg-gray-50 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none border border-gray-200 text-sm"
              />
              
              <button
                onClick={handleTextConvert}
                className="w-full mt-4 bg-blue-950 text-white py-3 rounded-xl font-medium hover:bg-blue-900 transition"
              >
                {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
              </button>

              {textOutput && (
                <div className="mt-4 relative">
                  <textarea
                    value={textOutput}
                    readOnly
                    className="w-full h-32 bg-green-50 rounded-xl p-4 text-green-800 focus:outline-none resize-none border border-green-200 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(textOutput, 'text')}
                    className="absolute top-3 right-3 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-lg text-xs font-medium text-green-700 transition"
                  >
                    {copied === 'text' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            {/* Image Converter */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Image → Base64</h3>
              
              <label 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`block w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition flex items-center justify-center ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
                <div className="text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-40 max-w-full rounded-lg mx-auto" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">Drop an image or click to upload</p>
                      <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF, WebP</p>
                    </>
                  )}
                </div>
              </label>

              {imageOutput && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">
                      Size: {(imageOutput.length / 1024).toFixed(2)} KB
                    </span>
                    <button
                      onClick={() => { setImageOutput(''); setImagePreview('') }}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      value={imageOutput}
                      readOnly
                      className="w-full h-24 bg-green-50 rounded-xl p-4 text-green-800 text-xs focus:outline-none resize-none border border-green-200"
                    />
                    <button
                      onClick={() => copyToClipboard(imageOutput, 'image')}
                      className="absolute top-3 right-3 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-lg text-xs font-medium text-green-700 transition"
                    >
                      {copied === 'image' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-medium text-sm mb-2">For Developers</p>
            <h2 className="text-3xl font-bold text-gray-900">REST API</h2>
            <p className="text-gray-500 mt-3">Integrate Base64 conversion into your applications</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">POST</span>
                <code className="text-gray-700 text-sm">/api/text-to-base64</code>
              </div>
              <pre className="bg-white rounded-xl p-4 text-sm overflow-x-auto border border-gray-200">
                <code className="text-gray-700">
{`{
  "text": "Hello World"
}

// Response
{
  "base64": "SGVsbG8gV29ybGQ="
}`}
                </code>
              </pre>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">POST</span>
                <code className="text-gray-700 text-sm">/api/image-to-base64</code>
              </div>
              <pre className="bg-white rounded-xl p-4 text-sm overflow-x-auto border border-gray-200">
                <code className="text-gray-700">
{`// multipart/form-data
// field: "image"

// Response
{
  "base64": "data:image/png;..."
}`}
                </code>
              </pre>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-8 bg-gray-50 rounded-2xl px-8 py-5 border border-gray-100">
              <div>
                <p className="text-gray-500 text-sm">Free</p>
                <p className="text-gray-900 font-semibold">100 req/day</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-gray-500 text-sm">Pro</p>
                <p className="text-gray-900 font-semibold">10,000 req/day</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <button className="bg-blue-950 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition text-sm">
                Get API Key
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-950 rounded flex items-center justify-center text-white font-bold text-xs">
              B
            </div>
            <span className="text-gray-500 text-sm">Base64 by Orbit Labs</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-gray-900 transition">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition">Terms</a>
            <a href="#" className="hover:text-gray-900 transition">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
