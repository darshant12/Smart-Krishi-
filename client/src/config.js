// Central API base URL
// In development: empty string → uses the proxy in package.json (localhost:5001)
// In production:  the deployed Render backend URL (set via .env.production)
const API_BASE = process.env.REACT_APP_API_URL || '';

export default API_BASE;
