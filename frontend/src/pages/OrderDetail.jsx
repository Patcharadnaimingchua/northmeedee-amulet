import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { orderApi } from '../api/order.api';
import { paymentApi } from '../api/payment.api';

import OrderStatusBadge from '../components/OrderStatusBadge';
import Loading from '../components/Loading';

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadOrder = async () => {
    try {
      const { data } = await orderApi.getOne(id);
      setOrder(data.data);
    } catch (err) {
      console.error(err);
      toast.error('ไม่สามารถโหลดคำสั่งซื้อได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const uploadSlip = async () => {
    if (!file) {
      toast.error('กรุณาเลือกไฟล์');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('slip', file);

      await paymentApi.uploadSlip(id, formData);

      toast.success('อัปโหลดสลิปสำเร็จ');

      loadOrder();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'อัปโหลดไม่สำเร็จ'
      );
    } finally {
      setUploading(false);
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm('ยืนยันการยกเลิกคำสั่งซื้อ ?')) {
      return;
    }

    try {
      await orderApi.cancel(id);

      toast.success('ยกเลิกคำสั่งซื้อแล้ว');

      loadOrder();

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

  if (!order) {
    return (
      <div className="py-20 text-center">
        ไม่พบคำสั่งซื้อ
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

      <div className="space-y-6">

        <div className="card p-5">

          <div className="flex items-center justify-between">

            <h1 className="text-2xl font-bold">
              #{order.orderNumber}
            </h1>

            <OrderStatusBadge status={order.status} />

          </div>

          <div className="mt-5 space-y-3">

            {order.items?.map((item) => (

              <div
                key={item.id}
                className="flex justify-between border-b pb-3"
              >

                <div>

                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-sm text-brand-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>

                </div>

                <strong>
                  {formatPrice(item.price * item.quantity)}
                </strong>

              </div>

            ))}

          </div>

        </div>

        {order.status === 'WAITING_PAYMENT' && (

          <div className="card p-5">

            <h2 className="mb-4 text-lg font-bold">
              อัปโหลดสลิป
            </h2>

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            <button
              className="btn-primary mt-4"
              disabled={uploading}
              onClick={uploadSlip}
            >
              {uploading
                ? 'กำลังอัปโหลด...'
                : 'อัปโหลดสลิป'}
            </button>

          </div>

        )}

        {(order.status === 'PENDING' ||
          order.status === 'WAITING_PAYMENT') && (

          <button
            onClick={cancelOrder}
            className="btn-danger"
          >
            ยกเลิกคำสั่งซื้อ
          </button>

        )}

      </div>

      <aside className="card h-fit p-5">

        <h2 className="mb-4 font-bold">
          สรุปยอด
        </h2>

        <div className="flex justify-between">

          <span>รวมทั้งหมด</span>

          <strong className="text-brand-600">
            {formatPrice(order.total)}
          </strong>

        </div>

      </aside>

    </div>
  );
}
