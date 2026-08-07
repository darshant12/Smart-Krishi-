import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getWeatherInfo(code) {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        icon: '☀️',
        bg: 'from-amber-400 to-orange-500',
        tip: 'Ideal conditions for harvesting, drying grain, and solar drying. Irrigate early in the morning to prevent evaporation loss.',
      };
    case 1:
    case 2:
      return {
        label: 'Partly Cloudy',
        icon: '🌤️',
        bg: 'from-sky-400 to-emerald-500',
        tip: 'Favorable conditions for field work, weeding, and fertilizer application.',
      };
    case 3:
      return {
        label: 'Overcast',
        icon: '☁️',
        bg: 'from-slate-400 to-slate-600',
        tip: 'Cooler canopy temperatures. Excellent time for transplanting seedlings and soil sampling.',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy / Rime',
        icon: '🌫️',
        bg: 'from-gray-400 to-slate-500',
        tip: 'High humidity and reduced visibility. Drive tractors with fog lights on and inspect crops for fungal leaf spot.',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Light Drizzle',
        icon: '🌦️',
        bg: 'from-blue-400 to-indigo-500',
        tip: 'Light surface moisture. Postpone pesticide sprays until leaves dry out to prevent chemical wash-off.',
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Rainy',
        icon: '🌧️',
        bg: 'from-blue-600 to-cyan-700',
        tip: 'Rainfall detected! Pause manual irrigation and ensure field drainage channels are clear to prevent waterlogging.',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Snowfall',
        icon: '❄️',
        bg: 'from-cyan-500 to-blue-700',
        tip: 'Frost alert! Cover high-value horticultural crops with straw or protective mulching.',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        icon: '🌧️',
        bg: 'from-indigo-600 to-blue-800',
        tip: 'Heavy showers likely. Protect harvested produce in dry storage and postpone soil tilling.',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: '🌩️',
        bg: 'from-purple-700 to-slate-900',
        tip: 'Severe weather alert! Seek shelter, keep livestock in safe barns, and disconnect field electrical pumps.',
      };
    default:
      return {
        label: 'Variable Weather',
        icon: '🌡️',
        bg: 'from-emerald-500 to-teal-600',
        tip: 'Monitor crop moisture and adjust field activities accordingly.',
      };
  }
}

const PRESET_CITIES = ['New Delhi', 'Pune', 'Ludhiana', 'Jaipur', 'Bengaluru', 'Patna', 'Hyderabad', 'Ahmedabad'];

