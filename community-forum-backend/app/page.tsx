import Link from 'next/link'

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Community Forum API
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Backend APIs for connecting local communities across the Netherlands
            </p>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Event Module - Live Demo
              </h2>
              <p className="text-gray-600 mb-6">
                Complete backend implementation for community events with authentication,
                CRUD operations, and event registration system.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Link
                    href="/api-docs"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  📚 API Documentation
                </Link>
                <Link
                    href="/api/docs"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  📋 OpenAPI Spec
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🔐 Authentication</h3>
                <p className="text-gray-600 text-sm">
                  JWT-based authentication with user registration and login
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📅 Events</h3>
                <p className="text-gray-600 text-sm">
                  Full CRUD operations for community events with registration system
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🗄️ Database</h3>
                <p className="text-gray-600 text-sm">
                  PostgreSQL with Prisma ORM hosted on Supabase
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Start</h3>
              <div className="text-left max-w-2xl mx-auto">
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm mb-4">
                  <div># Test Authentication</div>
                  <div>POST /api/auth/login</div>
                  <div className="text-gray-300">{"{"}</div>
                  <div className="ml-4">"email": "admin@communityforum.com",</div>
                  <div className="ml-4">"password": "admin123"</div>
                  <div className="text-gray-300">{"}"}</div>
                </div>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
                  <div># Get Events</div>
                  <div>GET /api/events</div>
                  <div className="text-gray-300"># No authentication required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}