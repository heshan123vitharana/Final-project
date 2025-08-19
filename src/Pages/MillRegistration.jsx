import { useEffect, useState } from 'react';

// Dummy Licence History Data for demonstration
const dummyHistory = [
  { id: 1, date: '2025-05-01', status: 'Approved' },
  { id: 2, date: '2025-06-15', status: 'Pending' },
  { id: 3, date: '2025-07-10', status: 'Rejected' },
  { id: 4, date: '2025-08-01', status: 'Approved' },
];

const MillRegistration = () => {
  // Set page title on mount
  useEffect(() => {
    document.title = "Dashboard | Mill Registration";
  }, []);

  // UI state for showing/hiding sections and form
  const [showApplySection, setShowApplySection] = useState(false);
  const [showStatusSection, setShowStatusSection] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [showHistorySection, setShowHistorySection] = useState(false);

  // Licence history and filter state
  const [history] = useState(dummyHistory);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Section toggles
  const toggleApplySection = () => setShowApplySection(!showApplySection);
  const toggleStatusSection = () => setShowStatusSection(!showStatusSection);
  const toggleHistorySection = () => setShowHistorySection(!showHistorySection);

  // Open/close licence form
  const handleOpenForm = (type) => {
    setFormType(type);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setFormType('');
    setShowForm(false);
  };

  // Certificate actions
  const handleViewCertificate = () => {
    window.open('/certificates/sample-certificate.pdf', '_blank');
  };
  const handleDownloadCertificate = () => {
    const link = document.createElement('a');
    link.href = '/certificates/sample-certificate.pdf';
    link.download = 'Licence_Certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auto-filtered history
  const filteredHistory = history.filter((item) => {
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    const matchFromDate = fromDate ? new Date(item.date) >= new Date(fromDate) : true;
    const matchToDate = toDate ? new Date(item.date) <= new Date(toDate) : true;
    return matchStatus && matchFromDate && matchToDate;
  });

  return (
    <div>
      {/* Page heading */}
      <h1 className="text-2xl font-bold mb-6 text-green-700">Mill Registration</h1>

      {/* Widget 1: Status of Licence */}
      <div className="bg-white shadow p-4 rounded mb-6 border border-green-200">
        <button
          onClick={toggleStatusSection}
          className="text-lg font-semibold text-green-700 hover:text-green-800"
        >
          {showStatusSection ? '▼' : '▶'} Status of Licence
        </button>

        {showStatusSection && (
          <div className="mt-4 text-gray-700">
            <p><strong>Apply Date:</strong> 2025-08-01</p>
            <p><strong>Status:</strong> Approved</p>
            <p><strong>Deadline:</strong> 2026-08-01</p>
            <div className="mt-4 flex space-x-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleViewCertificate}
              >
                View Certificate
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={handleDownloadCertificate}
              >
                Download Certificate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Widget 2: Apply Licence */}
      <div className="bg-white shadow p-4 rounded mb-6 border border-green-200">
        <button
          onClick={toggleApplySection}
          className="text-lg font-semibold text-green-700 hover:text-green-800"
        >
          {showApplySection ? '▼' : '▶'} Apply Licence
        </button>

        {showApplySection && (
          <div className="mt-4 space-y-4">
            <ul className="list-disc list-inside text-gray-700">
              <li>Must be a registered mill.</li>
              <li>Provide accurate contact and address details.</li>
              <li>No pending violations or penalties.</li>
              <li>Agree to terms and conditions.</li>
            </ul>
            <div className="flex space-x-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => handleOpenForm('Apply')}
              >
                Apply Licence
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleOpenForm('Renew')}
              >
                Renew Licence
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Widget 3: Licence History */}
      <div className="bg-white shadow p-4 rounded mb-6 border border-green-200">
        <button
          onClick={toggleHistorySection}
          className="text-lg font-semibold text-green-700 hover:text-green-800"
        >
          {showHistorySection ? '▼' : '▶'} View Licence History
        </button>

        {showHistorySection && (
          <div className="mt-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded w-full p-2"
                >
                  <option value="">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-green-100 text-green-800 uppercase text-xs tracking-wider">
                  <th className="border px-4 py-2 text-center">ID</th>
                  <th className="border px-4 py-2 text-center">Date</th>
                  <th className="border px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition`}
                    >
                      <td className="border px-4 py-2 text-center font-medium">{item.id}</td>
                      <td className="border px-4 py-2 text-center">{item.date}</td>
                      <td className="border px-4 py-2 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply / Renew Licence Form */}
      {showForm && (
        <div className="bg-gray-100 p-6 rounded shadow max-w-xl border border-green-200">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            {formType} Licence Form
          </h2>
          <form className="space-y-4">
            <input type="text" placeholder="Mill Name" className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Owner Name" className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Licence Number (if renewing)" className="w-full p-2 border rounded" />
            <textarea placeholder="Reason / Comments" className="w-full p-2 border rounded" rows="4" />

            <div className="flex space-x-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Submit
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCloseForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MillRegistration;

