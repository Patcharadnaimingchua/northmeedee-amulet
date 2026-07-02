import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  FiGrid,
  FiBox,
  FiTag,
  FiShoppingBag,
  FiArrowLeft,
} from 'react-icons/fi';

const menus = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: FiGrid,
    end: true,
  },
  {
    to: '/admin/products',
    label: 'สินค้า',
    icon: FiBox,
  },
  {
    to: '/admin/categories',
    label: 'หมวดหมู่',
    icon: FiTag,
  },
  {
    to: '/admin/orders',
    label: 'คำสั่งซื้อ',
    icon: FiShoppingBag,
  },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">

      <aside className="w-64 shrink-0 border-r border-brand-200 bg-white p-5 dark:border-brand-700 dark:bg-brand-900">

        <Link
          to="/"
          className="mb-8 flex items-center gap-2 text-xl font-bold text-brand-600 dark:text-brand-200"
        >
          <FiArrowLeft />
          NorthAmulet Admin
        </Link>

        <nav className="space-y-2">

          {menus.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'hover:bg-brand-100 dark:hover:bg-brand-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

        </nav>

      </aside>

      <main className="flex-1 bg-brand-50 p-6 dark:bg-brand-900">
        <Outlet />
      </main>

    </div>
  );
}
