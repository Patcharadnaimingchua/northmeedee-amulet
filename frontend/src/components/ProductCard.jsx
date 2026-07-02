import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { wishlistApi } from '../api/wishlist.api';
import toast from 'react-hot-toast';

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const primaryImage =
    product.images?.find((i) => i.isPrimary) ||
    product.images?.[0];

  const handleWishlist = async (e) => {
    e.preventDefault();

    try {
      await wishlistApi.add(product.id);

      toast.success('เพิ่มในรายการโปรดแล้ว');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'เกิดข้อผิดพลาด'
      );
    }
  };

  return (
    <div className="card group relative overflow-hidden">

      <Link to={`/products/${product.id}`}>

        <div className="aspect-square w-full overflow-hidden bg-brand-100">

          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-400">
              ไม่มีรูปภาพ
            </div>
          )}

        </div>

      </Link>

      <button
        onClick={handleWishlist}
        className="absolute right-3 top-3 rounded-full bg-white p-2 shadow hover:text-red-500"
      >
        <FiHeart />
      </button>

      <div className="p-4">

        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold hover:text-brand-500">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 text-sm text-gray-500">
          {product.category?.name}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <span className="font-bold text-brand-600">
            {formatPrice(product.price)}
          </span>

          <button
            className="btn-primary text-xs"
            onClick={(e) => {
              e.preventDefault();
              addItem(product.id);
            }}
          >
            ใส่ตะกร้า
          </button>

        </div>

      </div>

    </div>
  );
}
