'use client'

import { useEffect, useState } from 'react'

interface SwaggerSpec {
    openapi: string
    info: any
    servers: any[]
    paths: any
    components: any
}

export default function ApiDocsPage() {
    const [spec, setSpec] = useState<SwaggerSpec | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/docs')
            .then(res => res.json())
            .then(data => {
                setSpec(data)
                setLoading(false)
            })
            .catch(err => {
                setError('Failed to load API documentation')
                setLoading(false)
                console.error('Error loading API docs:', err)
            })
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">Loading API Documentation...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Documentation</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (!spec) return null

    const getMethodColor = (method: string) => {
        switch (method.toLowerCase()) {
            case 'get': return 'bg-green-500'
            case 'post': return 'bg-blue-500'
            case 'put': return 'bg-yellow-500'
            case 'delete': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const toggleEndpoint = (path: string, method: string) => {
        const key = `${method}-${path}`
        setSelectedEndpoint(selectedEndpoint === key ? null : key)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{spec.info.title}</h1>
                        <p className="text-gray-600 text-lg mb-4">{spec.info.description}</p>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-500">Version:</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                {spec.info.version}
              </span>
                        </div>
                    </div>

                    {/* Base URL */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Base URL</h2>
                        <code className="bg-blue-100 px-3 py-2 rounded text-blue-800 font-mono">
                            {spec.servers[0]?.url || 'http://localhost:3000'}
                        </code>
                    </div>

                    {/* Authentication Info */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <h2 className="text-lg font-semibold text-yellow-800 mb-3">🔐 Authentication</h2>
                        <p className="text-yellow-700 mb-3">
                            This API uses JWT Bearer token authentication. Include the token in the Authorization header:
                        </p>
                        <code className="bg-yellow-100 px-3 py-2 rounded text-yellow-800 font-mono block mb-3">
                            Authorization: Bearer YOUR_JWT_TOKEN
                        </code>

                        <div className="bg-white border border-yellow-300 rounded p-3">
                            <h3 className="font-semibold text-yellow-800 mb-2">Test Credentials:</h3>
                            <div className="space-y-1 text-sm font-mono">
                                <div><strong>Admin:</strong> admin@communityforum.com / admin123</div>
                                <div><strong>User:</strong> john.doe@example.com / password123</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Test Section */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <h2 className="text-lg font-semibold text-green-800 mb-3">🚀 Quick Test</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-green-700 mb-2">1. Login (Get Token)</h3>
                                <code className="bg-green-100 p-2 rounded text-xs text-green-800 block">
                                    POST /api/auth/login<br/>
                                    {`{"email": "admin@communityforum.com", "password": "admin123"}`}
                                </code>
                            </div>
                            <div>
                                <h3 className="font-medium text-green-700 mb-2">2. Get Events (Public)</h3>
                                <code className="bg-green-100 p-2 rounded text-xs text-green-800 block">
                                    GET /api/events<br/>
                                    No authentication required
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* API Endpoints */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>

                        {Object.entries(spec.paths).map(([path, methods]: [string, any]) => (
                            <div key={path} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-gray-50 px-4 py-3 border-b">
                                    <h3 className="text-lg font-semibold text-gray-800">{path}</h3>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {Object.entries(methods).map(([method, details]: [string, any]) => {
                                        const endpointKey = `${method}-${path}`
                                        const isExpanded = selectedEndpoint === endpointKey

                                        return (
                                            <div key={method}>
                                                <button
                                                    onClick={() => toggleEndpoint(path, method)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${getMethodColor(method)}`}>
                                {method.toUpperCase()}
                              </span>
                                                            <span className="font-medium text-gray-900">{details.summary}</span>
                                                            {details.security && (
                                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                  🔒 Auth Required
                                </span>
                                                            )}
                                                        </div>
                                                        <svg
                                                            className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>

                                                {isExpanded && (
                                                    <div className="px-4 pb-4 bg-gray-50 border-t">
                                                        {details.description && (
                                                            <p className="text-gray-600 mb-3 mt-3">{details.description}</p>
                                                        )}

                                                        {details.parameters && (
                                                            <div className="mb-4">
                                                                <h4 className="font-semibold text-gray-800 mb-2">Parameters:</h4>
                                                                <div className="bg-white rounded border p-3 space-y-2">
                                                                    {details.parameters.map((param: any, index: number) => (
                                                                        <div key={index} className="flex items-start gap-2 text-sm">
                                                                            <code className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                                                {param.name}
                                                                            </code>
                                                                            <span className="text-gray-500">({param.in})</span>
                                                                            {param.required && <span className="text-red-500 font-bold">*</span>}
                                                                            {param.description && (
                                                                                <span className="text-gray-600">- {param.description}</span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {details.requestBody && (
                                                            <div className="mb-4">
                                                                <h4 className="font-semibold text-gray-800 mb-2">Request Body:</h4>
                                                                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                                                                    Content-Type: application/json
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <h4 className="font-semibold text-gray-800 mb-2">Responses:</h4>
                                                            <div className="bg-white rounded border p-3 space-y-2">
                                                                {Object.entries(details.responses).map(([code, response]: [string, any]) => (
                                                                    <div key={code} className="flex items-start gap-2 text-sm">
                                    <span className={`font-mono px-2 py-1 rounded ${
                                        code.startsWith('2') ? 'bg-green-100 text-green-800' :
                                            code.startsWith('4') ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                      {code}
                                    </span>
                                                                        <span className="text-gray-600">{response.description}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Example curl command */}
                                                        <div className="mt-4">
                                                            <h4 className="font-semibold text-gray-800 mb-2">Example Request:</h4>
                                                            <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                                                                <div>{method.toUpperCase()} {spec.servers[0]?.url || 'http://localhost:3000'}{path}</div>
                                                                {details.security && (
                                                                    <div className="text-yellow-400">Authorization: Bearer YOUR_JWT_TOKEN</div>
                                                                )}
                                                                {details.requestBody && (
                                                                    <div className="text-blue-400">Content-Type: application/json</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <a
                                href="/api/docs"
                                className="block p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                                <h3 className="font-medium text-gray-900 mb-1">📋 OpenAPI Spec</h3>
                                <p className="text-sm text-gray-600">Raw OpenAPI 3.0 specification</p>
                            </a>
                            <a
                                href="/"
                                className="block p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                                <h3 className="font-medium text-gray-900 mb-1">🏠 Home</h3>
                                <p className="text-sm text-gray-600">Back to main page</p>
                            </a>
                            <div className="p-3 border border-gray-200 rounded bg-gray-50">
                                <h3 className="font-medium text-gray-900 mb-1">📚 Documentation</h3>
                                <p className="text-sm text-gray-600">Community Forum API v{spec.info.version}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}