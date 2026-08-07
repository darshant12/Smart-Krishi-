import { NavLink } from 'react-router-dom';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';
import { useEquipment } from '../context/EquipmentContext';

const farmerLinks = [
  { label: 'Dashboard', to: '/farmer-dashboard' },
  { label: 'My Equipment', to: '/farmer-equipment' },
  { label: 'Add Equipment', to: '/farmer-add-equipment' },
  { label: 'Search Equipment', to: '/farmer-search-equipment' },
  { label: 'My Bookings', to: '/farmer-bookings' },
  { label: 'Owner Requests', to: '/farmer-owner-bookings' },
  { label: 'Marketplace', to: '/farmer-marketplace' },
  { label: 'Weather', to: '/weather' },
];

const adminLinks = [
  { label: 'Dashboard', to: '/admin-dashboard' },
  { label: 'Users', to: '/admin-users' },
  { label: 'Equipment', to: '/admin-equipment' },
  { label: 'Bookings', to: '/admin-bookings' },
  { label: 'Reports', to: '/admin-reports' },
];

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const { ownerBookingRequests } = useEquipment();
  const links = user?.role === 'admin' ? adminLinks : farmerLinks;

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-onyx-200/80 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-onyx-900">Dashboard Menu</h2>
            <p className="mt-1.5 text-xs text-onyx-600">Navigate quickly between your farm management sections.</p>
          </div>
          <nav className="space-y-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-hunter-700 font-bold text-white shadow-md'
                      : 'text-onyx-800 hover:bg-hunter-50 hover:text-hunter-800'
                  }`
                }
              >
                <span>{link.label}</span>
                {link.to === '/farmer-owner-bookings' && ownerBookingRequests.length > 0 && (
                  <span className="rounded-full bg-chocolate-600 px-2 py-0.5 text-xs font-extrabold text-white shadow">
                    {ownerBookingRequests.length}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </Layout>
  );
}

