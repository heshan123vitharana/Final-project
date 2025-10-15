import { Users, Edit, Trash2, CheckCircle, AlertCircle, Plus } from 'lucide-react'

const LeadershipCard = ({ leader, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative">
      {/* Order Badge - Prominent Display */}
      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        #{leader.order_index || 0}
      </div>
      
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-4">
            {leader.image_url && (
              <img
                src={`http://localhost:5000${leader.image_url}`}
                alt={leader.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{leader.name}</h3>
              <p className="text-sm text-green-700 font-semibold">{leader.position}</p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            {leader.is_active ? (
              <CheckCircle className="h-5 w-5 text-green-500" title="Active" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" title="Inactive" />
            )}
          </div>
        </div>

        {leader.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {leader.bio}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center space-x-3 mb-4 text-gray-500">
          {leader.email && (
            <a href={`mailto:${leader.email}`} className="hover:text-green-600" title="Email">
              📧
            </a>
          )}
          {leader.linkedin_url && (
            <a href={leader.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700" title="LinkedIn">
              💼
            </a>
          )}
          {leader.twitter_url && (
            <a href={leader.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500" title="Twitter">
              🐦
            </a>
          )}
        </div>

        <div className="border-t pt-3 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Display Order: <span className="font-semibold text-blue-600">#{leader.order_index || 'N/A'}</span>
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(leader)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit Member"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(leader)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const LeadershipGrid = ({ leadership, onEdit, onDelete, onAdd }) => {
  if (!leadership || leadership.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No Leadership Members Found</h3>
        <p className="text-sm mb-4">Get started by adding a new team member.</p>
        <button
          onClick={onAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...leadership]
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        .map(leader => (
          <LeadershipCard
            key={leader.id}
            leader={leader}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  )
}

export default LeadershipGrid
