console.log('🔧 PriceController: Starting module load');

// Sample data that matches the frontend expectations
const samplePrices = [
  {
    id: 1,
    district: 'Colombo',
    province: 'Western',
    market: 'Colombo Center',
    variety: 'Red Rice',
    type: 'Local',
    pricePerKg: 250.00,
    previousPrice: 245.00,
    currency: 'LKR',
    trend: 'rising',
    priceChange: 5.00,
    availability: 'Available',
    status: 'Active',
    description: 'Red Rice - Local variety from Colombo',
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    currentPrice: 250.00,
    unit: 'LKR/kg',
    qualityGrade: 'Grade A+',
    collectionCenter: 'Colombo Center'
  },
  {
    id: 2,
    district: 'Kandy',
    province: 'Central',
    market: 'Kandy Center',
    variety: 'White Rice',
    type: 'Keeri Samba',
    pricePerKg: 270.00,
    previousPrice: 265.00,
    currency: 'LKR',
    trend: 'rising',
    priceChange: 5.00,
    availability: 'Available',
    status: 'Active',
    description: 'White Rice - Premium Keeri Samba',
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    currentPrice: 270.00,
    unit: 'LKR/kg',
    qualityGrade: 'Premium',
    collectionCenter: 'Kandy Center'
  }
];

console.log('🔧 PriceController: Sample data loaded');

// Get all paddy prices with filtering
const getAllPrices = async (req, res) => {
  try {
    console.log('📡 PriceController: getAllPrices called');
    console.log('📄 Query params:', req.query);
    
    const {
      district,
      province,
      variety,
      type,
      status = 'Active'
    } = req.query;

    let filteredPrices = [...samplePrices];

    // Apply filters
    if (district) {
      filteredPrices = filteredPrices.filter(price => 
        price.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (province) {
      filteredPrices = filteredPrices.filter(price => 
        price.province.toLowerCase().includes(province.toLowerCase())
      );
    }

    if (variety) {
      filteredPrices = filteredPrices.filter(price => 
        price.variety.toLowerCase().includes(variety.toLowerCase())
      );
    }

    if (type) {
      filteredPrices = filteredPrices.filter(price => 
        price.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (status) {
      filteredPrices = filteredPrices.filter(price => price.status === status);
    }

    console.log('✅ PriceController: Returning', filteredPrices.length, 'records');
    
    res.json({
      success: true,
      data: filteredPrices,
      count: filteredPrices.length
    });

  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paddy prices',
      error: error.message
    });
  }
};

// Get price by ID
const getPriceById = async (req, res) => {
  try {
    const { id } = req.params;
    const price = samplePrices.find(p => p.id === parseInt(id));

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found'
      });
    }
    
    res.json({
      success: true,
      data: price
    });

  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price',
      error: error.message
    });
  }
};

// Add new price
const addPrice = async (req, res) => {
  try {
    const {
      district,
      variety,
      type,
      price
    } = req.body;

    // Validation
    if (!district || !variety || !type || !price) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: district, variety, type, price'
      });
    }

    console.log('📝 Adding new price:', { district, variety, type, price });
    
    res.status(201).json({
      success: true,
      message: 'Price added successfully (demo mode)',
      id: Date.now() // Simple ID generation
    });

  } catch (error) {
    console.error('Error adding price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add price',
      error: error.message
    });
  }
};

// Update price
const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    console.log('📝 Updating price for ID:', id, 'New price:', price);
    
    res.json({
      success: true,
      message: 'Price updated successfully (demo mode)',
      changes: 1
    });

  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update price',
      error: error.message
    });
  }
};

// Delete price
const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting price ID:', id);
    
    res.json({
      success: true,
      message: 'Price deleted successfully (demo mode)'
    });

  } catch (error) {
    console.error('Error deleting price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete price',
      error: error.message
    });
  }
};

console.log('🔧 PriceController: Functions defined, preparing exports');

module.exports = {
  getAllPrices,
  getPriceById,
  addPrice,
  updatePrice,
  deletePrice
};

console.log('🔧 PriceController: Module exports completed');
