import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const MillPayment = () => {
  const [dateFilter, setDateFilter] = useState("");

  const dummyPayments = [
    { id: "PMT001", farmerId: "F001", accountNo: "1234567890", amount: 50000, date: "2025-08-06", status: "Verified" },
    { id: "PMT002", farmerId: "F002", accountNo: "9876543210", amount: 30000, date: "2025-08-05", status: "Verified" },
    { id: "PMT003", farmerId: "F003", accountNo: "1122334455", amount: 20000, date: "2025-08-04", status: "Verified" },
  ];

  useEffect(() => {
    document.title = `Dashboard | Payments`;
  }, []);

  const filteredPayments = dummyPayments.filter(payment =>
    dateFilter ? payment.date === dateFilter : true
  );

  const generatePDF = () => {
    if (filteredPayments.length === 0) {
      alert("No records to generate PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const tableColumn = ["Payment ID", "Farmer ID", "Account No", "Amount (LKR)", "Date", "Status"];
    const tableRows = [];
    let totalAmount = 0;

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

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 255, 240] },
    });

    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Total Amount: LKR ${totalAmount.toLocaleString()}`, 14, finalY + 10);

    doc.save("Payment_Report.pdf");
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        💰 Payment History
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border border-green-200">
        <input
          type="date"
          className="border border-green-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button
          onClick={generatePDF}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
        >
          Download PDF Report
        </button>
      </div>

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
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-green-700 italic">
                  No matching records found.
                </td>
              </tr>
            ) : (
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
