import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { productApi } from '../api/product.api';
import { reviewApi } from '../api/review.api';
import { wishlistApi } from '../api/wishlist.api';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import Loading from '../components/Loading';
import StarRating from '../components/StarRating';

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function ProductDetail() {
  const { id } = useParams();

  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await productApi.getOne(id);

      setProduct(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <Loading />;

  if (!product) {
    return (
      <p className="text-center py-20">
        ไม่พบสินค้า
      </p>
    );
  }

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await reviewApi.create({
        productId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      toast.success('ส่งรีวิวสำเร็จ');

      setReviewForm({
        rating: 5,
        comment: '',
      });

      load();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'เกิดข้อผิดพลาด'
      );
    }
  };

  const handleWishlist = async () => {
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
    <div className="space-y-10">

      <div className="grid gap-8 md:grid-cols-2">

        <div>

          <div className="aspect-square overflow-hidden rounded-xl bg-brand-100">

            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                ไม่มีรูปภาพ
              </div>
            )}

          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto">

            {product.images?.map((img, index) => (
              <button
                key={img.id}
                onClick={() =>
                  setActiveImage(index)
                }
                className={`h-16 w-16 overflow-hidden rounded border-2 ${activeImage === index
                    ? 'border-brand-500'
                    : 'border-gray-200'
                  }`}
              >
                <img
                  src={img.url}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}

          </div>

        </div>

        <div>

          <p className="text-brand-500">
            {product.category?.name}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">

            <StarRating
              value={product.avgRating || 0}
              readOnly
            />

            <span className="text-sm text-brand-500">
              {product.reviews?.length || 0} รีวิว
            </span>

          </div>

          <p className="mt-5 text-3xl font-bold text-brand-600">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 whitespace-pre-line">
            {product.description}
          </p>

          {/* จำนวน */}
          <div className="mt-8">

            <p className="mb-2 font-medium text-gray-700">
              จำนวน
            </p>

            <div className="flex w-32 items-center overflow-hidden rounded-xl border">

              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-11 w-11 items-center justify-center text-xl hover:bg-gray-100"
              >
                −
              </button>

              <div className="flex-1 text-center font-semibold">
                {qty}
              </div>

              <button
                onClick={() =>
                  setQty(
                    Math.min(product.stock, qty + 1)
                  )
                }
                className="flex h-11 w-11 items-center justify-center text-xl hover:bg-gray-100"
              >
                +
              </button>

            </div>

          </div>

          {/* กล่องรับประกัน */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 space-y-3">

            <div>🛡️ รับประกันพระแท้ 100%</div>

            <div>🚚 จัดส่งฟรีทั่วประเทศ</div>

            <div>🔄 คืนเงินหากตรวจสอบไม่แท้</div>

            <div>📜 มีใบรับรอง (เฉพาะรายการที่มี)</div>

          </div>

          {/* ปุ่ม */}
          <div className="mt-6 space-y-3">

            <button
              className="btn-primary w-full h-12 rounded-xl"
              onClick={() => addItem(product.id, qty)}
              disabled={product.stock <= 0}
            >
              🛒 เพิ่มลงตะกร้า
            </button>

            <button
              className="w-full rounded-xl border border-brand-500 py-3 text-brand-500 hover:bg-brand-50"
              onClick={handleWishlist}
            >
              🤍 รายการโปรด
            </button>

          </div>

        </div>

      </div>

      <section>

        <h2 className="mb-5 text-2xl font-bold">
          รีวิว
        </h2>

        {user && (

          <form
            onSubmit={submitReview}
            className="card mb-6 p-4 space-y-3"
          >

            <StarRating
              value={reviewForm.rating}
              onChange={(rating) =>
                setReviewForm({
                  ...reviewForm,
                  rating,
                })
              }
            />

            <textarea
              className="input"
              rows="4"
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value,
                })
              }
            />

            <button className="btn-primary">
              ส่งรีวิว
            </button>

          </form>

        )}

        <div className="space-y-4">

          {product.reviews?.map((review) => (

            <div
              key={review.id}
              className="card p-4"
            >

              <div className="flex justify-between">

                <strong>
                  {review.user?.name}
                </strong>

                <StarRating
                  value={review.rating}
                  readOnly
                  size={14}
                />

              </div>

              <p className="mt-2">
                {review.comment}
              </p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}
