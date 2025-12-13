import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    Menu,
    X,
    DollarSign,
    Plus,
    Edit2,
    Trash2,
    Save,
    Loader2,
    TrendingUp,
    Calendar,
    BarChart2,
    Download,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import pmbLogo from '../../../assets/logo-p.png';
import rainbowNature from '../../../assets/beautiful-rainbow-nature.jpg';

const RegionalDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('prices'); // 'prices' or 'stock'
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Price State
    const [prices, setPrices] = useState([]);

    // Stock State
    const [stockOverview, setStockOverview] = useState(null);
    const [loadingStock, setLoadingStock] = useState(false);

    // Modal State
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(null); // For edit
    const [priceFormData, setPriceFormData] = useState({
        paddy_type: 'Nadu - White',
        paddy_condition: 'Dry',
        price_per_kg: '',
        effective_date: new Date().toISOString().split('T')[0]
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/regional-admin');
            return;
        }

        setUser(JSON.parse(storedUser));
        fetchPrices();
    }, [navigate]);

    // Fetch Prices
    const fetchPrices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/regional-officers/prices', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch prices');

            const data = await response.json();
            setPrices(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load prices');
        } finally {
            setLoading(false);
        }
    };

    // Fetch Stock Overview
    const fetchStockOverview = async () => {
        setLoadingStock(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/regional-officers/stock-overview', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch stock overview');

            const data = await response.json();
            setStockOverview(data);
        } catch (err) {
            console.error("Stock Fetch Error:", err);
            toast.error("Could not load stock data");
        } finally {
            setLoadingStock(false);
        }
    };

    // Switch Tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'stock' && !stockOverview) {
            fetchStockOverview();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/regional-admin');
    };

    // --- Price Management Handlers ---

    const handlePriceSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const url = currentPrice
                ? `http://localhost:5000/api/regional-officers/prices/${currentPrice.id}`
                : 'http://localhost:5000/api/regional-officers/prices';

            const method = currentPrice ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(priceFormData)
            });

            if (!response.ok) throw new Error('Failed to save price');

            toast.success(currentPrice ? 'Price updated successfully' : 'New price added');
            await fetchPrices();
            setIsPriceModalOpen(false);
            resetPriceForm();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePrice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this price entry?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/regional-officers/prices/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete price');

            toast.success('Price deleted successfully');
            fetchPrices();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const openEditPriceModal = (price) => {
        setCurrentPrice(price);
        setPriceFormData({
            paddy_type: price.paddy_type,
            paddy_condition: price.paddy_condition,
            price_per_kg: price.price_per_kg,
            effective_date: price.effective_date.split('T')[0]
        });
        setIsPriceModalOpen(true);
    };

    const resetPriceForm = () => {
        setCurrentPrice(null);
        setPriceFormData({
            paddy_type: 'Nadu - White',
            paddy_condition: 'Dry',
            price_per_kg: '',
            effective_date: new Date().toISOString().split('T')[0]
        });
    };

    // --- Stock Report Actions ---

    const handleDownloadReport = () => {
        // In a real app, this would trigger a PDF/CSV download from backend
        // For now, we simulate it
        toast.info("Generating District Stock Report...", { duration: 2000 });
        setTimeout(() => {
            const csvContent = "data:text/csv;charset=utf-8,"
                + "Mill Name,Type,Current Stock (kg),Capacity (kg),Utilization\n"
                + stockOverview?.stockByMill.map(m => `${m.mill},${m.type},${m.stock},${m.capacity},${m.utilization}%`).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `stock_report_${user?.district}_${new Date().toISOString()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Report downloaded successfully!");
        }, 1500);
    };

    const handleSendToPMB = async () => {
        if (!stockOverview) return;

        if (!window.confirm(`Are you sure you want to submit the stock report for ${user?.district} to PMB Head Office?`)) {
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const reportData = {
                summary: stockOverview.summary,
                stockByType: stockOverview.stockByType,
                stockByMill: stockOverview.stockByMill
            };

            const response = await fetch('http://localhost:5000/api/regional-officers/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reportType: 'stock_overview',
                    reportData
                })
            });

            if (!response.ok) throw new Error('Failed to submit report');

            toast.success(`Stock report for ${user?.district} sent to PMB Head Office successfully.`);
        } catch (err) {
            console.error('Report submission error:', err);
            toast.error('Failed to send report to PMB Admin.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 bg-emerald-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}
                style={{
                    backgroundImage: `url(${rainbowNature})`,
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'multiply'
                }}
            >
                <div className="flex flex-col h-full bg-black/40 backdrop-blur-sm">
                    <div className="p-4 flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
                            <img src={pmbLogo} alt="Logo" className="w-10 h-10 object-contain" />
                            <div>
                                <h1 className="font-bold text-sm">PMB REGIONAL</h1>
                                <p className="text-xs text-emerald-200">{user?.district}</p>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <nav className="flex-1 mt-8 px-2 space-y-2">
                        <button
                            onClick={() => handleTabChange('prices')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'prices' ? 'bg-white/20 text-white' : 'text-emerald-100 hover:bg-white/10'}`}
                        >
                            <DollarSign size={20} />
                            {sidebarOpen && <span>Price Management</span>}
                        </button>
                        <button
                            onClick={() => handleTabChange('stock')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'stock' ? 'bg-white/20 text-white' : 'text-emerald-100 hover:bg-white/10'}`}
                        >
                            <BarChart2 size={20} />
                            {sidebarOpen && <span>Stock Overview</span>}
                        </button>
                    </nav>

                    <div className="p-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <header className="bg-white shadow-sm px-8 py-4 sticky top-0 z-30 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'prices' ? 'Price Management' : 'Regional Stock Overview'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {activeTab === 'prices'
                                ? `Manage daily paddy prices for ${user?.district}`
                                : `Monitor mill stock levels in ${user?.district}`
                            }
                        </p>
                    </div>
                </header>

                <main className="p-8">

                    {/* --- PRICE TAB --- */}
                    {activeTab === 'prices' && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {['Nadu', 'Samba', 'Keeri'].map(typeKeyword => {
                                    const latestPrice = prices
                                        .filter(p => p.paddy_type && p.paddy_type.toLowerCase().includes(typeKeyword.toLowerCase()) && p.status === 'Active')
                                        .sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date))[0];
                                    const displayName = typeKeyword === 'Nadu' ? 'Nadu - White' : typeKeyword === 'Keeri' ? 'Keeri Samba' : 'Samba';

                                    return (
                                        <div key={typeKeyword} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-emerald-50 rounded-lg">
                                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">Latest</span>
                                            </div>
                                            <h3 className="text-gray-500 text-sm font-medium">{displayName}</h3>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{latestPrice ? `LKR ${latestPrice.price_per_kg}` : 'N/A'}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action Bar */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Price History</h3>
                                <button
                                    onClick={() => { resetPriceForm(); setIsPriceModalOpen(true); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={18} />
                                    Add New Price
                                </button>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Effective Date</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price (LKR)</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {loading ? (
                                            <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading prices...</td></tr>
                                        ) : prices.length === 0 ? (
                                            <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No price records found.</td></tr>
                                        ) : (
                                            prices.map((price) => (
                                                <tr key={price.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(price.effective_date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{price.paddy_type}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600"><span className={`px-2 py-1 rounded-full text-xs ${price.paddy_condition === 'Dry' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{price.paddy_condition}</span></td>
                                                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{price.price_per_kg}</td>
                                                    <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${price.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{price.status}</span></td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button onClick={() => openEditPriceModal(price)} className="text-gray-400 hover:text-emerald-600"><Edit2 size={18} /></button>
                                                        <button onClick={() => handleDeletePrice(price.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* --- STOCK TAB --- */}
                    {activeTab === 'stock' && (
                        <>
                            {loadingStock ? (
                                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>
                            ) : stockOverview ? (
                                <>
                                    {/* Overview Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500 font-medium">Total District Stock</p>
                                            <p className="text-3xl font-bold text-emerald-600 mt-2">{stockOverview.summary.totalStock.toLocaleString()} kg</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500 font-medium">Reporting Mills</p>
                                            <p className="text-3xl font-bold text-blue-600 mt-2">{stockOverview.summary.activeMills}</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500 font-medium">Total Capacity</p>
                                            <p className="text-3xl font-bold text-gray-700 mt-2">{stockOverview.summary.totalCapacity.toLocaleString()} kg</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500 font-medium">Utilization Rate</p>
                                            <div className="flex items-end gap-2">
                                                <p className="text-3xl font-bold text-purple-600 mt-2">{stockOverview.summary.utilizationRate}%</p>
                                                <span className="text-xs text-gray-400 mb-2">of total capacity</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Charts Section (Simplified using CSS bars) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                        {/* Stock by Paddy Type */}
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Stock Breakdown</h3>
                                            <div className="space-y-4">
                                                {stockOverview.stockByType && stockOverview.stockByType.length > 0 ? (
                                                    stockOverview.stockByType.map((item, index) => (
                                                        <div key={index}>
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span className="font-medium text-gray-700">{item.name}</span>
                                                                <span className="text-gray-500">{item.value.toLocaleString()} kg</span>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                                <div
                                                                    className="bg-emerald-500 h-2.5 rounded-full"
                                                                    style={{ width: `${Math.min((item.value / stockOverview.summary.totalStock) * 100, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-gray-400 py-8">No stock data available</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions & Mill Leaderboard */}
                                        <div className="space-y-6">
                                            {/* Report Actions */}
                                            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl shadow-sm border border-emerald-100">
                                                <h3 className="text-lg font-semibold text-emerald-900 mb-4">Report Actions</h3>
                                                <div className="flex flex-col gap-3">
                                                    <button
                                                        onClick={handleDownloadReport}
                                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-emerald-200 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
                                                    >
                                                        <Download size={18} />
                                                        Download District Report (CSV)
                                                    </button>
                                                    <button
                                                        onClick={handleSendToPMB}
                                                        disabled={submitting}
                                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
                                                    >
                                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={18} />}
                                                        Send Report to PMB Admin
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Top Stock Holders */}
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Stock Holders</h3>
                                                <div className="overflow-y-auto max-h-[300px] pr-2">
                                                    {stockOverview.stockByMill && stockOverview.stockByMill.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {stockOverview.stockByMill.slice(0, 5).map((mill, i) => (
                                                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                    <div>
                                                                        <p className="font-medium text-sm text-gray-900">{mill.mill}</p>
                                                                        <p className="text-xs text-gray-500">{mill.type} • {mill.utilization}% Full</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-bold text-sm text-emerald-600">{mill.stock.toLocaleString()} kg</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-center text-gray-400 py-4">No mills reporting stock</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 text-gray-500">Failed to load stock overview.</div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Price Modal */}
            <AnimatePresence>
                {isPriceModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {currentPrice ? 'Update Price' : 'Add New Price'}
                                </h3>
                                <button onClick={() => setIsPriceModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handlePriceSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Paddy Type</label>
                                    <select
                                        value={priceFormData.paddy_type}
                                        onChange={(e) => setPriceFormData({ ...priceFormData, paddy_type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option>Nadu - White</option>
                                        <option>Nadu - Red</option>
                                        <option>Samba</option>
                                        <option>Keeri Samba</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                                    <div className="flex gap-4">
                                        {['Dry', 'Wet'].map(condition => (
                                            <label key={condition} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="condition"
                                                    value={condition}
                                                    checked={priceFormData.paddy_condition === condition}
                                                    onChange={(e) => setPriceFormData({ ...priceFormData, paddy_condition: e.target.value })}
                                                    className="text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-sm text-gray-700">{condition}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR/kg)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">LKR</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={priceFormData.price_per_kg}
                                            onChange={(e) => setPriceFormData({ ...priceFormData, price_per_kg: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                    <input
                                        type="date"
                                        value={priceFormData.effective_date}
                                        onChange={(e) => setPriceFormData({ ...priceFormData, effective_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsPriceModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                                    >
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {currentPrice ? 'Update Price' : 'Save Price'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RegionalDashboard;
