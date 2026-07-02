import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { orderApi } from '../../api/order.api';

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

const STATUS = [
  {
    value: '',
    label: 'ทั้งหมด',
  },
  {
    value: 'WAITING_PAYMENT',
    label: 'รอชำระเงิน',
  },
  {
    value: 'PAID',
    label: 'ชำระแล้ว',
  },
  {
    value: 'PACKING',
    label: 'กำลังแพ็ค',
  },
  {
    value: 'SHIPPING',
    label: 'กำลังจัดส่ง',
  },
  {
    value: 'COMPLETED',
    label: 'สำเร็จ',
  },
  {
    value: 'CANCELLED',
    label: 'ยกเลิก',
  },
];

const badgeColor = {
  WAITING_PAYMENT:
    'bg-yellow-100 text-yellow-700',

  PAID:
    'bg-green-100 text-green-700',

  PACKING:
    'bg-blue-100 text-blue-700',

  SHIPPING:
    'bg-purple-100 text-purple-700',

  COMPLETED:
    'bg-emerald-100 text-emerald-700',

  CANCELLED:
    'bg-red-100 text-red-700',
};

const statusLabel = {
  WAITING_PAYMENT:
    'รอชำระเงิน',

  PAID:
    'ชำระแล้ว',

  PACKING:
    'กำลังแพ็ค',

  SHIPPING:
    'กำลังจัดส่ง',

  COMPLETED:
    'สำเร็จ',

  CANCELLED:
    'ยกเลิก',
};

export default function Orders() {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      totalPages: 1,
      total: 0,
    });

  const loadOrders = async () => {
    setLoading(true);

    try {
      const { data } =
        await orderApi.getAll({
          page,
          limit: 10,
          status,
        });

      setOrders(data.data);

      if (data.meta) {
        setPagination(data.meta);
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'โหลดคำสั่งซื้อไม่สำเร็จ'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, status]);

  const totalRevenue =
    useMemo(() => {
      return orders.reduce(
        (sum, order) =>
          sum + Number(order.total),
        0
      );
    }, [orders]);

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            จัดการคำสั่งซื้อ
          </h1>

          <p className="mt-1 text-sm text-brand-500">

            ทั้งหมด

            {' '}

            {pagination.total}

            {' '}

            รายการ

          </p>

        </div>

        <button
          onClick={loadOrders}
          className="btn-outline"
        >
          รีเฟรช
        </button>

      </div>

      <div className="card p-4">

        <div className="flex flex-wrap items-center gap-3">

          <label className="text-sm font-medium">

            สถานะ

          </label>

          <select
            className="input w-60"
            value={status}
            onChange={(e) => {
              setStatus(
                e.target.value
              );
              setPage(1);
            }}
          >

            {STATUS.map((s) => (

              <option
                key={s.value}
                value={s.value}
              >
                {s.label}
              </option>

            ))}

          </select>

          <div className="ml-auto">

            <span className="text-sm text-brand-500">

              ยอดขายในหน้านี้

            </span>

            <p className="text-xl font-bold text-brand-600">

              {formatPrice(
                totalRevenue
              )}

            </p>

          </div>

        </div>

      </div>
            <div className="card overflow-hidden">

        {loading ? (

          <div className="py-20 text-center">
            กำลังโหลดข้อมูล...
          </div>

        ) : orders.length === 0 ? (

          <div className="py-20 text-center text-brand-500">
            ไม่พบคำสั่งซื้อ
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-brand-50 text-left dark:bg-brand-900">

                <tr>

                  <th className="px-4 py-3">
                    เลขออเดอร์
                  </th>

                  <th className="px-4 py-3">
                    ลูกค้า
                  </th>

                  <th className="px-4 py-3">
                    วันที่
                  </th>

                  <th className="px-4 py-3 text-right">
                    ยอดเงิน
                  </th>

                  <th className="px-4 py-3 text-center">
                    สถานะ
                  </th>

                  <th className="px-4 py-3 text-center">
                    จัดการ
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-t border-brand-200 hover:bg-brand-50 dark:border-brand-800 dark:hover:bg-brand-900/30"
                  >

                    <td className="px-4 py-4 font-semibold">

                      {order.orderNumber}

                    </td>

                    <td className="px-4 py-4">

                      <div>

                        <p className="font-medium">

                          {order.user?.name}

                        </p>

                        <p className="text-xs text-brand-500">

                          {order.user?.email}

                        </p>

                      </div>

                    </td>

                    <td className="px-4 py-4">

                      {new Date(
                        order.createdAt
                      ).toLocaleString('th-TH')}

                    </td>

                    <td className="px-4 py-4 text-right font-semibold">

                      {formatPrice(order.total)}

                    </td>

                    <td className="px-4 py-4 text-center">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          badgeColor[
                            order.status
                          ] ||
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusLabel[
                          order.status
                        ] || order.status}
                      </span>

                    </td>

                    <td className="px-4 py-4 text-center">

                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="btn-outline text-sm"
                      >
                        ดูรายละเอียด
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

        <div className="text-sm text-brand-500">

          หน้า

          {' '}

          {pagination.page}

          {' '}

          /

          {' '}

          {pagination.totalPages}

        </div>

        <div className="flex gap-2">

          <button
            className="btn-outline"
            disabled={page <= 1}
            onClick={() =>
              setPage((p) =>
                Math.max(1, p - 1)
              )
            }
          >
            ◀ ก่อนหน้า
          </button>

          <button
            className="btn-outline"
            disabled={
              page >=
              pagination.totalPages
            }
            onClick={() =>
              setPage((p) =>
                Math.min(
                  pagination.totalPages,
                  p + 1
                )
              )
            }
          >
            ถัดไป ▶
          </button>

        </div>

      </div>

    </div>

  );

}