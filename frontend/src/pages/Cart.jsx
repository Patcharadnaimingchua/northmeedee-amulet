import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

import { useCart } from '../context/CartContext';

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function Cart() {
  const {
    items,
    total,
    updateItem,
    removeItem,
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">

        <p className="text-brand-500">
          ตะกร้าสินค้าของคุณว่างเปล่า
        </p>

        <Link
          to="/products"
          className="btn-primary mt-6 inline-flex"
        >
          เลือกซื้อสินค้า
        </Link>

      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">

      <div>

        <h1 className="mb-5 text-2xl font-bold">
          ตะกร้าสินค้า
        </h1>

        <div className="space-y-4">

          {items.map((item) => {

            const image =
              item.product.images?.[0];

            return (
              <div
                key={item.id}
                className="card flex items-center gap-4 p-4"
              >

                <div className="h-20 w-20 overflow-hidden rounded-lg bg-brand-100">

                  {image && (
                    <img
                      src={image.url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  )}

                </div>

                <div className="flex-1">

                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-semibold hover:text-brand-500"
                  >
                    {item.product.name}
                  </Link>

                  <p className="mt-1 text-sm text-brand-500">
                    {formatPrice(item.product.price)}
                  </p>

                </div>

                <input
                  type="number"
                  min="1"
                  max={item.product.stock}
                  className="input w-20"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      Number(e.target.value)
                    )
                  }
                />

                <button
                  onClick={() =>
                    removeItem(item.id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={18} />
                </button>

              </div>
            );
          })}

        </div>

      </div>

      <div className="card h-fit p-5">

        <h2 className="mb-4 text-lg font-bold">
          สรุปคำสั่งซื้อ
        </h2>

        <div className="flex justify-between">

          <span>ยอดรวมสินค้า</span>

          <span>
            {formatPrice(total)}
          </span>

        </div>

        <div className="mt-5 flex justify-between border-t border-brand-200 pt-5 font-bold dark:border-brand-700">

          <span>ยอดรวมทั้งหมด</span>

          <span className="text-brand-600">
            {formatPrice(total)}
          </span>

        </div>

        <button
          className="btn-primary mt-6 w-full"
          onClick={() =>
            navigate('/checkout')
          }
        >
          ดำเนินการชำระเงิน
        </button>

      </div>

    </div>
  );
}
