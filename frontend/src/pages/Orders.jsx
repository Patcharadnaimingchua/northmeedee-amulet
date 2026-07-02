import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { orderApi } from '../api/order.api';

import OrderStatusBadge from '../components/OrderStatusBadge';
import Loading from '../components/Loading';

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await orderApi.getMyOrders();
      setOrders(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>

      <h1 className="mb-6 text-2xl font-bold">
        คำสั่งซื้อของฉัน
      </h1>

      {orders.length === 0 ? (

        <p className="text-brand-500">
          คุณยังไม่มีคำสั่งซื้อ
        </p>

      ) : (

        <div className="space-y-4">

          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="card flex items-center justify-between gap-4 p-4 transition hover:border-brand-500"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    order.items?.[0]?.product?.images?.[0]?.url ||
                    '/no-image.png'
                  }
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover border"
                />

                <div>
                  <p className="font-semibold">
                    #{order.orderNumber}
                  </p>

                  <p className="text-sm text-brand-500">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </p>

                  <p className="text-sm text-brand-500">
                    {order.items?.length || 0} รายการ
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  {formatPrice(order.total)}
                </p>

                <div className="mt-2">
                  <OrderStatusBadge
                    status={order.status}
                  />
                </div>

                <p className="mt-2 text-sm text-brand-600">
                  ดูรายละเอียด →
                </p>
              </div>
            </Link>
          ))}

        </div>

      )}

    </div>
  );
}
