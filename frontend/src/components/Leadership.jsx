import { useState, useEffect } from 'react'
import { Mail, Linkedin, Twitter, User } from 'lucide-react'

const Leadership = () => {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeadership()
  }, [])

  const fetchLeadership = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/leadership?is_active=true')
      
      if (!response.ok) {
        throw new Error('Failed to fetch leadership data')
      }

      const data = await response.json()
      setLeaders(data.data || [])
    } catch (error) {
      console.error('Error fetching leadership:', error)
      setError('Failed to load leadership team')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated professionals leading Sri Lanka's paddy marketing initiatives
          </p>
        </div>

        {leaders.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No leadership members available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {leaders
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map((leader) => (
                <div 
                  key={leader.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Profile Image */}
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {leader.image_url ? (
                      <img
                        src={`http://localhost:5000${leader.image_url}`}
                        alt={leader.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div 
                      className={`flex items-center justify-center w-full h-full ${leader.image_url ? 'hidden' : 'flex'}`}
                      style={{ display: leader.image_url ? 'none' : 'flex' }}
                    >
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {leader.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-3">
                      {leader.position}
                    </p>
                    
                    {leader.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {leader.bio}
                      </p>
                    )}

                    {/* Social Links */}
                    {(leader.email || leader.linkedin_url || leader.twitter_url) && (
                      <div className="flex space-x-3">
                        {leader.email && (
                          <a
                            href={`mailto:${leader.email}`}
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Email"
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                        {leader.linkedin_url && (
                          <a
                            href={leader.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {leader.twitter_url && (
                          <a
                            href={leader.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            title="Twitter"
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Leadership