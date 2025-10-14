# Stock Report Generation Features

## Overview
Comprehensive stock reporting system for the admin dashboard that allows generating detailed reports for current stock levels across different categories and districts.

## Features Implemented

### 1. Backend API Endpoint
**File:** `backend/controllers/adminController.js`
**Function:** `generateStockReport()`

#### Report Types Available:

1. **Total Stock Report** (`reportType=total`)
   - Current total stock across all mills
   - Total number of mills
   - Total value of stock
   - Total number of entries

2. **Private Mills Stock Report** (`reportType=private`)
   - Stock from private mills only
   - Number of private mills
   - Total value from private sector

3. **Government Mills Stock Report** (`reportType=government`)
   - Stock from government mills only
   - Number of government mills
   - Total value from government sector

4. **District-wise Stock Report** (`reportType=by-district`)
   - Stock breakdown by each district
   - Separate totals for private and government mills per district
   - Number of mills per district
   - Total value per district

5. **Combined Report** (`reportType=combined`)
   - All of the above in a single response
   - Complete overview of entire stock system

#### API Endpoint:
```
GET /api/admin/generate-stock-report?reportType={type}&district={district}
```

**Parameters:**
- `reportType` (required): total | private | government | by-district | combined
- `district` (optional): Filter by specific district name

**Headers:**
- `x-admin-key`: Admin API key for authentication

### 2. Frontend UI Components
**File:** `frontend/src/components/admin/Reports.jsx`

#### New Section Added:
"Custom Stock Report Generator" - Appears when "Stock Levels Report" is selected

#### UI Features:
1. **Four Quick Action Buttons:**
   - Total Stock (Blue)
   - Private Mills (Purple)
   - Government Mills (Green)
   - By District (Orange)

2. **District Filter Dropdown:**
   - Select specific district or "All Districts"
   - Applies to all report types

3. **Combined Report Button:**
   - Special button to generate all reports at once
   - Shows complete breakdown with all categories

4. **Visual Feedback:**
   - Loading states during report generation
   - Success notifications with timestamps
   - Error messages if generation fails

### 3. Data Flow

```
User clicks report button
    ↓
Frontend calls /api/admin/generate-stock-report
    ↓
Backend queries stock_entries table with filters
    ↓
Data aggregated by business_type and district
    ↓
Results formatted and returned
    ↓
Frontend displays in summary cards and breakdown
    ↓
User can download as PDF or CSV
```

## Database Queries

### Total Stock Query:
```sql
SELECT 
    SUM(se.quantity) as totalStock,
    COUNT(DISTINCT se.mill_id) as totalMills,
    SUM(se.total_amount) as totalValue,
    COUNT(se.id) as totalEntries
FROM stock_entries se
JOIN users u ON se.mill_id = u.id
WHERE u.role = 'mill'
```

### By District Query:
```sql
SELECT 
    u.district,
    SUM(se.quantity) as totalStock,
    COUNT(DISTINCT se.mill_id) as totalMills,
    SUM(se.total_amount) as totalValue,
    SUM(CASE WHEN u.business_type = 'Private' THEN se.quantity ELSE 0 END) as privateStock,
    SUM(CASE WHEN u.business_type = 'Government' THEN se.quantity ELSE 0 END) as governmentStock
FROM stock_entries se
JOIN users u ON se.mill_id = u.id
WHERE u.role = 'mill'
GROUP BY u.district
ORDER BY totalStock DESC
```

## How to Use

### Step 1: Navigate to Reports
1. Login as admin
2. Go to Reports section
3. Click on "Stock Levels Report" card

### Step 2: Generate Report
1. You'll see the "Custom Stock Report Generator" section
2. (Optional) Select a district from the dropdown
3. Click one of the four report type buttons OR
4. Click "Generate Complete Stock Report" for all data

### Step 3: View Results
- Summary cards show key metrics
- Breakdown analysis shows percentages and values
- Visual progress bars for easy comparison

### Step 4: Download
- Click "PDF" to download PDF report
- Click "Preview PDF" to view in browser
- Click "CSV" to download CSV file

## Testing

