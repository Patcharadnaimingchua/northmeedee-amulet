import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

import { wishlistApi } from '../api/wishlist.api';

import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const { data } = await wishlistApi.getAll();
      setItems(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const remove = async (id) => {
    try {
      await wishlistApi.remove(id);
      toast.success('ลบออกจากรายการโปรดแล้ว');
      loadWishlist();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'เกิดข้อผิดพลาด'
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>

      <h1 className="mb-6 text-2xl font-bold">
        รายการโปรด
      </h1>

      {items.length === 0 ? (

        <p className="text-brand-500">
          ยังไม่มีสินค้าในรายการโปรด
        </p>

      ) : (

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

          {items.map((item) => (

            <div
              key={item.id}
              className="relative"
            >

              <button
                onClick={() => remove(item.id)}
                className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow"
              >
                <FiX />
              </button>

              <ProductCard
                product={item.product}
              />

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