export default function Weather() {
  const { user } = useAuth();
  const [cityInput, setCityInput] = useState(user?.village || 'New Delhi');
  const [activeLocation, setActiveLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch weather data given latitude, longitude, and display name
  const fetchWeatherByCoords = useCallback(async (lat, lon, locationName, countryName = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather forecast data from Open-Meteo.');
      }

      const data = await response.json();
      setActiveLocation({
        name: locationName,
        country: countryName,
        lat: lat.toFixed(2),
        lon: lon.toFixed(2),
      });
      setWeatherData(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Unable to retrieve weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search location using Open-Meteo Geocoding API
  const handleSearchCity = useCallback(async (searchName) => {
    if (!searchName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName.trim())}&count=1`
      );

      if (!geoRes.ok) {
        throw new Error('Failed to reach geocoding service.');
      }

      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Location "${searchName}" not found. Please try another city or village.`);
      }

      const match = geoData.results[0];
      const displayName = `${match.name}${match.admin1 ? `, ${match.admin1}` : ''}`;
      await fetchWeatherByCoords(match.latitude, match.longitude, displayName, match.country);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError(err.message || 'Could not find location.');
      setLoading(false);
    }
  }, [fetchWeatherByCoords]);

  // Initial load
  useEffect(() => {
    const initialCity = user?.village || 'New Delhi';
    handleSearchCity(initialCity);
  }, [user?.village, handleSearchCity]);

  // Use Browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude, 'My Current Location');
      },
      (geoErr) => {
        console.error('Geolocation error:', geoErr);
        setError('Location permission denied or unavailable. Please search for your city manually.');
        setLoading(false);
      }
    );
  };

  const current = weatherData?.current_weather;
  const currentInfo = current ? getWeatherInfo(current.weathercode) : null;
  const daily = weatherData?.daily;

  // Day formatter
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout>
      <section className="space-y-8">
        {/* Page Header */}
        <div className="rounded-3xl bg-white p-8 shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800">
                <span>🌦️ Real-Time Weather Engine</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Farm Weather & Advisory</h1>
              <p className="mt-2 text-slate-600">
                Live meteorology powered by Open-Meteo. Search any farm location or village for current conditions and a 7-day agricultural forecast.
              </p>
            </div>
            <Link
              to="/farmer-dashboard"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
            >
              &larr; Back to Dashboard
            </Link>
          </div>

          {/* Search Controls */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchCity(cityInput);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Enter city or village name (e.g. Pune, Jaipur, Ludhiana)..."
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3.5 pl-11 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {loading ? 'Searching...' : 'Get Weather'}
              </button>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition"
              >
                <span>📍 My GPS Location</span>
              </button>
            </form>

            {/* Quick City Presets */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Popular regions:</span>
              {PRESET_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCityInput(c);
                    handleSearchCity(c);
                  }}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    activeLocation?.name?.toLowerCase().includes(c.toLowerCase())
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Fetching live weather & forecast from Open-Meteo...</p>
          </div>
        )}

        {/* Live Weather Content */}
        {!loading && weatherData && current && currentInfo && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Current Conditions Card */}
            <div className="space-y-6">
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentInfo.bg} p-8 text-white shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
                      📍 {activeLocation?.name} {activeLocation?.country ? `, ${activeLocation.country}` : ''}
                    </span>
                    <h2 className="mt-3 text-5xl font-extrabold tracking-tight">
                      {Math.round(current.temperature)}°C
                    </h2>
                    <p className="mt-2 text-xl font-medium text-white/90">
                      {currentInfo.label}
                    </p>
                  </div>
                  <div className="text-7xl drop-shadow-md">{currentInfo.icon}</div>
                </div>

                {/* Weather Data Badges */}
                <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-white/15 p-4 backdrop-blur-md sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/80">Wind Speed</p>
                    <p className="mt-1 text-lg font-bold">{current.windspeed} km/h</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/80">Wind Direction</p>
                    <p className="mt-1 text-lg font-bold">{current.winddirection}°</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/80">Time of Day</p>
                    <p className="mt-1 text-lg font-bold">{current.is_day ? '☀️ Day' : '🌙 Night'}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Farming Tip Card */}
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow">
                    🌾
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Agricultural Field Tip</h3>
                </div>
                <p className="mt-3 text-slate-700 leading-relaxed">{currentInfo.tip}</p>
                {current.temperature > 35 && (
                  <p className="mt-2 text-xs font-semibold text-rose-700">
                    🔥 High Temperature Warning: Ensure crop roots are adequately hydrated to prevent heat stress.
                  </p>
                )}
              </div>
            </div>

            {/* 7-Day Forecast Column */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">7-Day Forecast</h2>
                  <span className="text-xs text-slate-500">Open-Meteo Daily</span>
                </div>

                <div className="mt-6 space-y-3">
                  {daily?.time?.map((dateStr, index) => {
                    const code = daily.weathercode[index];
                    const info = getWeatherInfo(code);
                    const maxTemp = Math.round(daily.temperature_2m_max[index]);
                    const minTemp = Math.round(daily.temperature_2m_min[index]);
                    const precip = daily.precipitation_sum ? daily.precipitation_sum[index] : 0;

                    return (
                      <div
                        key={dateStr}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 shadow-sm hover:bg-slate-100/80 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl">{info.icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{getDayName(dateStr)}</p>
                            <p className="text-xs text-slate-500 truncate">{info.label}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900">{maxTemp}°</span>
                          <span className="ml-1 text-xs text-slate-500">/ {minTemp}°C</span>
                          {precip > 0 && (
                            <p className="text-[10px] font-semibold text-cyan-600">💧 {precip} mm</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-100 p-3 text-center text-xs text-slate-500">
                Geocoding & Forecast APIs provided by <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline font-semibold">Open-Meteo</a>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

