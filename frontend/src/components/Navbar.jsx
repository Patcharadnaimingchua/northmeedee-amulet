import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiLogOut,
  FiGrid,
  FiPackage,
} from 'react-icons/fi';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();

  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      navigate('/products');
      return;
    }

    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-brand-200 bg-white shadow-sm">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* ================= Logo ================= */}

        <Link
          to="/"
          className="flex items-center gap-2 text-3xl font-extrabold text-brand-600 transition hover:scale-105"
        >
          <span className="text-4xl"></span>

          <span>NorthAmulet</span>
        </Link>

        {/* ================= Search ================= */}

        <form
          onSubmit={handleSearch}
          className="mx-10 hidden flex-1 lg:flex"
        >
          <div className="relative w-full">

            <input
              className="w-full rounded-full border border-brand-200 bg-gray-50 py-3 pl-5 pr-14 outline-none transition focus:border-brand-500 focus:bg-white"
              placeholder="ค้นหาพระเครื่อง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="submit"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600"
            >
              <FiSearch size={18} />
            </button>

          </div>
        </form>

        {/* ================= Menu ================= */}

        <nav className="flex items-center gap-6 text-sm font-semibold">

          <Link
            to="/products"
            className="transition hover:text-brand-500"
          >
            สินค้าทั้งหมด
          </Link>

          {user && (
            <>
              {/* Wishlist */}

              <Link
                to="/wishlist"
                className="rounded-full p-2 transition hover:bg-brand-100 hover:text-brand-500"
                title="Wishlist"
              >
                <FiHeart size={22} />
              </Link>

              {/* Orders */}

              <Link
                to="/orders"
                className="flex items-center gap-2 transition hover:text-brand-500"
              >
                <FiPackage size={20} />

                <span className="hidden xl:block">
                  ประวัติคำสั่งซื้อ
                </span>
              </Link>

              {/* Cart */}

              <Link
                to="/cart"
                className="relative rounded-full p-2 transition hover:bg-brand-100 hover:text-brand-500"
                title="ตะกร้าสินค้า"
              >
                <FiShoppingCart size={22} />

                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Admin */}

          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-full p-2 transition hover:bg-brand-100 hover:text-brand-500"
              title="Admin"
            >
              <FiGrid size={22} />
            </Link>
          )}

          {/* Login */}

          {!user ? (
            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="rounded-full border border-brand-400 px-5 py-2 font-semibold text-brand-500 transition hover:bg-brand-50"
              >
                เข้าสู่ระบบ
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-brand-500 px-5 py-2 font-semibold text-white transition hover:bg-brand-600"
              >
                สมัครสมาชิก
              </Link>

            </div>
          ) : (
            <div className="flex items-center gap-3">

              {/* Profile */}

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-brand-200 px-4 py-2 transition hover:border-brand-500 hover:bg-brand-50"
              >
                <FiUser size={18} />

                <span className="font-semibold">
                  {user.name}
                </span>
              </Link>

              {/* Logout */}

              <button
                onClick={logout}
                className="rounded-full p-2 transition hover:bg-red-100 hover:text-red-600"
                title="ออกจากระบบ"
              >
                <FiLogOut size={22} />
              </button>

            </div>
          )}

        </nav>

      </div>

    </header>
  );
}