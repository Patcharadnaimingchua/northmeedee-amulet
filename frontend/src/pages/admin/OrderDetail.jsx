import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { orderApi } from '../../api/order.api';
import { paymentApi } from '../../api/payment.api';

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

const STATUS = [
  'WAITING_PAYMENT',
  'PAID',
  'PACKING',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED',
];

const STATUS_LABEL = {
  WAITING_PAYMENT: 'รอชำระเงิน',
  PAID: 'ชำระแล้ว',
  PACKING: 'กำลังแพ็ค',
  SHIPPING: 'กำลังจัดส่ง',
  COMPLETED: 'สำเร็จ',
  CANCELLED: 'ยกเลิก',
};

export default function AdminOrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('');

  const loadOrder = async () => {
    try {
      const { data } = await orderApi.getOne(id);

      setOrder(data.data);

      setStatus(data.data.status);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'โหลดข้อมูลไม่สำเร็จ'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const updateStatus = async () => {
    try {
      await orderApi.updateStatus(
        id,
        status
      );

      toast.success(
        'อัปเดตสถานะสำเร็จ'
      );

      loadOrder();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'เกิดข้อผิดพลาด'
      );
    }
  };

  const approvePayment = async () => {
    try {
      await paymentApi.review(
        order.payment.id,
        {
          status: 'APPROVED',
        }
      );

      toast.success(
        'อนุมัติการชำระเงินแล้ว'
      );

      loadOrder();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'ไม่สามารถอนุมัติได้'
      );
    }
  };

  const rejectPayment = async () => {
    try {
      await paymentApi.review(
        order.payment.id,
        {
          status: 'REJECTED',
        }
      );

      toast.success(
        'ปฏิเสธการชำระเงินแล้ว'
      );

      loadOrder();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'ไม่สามารถปฏิเสธได้'
      );
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        กำลังโหลด...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        ไม่พบคำสั่งซื้อ
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            {order.orderNumber}

          </h1>

          <p className="mt-1 text-brand-500">

            วันที่

            {' '}

            {new Date(
              order.createdAt
            ).toLocaleString('th-TH')}

          </p>

        </div>

        <div className="text-right">

          <p className="text-brand-500">
            ยอดรวม
          </p>

          <p className="text-2xl font-bold text-brand-600">

            {formatPrice(order.total)}

          </p>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        {/* ลูกค้า */}
        <div className="card p-5">

          <h2 className="mb-4 text-lg font-bold">
            ข้อมูลลูกค้า
          </h2>

          <div className="space-y-3 text-sm">

            <div>

              <p className="text-brand-500">
                ชื่อ
              </p>

              <p className="font-medium">
                {order.user?.name}
              </p>

            </div>

            <div>

              <p className="text-brand-500">
                อีเมล
              </p>

              <p>
                {order.user?.email}
              </p>

            </div>

          </div>

        </div>

        {/* ที่อยู่ */}
        <div className="card p-5">

          <h2 className="mb-4 text-lg font-bold">
            ที่อยู่จัดส่ง
          </h2>

          <div className="space-y-2 text-sm">

            <p className="font-medium">

              {order.address?.fullName}

            </p>

            <p>

              {order.address?.phone}

            </p>

            <p>

              {order.address?.line1}

            </p>

            <p>

              {order.address?.subDistrict}

              {' '}

              {order.address?.district}

            </p>

            <p>

              {order.address?.province}

              {' '}

              {order.address?.postalCode}

            </p>

          </div>

        </div>

      </div>

      {/* รายการสินค้า */}

      <div className="card p-5">

        <h2 className="mb-5 text-lg font-bold">
          รายการสินค้า
        </h2>

        <div className="space-y-4">

          {order.items?.map((item) => (

            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >

              <div className="flex items-center gap-4">

                {item.product?.images?.[0] && (

                  <img
                    src={
                      item.product.images[0].url
                    }
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                )}

                <div>

                  <h3 className="font-semibold">

                    {item.name}

                  </h3>

                  <p className="text-sm text-brand-500">

                    จำนวน

                    {' '}

                    {item.quantity}

                  </p>

                  <p className="text-sm text-brand-500">

                    {formatPrice(
                      item.price
                    )}

                    {' '}

                    / ชิ้น

                  </p>

                </div>

              </div>

              <strong className="text-lg">

                {formatPrice(
                  item.price *
                    item.quantity
                )}

              </strong>

            </div>

          ))}

        </div>

        <div className="mt-6 border-t pt-4">

          <div className="flex justify-between">

            <span>

              ค่าสินค้า

            </span>

            <strong>

              {formatPrice(
                order.subtotal
              )}

            </strong>

          </div>

          <div className="mt-2 flex justify-between">

            <span>

              ค่าจัดส่ง

            </span>

            <strong>

              {formatPrice(
                order.shippingFee
              )}

            </strong>

          </div>

          <div className="mt-3 flex justify-between text-xl font-bold">

            <span>

              รวมทั้งหมด

            </span>

            <span className="text-brand-600">

              {formatPrice(
                order.total
              )}

            </span>

          </div>

        </div>

      </div>
            {/* การชำระเงิน */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="card p-5">

          <h2 className="mb-5 text-lg font-bold">
            การชำระเงิน
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">

              <span>วิธีชำระเงิน</span>

              <strong>

                {order.payment?.method}

              </strong>

            </div>

            <div className="flex justify-between">

              <span>สถานะ</span>

              <strong>

                {order.payment?.status}

              </strong>

            </div>

            <div className="flex justify-between">

              <span>จำนวนเงิน</span>

              <strong>

                {formatPrice(
                  order.payment?.amount
                )}

              </strong>

            </div>

          </div>

          {order.payment?.slipUrl && (

            <div className="mt-6">

              <p className="mb-3 font-semibold">

                สลิปการโอน

              </p>

              <a
                href={order.payment.slipUrl}
                target="_blank"
                rel="noreferrer"
              >

                <img
                  src={order.payment.slipUrl}
                  alt="Slip"
                  className="max-h-[500px] rounded-lg border hover:opacity-90"
                />

              </a>

            </div>

          )}

          {order.payment?.status ===
            'SUBMITTED' && (

            <div className="mt-6 flex gap-3">

              <button
                onClick={approvePayment}
                className="btn-primary"
              >
                อนุมัติ
              </button>

              <button
                onClick={rejectPayment}
                className="btn-danger"
              >
                ปฏิเสธ
              </button>

            </div>

          )}

        </div>

        {/* เปลี่ยนสถานะ */}

        <div className="card p-5">

          <h2 className="mb-5 text-lg font-bold">

            จัดการคำสั่งซื้อ

          </h2>

          <label className="label">

            สถานะคำสั่งซื้อ

          </label>

          <select
            className="input"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
          >

            {STATUS.map((s) => (

              <option
                key={s}
                value={s}
              >
                {STATUS_LABEL[s]}
              </option>

            ))}

          </select>

          <button
            onClick={updateStatus}
            className="btn-primary mt-5 w-full"
          >
            บันทึกสถานะ
          </button>

        </div>

      </div>
            {/* Timeline */}

      <div className="card p-5">

        <h2 className="mb-5 text-lg font-bold">
          Timeline
        </h2>

        <div className="space-y-4">

          {STATUS.map((item) => {

            const active =
              STATUS.indexOf(item) <=
              STATUS.indexOf(order.status);

            return (

              <div
                key={item}
                className="flex items-center gap-4"
              >

                <div
                  className={`h-4 w-4 rounded-full ${
                    active
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />

                <span
                  className={
                    active
                      ? 'font-semibold'
                      : 'text-gray-400'
                  }
                >
                  {STATUS_LABEL[item]}
                </span>

              </div>

            );

          })}

        </div>

      </div>

      {/* ข้อมูลเพิ่มเติม */}

      <div className="card p-5">

        <h2 className="mb-5 text-lg font-bold">
          ข้อมูลคำสั่งซื้อ
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <p className="text-sm text-brand-500">
              Order ID
            </p>

            <p className="font-medium break-all">
              {order.id}
            </p>

          </div>

          <div>

            <p className="text-sm text-brand-500">
              Order Number
            </p>

            <p className="font-medium">
              {order.orderNumber}
            </p>

          </div>

          <div>

            <p className="text-sm text-brand-500">
              วันที่สร้าง
            </p>

            <p>
              {new Date(
                order.createdAt
              ).toLocaleString('th-TH')}
            </p>

          </div>

          <div>

            <p className="text-sm text-brand-500">
              สถานะล่าสุด
            </p>

            <p className="font-semibold text-brand-600">
              {STATUS_LABEL[order.status]}
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}