"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ApiKey {
  id: string;
  key: string;
  name: string | null;
  createdAt: string;
  lastUsed: string | null;
  rateLimit: number;
  enabled: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetchApiKeys();
    }
  }, [status, router]);

  const fetchApiKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      setApiKeys(data.keys || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName || undefined }),
      });
      const data = await res.json();
      if (data.key) {
        setApiKeys([data.key, ...apiKeys]);
        setNewKeyName("");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;
    try {
      await fetch(`/api/keys/${id}`, { method: "DELETE" });
      setApiKeys(apiKeys.filter((k) => k.id !== id));
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-gray-900">
            Base64 API
          </a>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{session?.user?.email}</span>
            <a
              href="/api/auth/signout"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign out
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your API keys</p>
        </div>

        {/* Create new key */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Create New API Key
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Key name (optional)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={createApiKey}
              disabled={creating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {creating ? "Creating..." : "Create Key"}
            </button>
          </div>
        </div>

        {/* API Keys list */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Your API Keys</h2>
          </div>
          {apiKeys.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No API keys yet. Create one above to get started.
            </div>
          ) : (
            <div className="divide-y">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {apiKey.name || "Unnamed key"}
                      </span>
                      {!apiKey.enabled && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {apiKey.key.slice(0, 12)}...{apiKey.key.slice(-4)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Created {new Date(apiKey.createdAt).toLocaleDateString()} •{" "}
                      {apiKey.rateLimit} requests/day
                      {apiKey.lastUsed && (
                        <> • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage info */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900">How to use your API key</h3>
          <pre className="mt-4 bg-blue-900 text-blue-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST https://api.base64api.com/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"type": "encode", "data": "Hello World"}'`}
          </pre>
        </div>
      </main>
    </div>
  );
}
