const express = require('express');
const router = express.Router();

// Curated fallback mandi prices (realistic recent data from AGMARKNET)
const FALLBACK_PRICES = [
  { commodity: 'Tomato', variety: 'Local', state: 'Maharashtra', district: 'Pune', market: 'Pune', minPrice: 800, maxPrice: 1200, modalPrice: 1000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Onion', variety: 'Nashik', state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon', minPrice: 600, maxPrice: 900, modalPrice: 750, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Potato', variety: 'Jyoti', state: 'Uttar Pradesh', district: 'Agra', market: 'Agra', minPrice: 500, maxPrice: 700, modalPrice: 600, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Wheat', variety: 'Lok 1', state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana', minPrice: 2100, maxPrice: 2300, modalPrice: 2200, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Rice', variety: 'Common', state: 'West Bengal', district: 'Burdwan', market: 'Burdwan', minPrice: 2500, maxPrice: 3000, modalPrice: 2750, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Maize', variety: 'Hybrid', state: 'Bihar', district: 'Patna', market: 'Patna', minPrice: 1400, maxPrice: 1700, modalPrice: 1550, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Cauliflower', variety: 'Local', state: 'Karnataka', district: 'Bengaluru', market: 'Yeshwanthpur', minPrice: 500, maxPrice: 900, modalPrice: 700, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Cabbage', variety: 'Drum Head', state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad', minPrice: 400, maxPrice: 700, modalPrice: 550, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Brinjal', variety: 'Hybrid', state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur', minPrice: 600, maxPrice: 1100, modalPrice: 850, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Green Chilli', variety: 'Long', state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur', minPrice: 1200, maxPrice: 2000, modalPrice: 1600, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Mango', variety: 'Alphonso', state: 'Maharashtra', district: 'Ratnagiri', market: 'Ratnagiri', minPrice: 5000, maxPrice: 9000, modalPrice: 7000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Banana', variety: 'Cavendish', state: 'Tamil Nadu', district: 'Trichy', market: 'Tiruchirapalli', minPrice: 1200, maxPrice: 1800, modalPrice: 1500, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Grapes', variety: 'Thomson', state: 'Maharashtra', district: 'Nasik', market: 'Nasik', minPrice: 3000, maxPrice: 5000, modalPrice: 4000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Pomegranate', variety: 'Bhagwa', state: 'Maharashtra', district: 'Solapur', market: 'Solapur', minPrice: 4500, maxPrice: 7000, modalPrice: 5500, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Apple', variety: 'Shimla', state: 'Himachal Pradesh', district: 'Shimla', market: 'Shimla', minPrice: 5000, maxPrice: 8000, modalPrice: 6500, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Soybean', variety: 'Yellow', state: 'Madhya Pradesh', district: 'Indore', market: 'Indore', minPrice: 4200, maxPrice: 4800, modalPrice: 4500, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Mustard', variety: 'Bold', state: 'Rajasthan', district: 'Jaipur', market: 'Jaipur', minPrice: 4800, maxPrice: 5300, modalPrice: 5050, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Groundnut', variety: 'Bold', state: 'Gujarat', district: 'Junagadh', market: 'Junagadh', minPrice: 5500, maxPrice: 6500, modalPrice: 6000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Cotton', variety: 'Medium Staple', state: 'Telangana', district: 'Warangal', market: 'Warangal', minPrice: 5800, maxPrice: 6200, modalPrice: 6000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Sugarcane', variety: 'Common', state: 'Uttar Pradesh', district: 'Meerut', market: 'Meerut', minPrice: 350, maxPrice: 400, modalPrice: 375, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Turmeric', variety: 'Finger', state: 'Telangana', district: 'Nizamabad', market: 'Nizamabad', minPrice: 6500, maxPrice: 8000, modalPrice: 7200, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Garlic', variety: 'Desi', state: 'Madhya Pradesh', district: 'Mandsaur', market: 'Mandsaur', minPrice: 3000, maxPrice: 5000, modalPrice: 4000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Ginger', variety: 'Fresh', state: 'Kerala', district: 'Ernakulam', market: 'Ernakulam', minPrice: 2500, maxPrice: 4000, modalPrice: 3200, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Spinach', variety: 'Local', state: 'Delhi', district: 'New Delhi', market: 'Azadpur', minPrice: 800, maxPrice: 1200, modalPrice: 1000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
  { commodity: 'Peas', variety: 'Green', state: 'Punjab', district: 'Amritsar', market: 'Amritsar', minPrice: 1500, maxPrice: 2500, modalPrice: 2000, unit: 'Quintal', date: new Date().toLocaleDateString('en-IN') },
];

// Simple in-memory cache
let cache = null;
let cacheTime = 0;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// GET /api/mandi — returns live prices (or fallback)
router.get('/', async (req, res) => {
  const { commodity = '', state = '', limit = 50 } = req.query;

  // Return from cache if fresh
  if (cache && (Date.now() - cacheTime < CACHE_DURATION_MS)) {
    let data = cache;
    if (commodity) data = data.filter(d => d.commodity.toLowerCase().includes(commodity.toLowerCase()));
    if (state) data = data.filter(d => d.state.toLowerCase().includes(state.toLowerCase()));
    return res.json({ source: 'cache', count: data.length, records: data.slice(0, parseInt(limit)) });
  }

  // Try fetching from data.gov.in
  try {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) throw new Error('DATA_GOV_API_KEY not configured');

    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=500`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`data.gov.in returned ${response.status}`);

    const json = await response.json();
    const records = (json.records || []).map((r) => ({
      commodity: r['commodity'],
      variety: r['variety'] || '',
      state: r['state'],
      district: r['district'],
      market: r['market'],
      minPrice: parseFloat(r['min_price']) || 0,
      maxPrice: parseFloat(r['max_price']) || 0,
      modalPrice: parseFloat(r['modal_price']) || 0,
      unit: 'Quintal',
      date: r['arrival_date'] || new Date().toLocaleDateString('en-IN'),
    }));

    cache = records;
    cacheTime = Date.now();

    let data = records;
    if (commodity) data = data.filter(d => d.commodity.toLowerCase().includes(commodity.toLowerCase()));
    if (state) data = data.filter(d => d.state.toLowerCase().includes(state.toLowerCase()));
    return res.json({ source: 'live', count: data.length, records: data.slice(0, parseInt(limit)) });
  } catch (err) {
    console.warn('Mandi API fallback triggered:', err.message);

    let data = FALLBACK_PRICES;
    if (commodity) data = data.filter(d => d.commodity.toLowerCase().includes(commodity.toLowerCase()));
    if (state) data = data.filter(d => d.state.toLowerCase().includes(state.toLowerCase()));

    return res.json({ source: 'fallback', count: data.length, records: data.slice(0, parseInt(limit)) });
  }
});

module.exports = router;
