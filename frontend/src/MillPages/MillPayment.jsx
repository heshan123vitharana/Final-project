import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Payment History page component for Mill Dashboard
const MillPayment = () => {
  // State for date filter input
  const [dateFilter, setDateFilter] = useState("");
  // TODO: Replace with real payment data from API or props
  const dummyPayments = [];

  // Set page title on mount
  useEffect(() => {
    document.title = `Dashboard | Payments`;
  }, []);

  // Filter payments by selected date
  const filteredPayments = dummyPayments.filter(payment =>
    dateFilter ? payment.date === dateFilter : true
  );

  // Generate PDF report for filtered payments
  const generatePDF = () => {
    if (filteredPayments.length === 0) {
      alert("No records to generate PDF.");
      return;
    }

    // Create new PDF document
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    // Table columns and rows
    const tableColumn = ["Payment ID", "Farmer ID", "Account No", "Amount (LKR)", "Date", "Status"];
    const tableRows = [];
    let totalAmount = 0;

    // Populate table rows and calculate total amount
    filteredPayments.forEach(payment => {
      totalAmount += payment.amount;
      tableRows.push([
        payment.id,
        payment.farmerId,
        payment.accountNo,
        payment.amount.toLocaleString(),
        payment.date,
        payment.status,
      ]);
    });

    // Generate table in PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 255, 240] },
    });

    // Add total amount below table
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Total Amount: LKR ${totalAmount.toLocaleString()}`, 14, finalY + 10);

    // Save PDF file
    doc.save("Payment_Report.pdf");
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        💰 Payment History
      </h1>

      {/* Filter and PDF download section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border border-green-200">
        {/* Date filter input */}
        <input
          type="date"
          className="border border-green-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        {/* PDF download button */}
        <button
          onClick={generatePDF}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
        >
          Download PDF Report
        </button>
      </div>

      {/* Payment table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-green-200 bg-white">
        <table className="w-full table-auto">
          <thead className="bg-green-200 text-green-900">
            <tr>
              <th className="border px-4 py-2">Payment ID</th>
              <th className="border px-4 py-2">Farmer ID</th>
              <th className="border px-4 py-2">Account No</th>
              <th className="border px-4 py-2">Amount (LKR)</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Show message if no payments match filter */}
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-green-700 italic">
                  No matching records found.
                </td>
              </tr>
            ) : (
              // Render filtered payments
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="odd:bg-white even:bg-green-50 hover:bg-green-100 transition-colors text-center">
                  <td className="border px-4 py-2">{payment.id}</td>
                  <td className="border px-4 py-2">{payment.farmerId}</td>
                  <td className="border px-4 py-2">{payment.accountNo}</td>
                  <td className="border px-4 py-2">{payment.amount.toLocaleString()}</td>
                  <td className="border px-4 py-2">{payment.date}</td>
                  <td className="border px-4 py-2 text-green-700 font-semibold">{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MillPayment;
