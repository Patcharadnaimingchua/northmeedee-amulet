import { useEffect, useState } from 'react';

import { adminApi } from '../../api/admin.api';

import Loading from '../../components/Loading';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = [
  '#dd8f34',
  '#e9b05c',
  '#f2ce93',
  '#b5711f',
  '#8f5717',
  '#6c4113',
  '#4a2c0e',
];

const statusLabel = {
  PENDING: 'รอดำเนินการ',
  WAITING_PAYMENT: 'รอชำระเงิน',
  PAID: 'ชำระแล้ว',
  PACKING: 'แพ็คสินค้า',
  SHIPPING: 'จัดส่ง',
  COMPLETED: 'สำเร็จ',
  CANCELLED: 'ยกเลิก',
};

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } =
        await adminApi.dashboard();

      setDashboard(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!dashboard) {
    return <Loading />;
  }

  const revenueChart =
    Object.entries(
      dashboard.revenueByDay || {}
    ).map(([date, revenue]) => ({
      date: date.slice(5),
      revenue,
    }));

  const statusChart =
    (dashboard.ordersByStatus || []).map(
      (item) => ({
        name:
          statusLabel[item.status] ||
          item.status,
        value:
          item._count?._all || 0,
      })
    );

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="card p-5">
          <p className="text-sm text-brand-500">
            ผู้ใช้งาน
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.totalUsers}
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-brand-500">
            สินค้า
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.totalProducts}
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-brand-500">
            คำสั่งซื้อ
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.totalOrders}
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-brand-500">
            รายได้
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {formatPrice(
              dashboard.totalRevenue
            )}
          </h2>
        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="card p-5">

          <h2 className="mb-4 text-lg font-bold">
            รายได้ย้อนหลัง
          </h2>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#dd8f34"
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="card p-5">

          <h2 className="mb-4 text-lg font-bold">
            สถานะคำสั่งซื้อ
          </h2>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <PieChart>

              <Pie
                data={statusChart}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >

                {statusChart.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="card p-5">

        <h2 className="mb-4 text-lg font-bold">
          สินค้าใกล้หมด
        </h2>

        {(dashboard.lowStockProducts || [])
          .length === 0 ? (

          <p>ไม่มีสินค้าใกล้หมด</p>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="py-2 text-left">
                  ชื่อสินค้า
                </th>

                <th className="py-2 text-right">
                  คงเหลือ
                </th>

              </tr>

            </thead>

            <tbody>

              {dashboard.lowStockProducts.map(
                (product) => (

                  <tr key={product.id}>

                    <td className="py-2">
                      {product.name}
                    </td>

                    <td className="py-2 text-right text-red-600 font-bold">
                      {product.stock}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}