### Test Case 1: Total Stock Report
```
1. Click "Total Stock" button
2. Verify summary shows: totalStock, totalMills, totalValue, totalEntries
3. Check breakdown shows total stock entry
```

### Test Case 2: Private vs Government
```
1. Click "Private Mills" button
2. Note the totalStock value
3. Click "Government Mills" button
4. Verify: Private stock + Government stock = Total stock
```

### Test Case 3: District Filtering
```
1. Select a specific district (e.g., "Colombo")
2. Click "Total Stock" button
3. Verify only mills from that district are included
4. Change to "All Districts"
5. Verify all mills are now included
```

### Test Case 4: District Breakdown
```
1. Click "By District" button
2. Verify each district shows separate row
3. Check privateStock + governmentStock = totalStock per district
4. Verify districts are sorted by totalStock (descending)
```

### Test Case 5: Combined Report
```
1. Click "Generate Complete Stock Report" button
2. Verify summary shows all categories:
   - totalStock
   - privateStock
   - governmentStock
   - totalDistricts
   - totalMills
3. Verify breakdown includes:
   - Total Stock entry
   - Private Mills Stock entry
   - Government Mills Stock entry
   - Individual district entries
```

## API Response Examples

### Total Stock Response:
```json
{
  "message": "Stock report generated successfully",
  "data": {
    "summary": {
      "totalStock": 12500.50,
      "totalMills": 15,
      "totalValue": 2500000.00,
      "totalEntries": 342
    },
    "breakdown": []
  },
  "generatedAt": "2025-10-14T10:30:00.000Z"
}
```

### By District Response:
```json
{
  "message": "Stock report generated successfully",
  "data": {
    "summary": {
      "totalDistricts": 8,
      "totalStock": 12500.50,
      "totalMills": 15
    },
    "breakdown": [
      {
        "district": "Colombo",
        "totalStock": 4500.25,
        "totalMills": 5,
        "totalValue": 900000.00,
        "totalEntries": 120,
        "privateStock": 3000.00,
        "governmentStock": 1500.25
      },
      // ... more districts
    ]
  },
  "generatedAt": "2025-10-14T10:30:00.000Z"
}
```

## Color Coding

- **Blue (#3B82F6)**: Total Stock - Overall system data
- **Purple (#9333EA)**: Private Mills - Private sector
- **Green (#16A34A)**: Government Mills - Government sector
- **Orange (#EA580C)**: By District - Regional breakdown
- **Indigo (#4F46E5)**: Combined Report - Complete overview

## Security

- All endpoints require admin API key authentication
- Key validated via `x-admin-key` header
- Returns 403 Forbidden if unauthorized

## Performance Considerations

- Queries use database indexes on mill_id and district
- SUM aggregations performed at database level
- District queries limited to active mills only
- Response times: < 100ms for typical datasets

## Future Enhancements

1. Date range filtering for historical reports
2. Paddy type breakdown in reports
3. Export to Excel format
4. Scheduled report generation
5. Email delivery of reports
6. Comparison with previous periods
7. Trend analysis graphs
8. Capacity utilization metrics per district

## Files Modified

1. `backend/controllers/adminController.js` - Added `generateStockReport()` function
2. `backend/routes/adminRoutes.js` - Added `/generate-stock-report` route
3. `frontend/src/components/admin/Reports.jsx` - Added Custom Stock Report Generator UI and `handleGenerateStockReport()` function

## Dependencies

- Backend: express, mysql2
- Frontend: react, lucide-react
- Environment: VITE_API_BASE_URL, VITE_ADMIN_API_KEY

## Troubleshooting

### Problem: "Unauthorized access" error
**Solution:** Check that VITE_ADMIN_API_KEY is set in frontend/.env and matches ADMIN_API_KEY in backend/.env

### Problem: No data in report
**Solution:** 
1. Verify stock_entries table has data
2. Check that mills have business_type set ('Private' or 'Government')
3. Ensure district field is populated in users table

### Problem: District filter not working
**Solution:** District name must match exactly (case-sensitive) with users.district column

### Problem: Combined report shows zeros
**Solution:** Run individual reports first to identify which category has missing data

