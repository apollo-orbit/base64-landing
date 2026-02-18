'use client'

import { useState, useCallback } from 'react'

export default function Home() {
  const [textInput, setTextInput] = useState('')
  const [textOutput, setTextOutput] = useState('')
  const [imageOutput, setImageOutput] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const encodeText = () => {
    if (!textInput.trim()) return
    const encoded = btoa(unescape(encodeURIComponent(textInput)))
    setTextOutput(encoded)
  }

  const decodeText = () => {
    if (!textInput.trim()) return
    try {
      const decoded = decodeURIComponent(escape(atob(textInput)))
      setTextOutput(decoded)
    } catch {
      setTextOutput('❌ Error: Invalid Base64 string')
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
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg">
              B64
            </div>
            <span className="font-semibold text-xl">Base64.tools</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#text" className="text-gray-400 hover:text-white transition">Text</a>
            <a href="#image" className="text-gray-400 hover:text-white transition">Image</a>
            <a href="#api" className="text-gray-400 hover:text-white transition">API</a>
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition border border-white/10">
              Get API Key
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Free • No signup required</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Base64 Encoder
            </span>
            <br />
            <span className="text-white">& Decoder</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Convert text and images to Base64 instantly. 
            Beautiful, fast, and developer-friendly.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href="#text" 
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2"
            >
              <span>Text Converter</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a 
              href="#image" 
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <span>Image Converter</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </section>

        {/* Text Converter */}
        <section id="text" className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Text ↔ Base64</h2>
              <p className="text-gray-400">Encode any text to Base64 or decode Base64 back to text</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text or Base64 string here..."
                    className="w-full h-40 bg-black/30 rounded-2xl p-6 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none resize-none border border-white/5 font-mono"
                  />
                  <span className="absolute bottom-4 right-4 text-xs text-gray-500">
                    {textInput.length} characters
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={encodeText}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                  >
                    Encode →
                  </button>
                  <button
                    onClick={decodeText}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-xl font-semibold transition-all"
                  >
                    ← Decode
                  </button>
                </div>
                
                {textOutput && (
                  <div className="relative group">
                    <textarea
                      value={textOutput}
                      readOnly
                      className="w-full h-40 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl p-6 text-green-400 focus:outline-none resize-none border border-green-500/20 font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(textOutput, 'text')}
                      className="absolute top-4 right-4 bg-green-500/20 hover:bg-green-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                      {copied === 'text' ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Image Converter */}
        <section id="image" className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Image → Base64</h2>
              <p className="text-gray-400">Convert any image to a Base64 data URL</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="space-y-6">
                <label 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`block w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex items-center justify-center ${
                    isDragging 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
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
                      <img src={imagePreview} alt="Preview" className="max-h-48 max-w-full rounded-lg mx-auto" />
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 mb-2">Drop an image here or click to upload</p>
                        <p className="text-gray-600 text-sm">PNG, JPG, GIF, WebP supported</p>
                      </>
                    )}
                  </div>
                </label>
                
                {imageOutput && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Output size: <span className="text-white font-medium">{(imageOutput.length / 1024).toFixed(2)} KB</span>
                      </span>
                      <button
                        onClick={() => { setImageOutput(''); setImagePreview('') }}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="relative group">
                      <textarea
                        value={imageOutput}
                        readOnly
                        className="w-full h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-2xl p-6 text-purple-400 text-sm focus:outline-none resize-none border border-purple-500/20 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(imageOutput, 'image')}
                        className="absolute top-4 right-4 bg-purple-500/20 hover:bg-purple-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      >
                        {copied === 'image' ? (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Data URL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* API Section */}
        <section id="api" className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <span className="text-blue-400 text-sm font-medium">For Developers</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">REST API</h2>
              <p className="text-gray-400">Integrate Base64 conversion directly into your applications</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-medium">POST</span>
                  <code className="text-gray-300">/api/text-to-base64</code>
                </div>
                <pre className="bg-black/30 rounded-xl p-4 text-sm overflow-x-auto">
                  <code className="text-gray-300">
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
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-medium">POST</span>
                  <code className="text-gray-300">/api/image-to-base64</code>
                </div>
                <pre className="bg-black/30 rounded-xl p-4 text-sm overflow-x-auto">
                  <code className="text-gray-300">
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
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-6 bg-white/5 rounded-2xl px-8 py-4 border border-white/10">
                <div className="text-left">
                  <p className="text-gray-400 text-sm">Free tier</p>
                  <p className="text-white font-semibold">100 requests/day</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-left">
                  <p className="text-gray-400 text-sm">Pro</p>
                  <p className="text-white font-semibold">10,000 req/day</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-xl font-semibold transition-all">
                  Get API Key
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                B64
              </div>
              <span className="text-gray-400">Base64.tools by Orbit Labs</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
