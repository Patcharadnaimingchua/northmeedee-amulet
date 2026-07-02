import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import { addressApi } from '../api/address.api';
import { orderApi } from '../api/order.api';

const SHIPPING_FEE = 50;

const formatPrice = (price) =>
    new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        maximumFractionDigits: 0,
    }).format(Number(price));

const emptyAddress = {
    fullName: '',
    phone: '',
    line1: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
    isDefault: false,
};

export default function Checkout() {
    const navigate = useNavigate();

    const {
        items,
        total,
        clear,
    } = useCart();

    const [loading, setLoading] =
        useState(false);

    const [addresses, setAddresses] =
        useState([]);

    const [addressId, setAddressId] =
        useState('');

    const [showForm, setShowForm] =
        useState(false);

    const [paymentMethod, setPaymentMethod] =
        useState('PROMPTPAY');

    const [form, setForm] =
        useState(emptyAddress);

    const loadAddresses = async () => {
        try {
            const { data } =
                await addressApi.getAll();

            setAddresses(data.data);

            const defaultAddress =
                data.data.find(
                    (a) => a.isDefault
                ) || data.data[0];

            if (defaultAddress) {
                setAddressId(defaultAddress.id);
            } else {
                setShowForm(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const saveAddress = async (e) => {
        e.preventDefault();

        try {
            const { data } =
                await addressApi.create(form);

            toast.success(
                'เพิ่มที่อยู่สำเร็จ'
            );

            setForm(emptyAddress);

            setShowForm(false);

            await loadAddresses();

            setAddressId(
                data.data.id
            );

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'เพิ่มที่อยู่ไม่สำเร็จ'
            );
        }
    };

    const submitOrder = async () => {
        if (!addressId) {
            toast.error(
                'กรุณาเลือกที่อยู่'
            );
            return;
        }

        setLoading(true);

        try {
            const { data } =
                await orderApi.checkout({
                    addressId,
                    paymentMethod,
                });

            await clear();

            toast.success(
                'สร้างคำสั่งซื้อสำเร็จ'
            );

            navigate(
                `/orders/${data.data.id}`
            );

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'เกิดข้อผิดพลาด'
            );
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="py-20 text-center">

                <h1 className="text-2xl font-bold">
                    ไม่มีสินค้าในตะกร้า
                </h1>

                <p className="mt-2 text-brand-500">
                    กรุณาเลือกสินค้าก่อนทำรายการ
                </p>

            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

            {/* LEFT */}

            <div className="space-y-6">

                <section className="card p-5">

                    <div className="flex items-center justify-between">

                        <h2 className="text-xl font-bold">
                            ที่อยู่จัดส่ง
                        </h2>

                        <button
                            className="text-sm text-brand-500 hover:underline"
                            onClick={() =>
                                setShowForm(
                                    !showForm
                                )
                            }
                        >
                            {showForm
                                ? 'ยกเลิก'
                                : '+ เพิ่มที่อยู่'}
                        </button>

                    </div>
                    {showForm ? (

                        <form
                            onSubmit={saveAddress}
                            className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2"
                        >

                            <div>
                                <label className="label">
                                    ชื่อผู้รับ
                                </label>

                                <input
                                    required
                                    className="input"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            fullName: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="label">
                                    เบอร์โทร
                                </label>

                                <input
                                    required
                                    className="input"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="label">
                                    บ้านเลขที่ / ถนน
                                </label>

                                <input
                                    required
                                    className="input"
                                    value={form.line1}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            line1: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="label">
                                    ตำบล
                                </label>

                                <input
                                    className="input"
                                    value={form.subDistrict}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            subDistrict:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="label">
                                    อำเภอ
                                </label>

                                <input
                                    className="input"
                                    value={form.district}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            district:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="label">
                                    จังหวัด
                                </label>

                                <input
                                    required
                                    className="input"
                                    value={form.province}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            province:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="label">
                                    รหัสไปรษณีย์
                                </label>

                                <input
                                    required
                                    className="input"
                                    value={form.postalCode}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            postalCode:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <label className="md:col-span-2 flex items-center gap-2">

                                <input
                                    type="checkbox"
                                    checked={form.isDefault}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            isDefault:
                                                e.target.checked,
                                        })
                                    }
                                />

                                ตั้งเป็นที่อยู่เริ่มต้น

                            </label>

                            <button className="btn-primary md:col-span-2">

                                บันทึกที่อยู่

                            </button>

                        </form>

                    ) : (

                        <div className="mt-5 space-y-3">

                            {addresses.length === 0 && (

                                <div className="rounded-lg border border-dashed p-6 text-center text-brand-500">

                                    ยังไม่มีที่อยู่จัดส่ง

                                </div>

                            )}

                            {addresses.map((address) => (

                                <label
                                    key={address.id}
                                    className={`card flex cursor-pointer gap-3 p-4 ${addressId === address.id
                                        ? 'border-brand-500 ring-2 ring-brand-300'
                                        : ''
                                        }`}
                                >

                                    <input
                                        type="radio"
                                        checked={
                                            addressId ===
                                            address.id
                                        }
                                        onChange={() =>
                                            setAddressId(
                                                address.id
                                            )
                                        }
                                    />

                                    <div className="flex-1">

                                        <div className="flex items-center gap-2">

                                            <p className="font-semibold">

                                                {address.fullName}

                                            </p>

                                            {address.isDefault && (

                                                <span className="rounded bg-brand-100 px-2 py-0.5 text-xs text-brand-600">

                                                    ค่าเริ่มต้น

                                                </span>

                                            )}

                                        </div>

                                        <p className="text-sm text-brand-500">

                                            {address.phone}

                                        </p>

                                        <p className="mt-1 text-sm">

                                            {address.line1}

                                            {' '}

                                            {address.subDistrict}

                                            {' '}

                                            {address.district}

                                            {' '}

                                            {address.province}

                                            {' '}

                                            {address.postalCode}

                                        </p>

                                    </div>

                                </label>

                            ))}

                        </div>

                    )}

                </section>

                <section className="card p-5">

                    <h2 className="mb-5 text-xl font-bold">

                        วิธีชำระเงิน

                    </h2>

                    <div className="space-y-3">

                        <label className="card flex cursor-pointer items-center gap-3 p-4">

                            <input
                                type="radio"
                                checked={
                                    paymentMethod ===
                                    'PROMPTPAY'
                                }
                                onChange={() =>
                                    setPaymentMethod(
                                        'PROMPTPAY'
                                    )
                                }
                            />

                            <div>

                                <p className="font-medium">

                                    PromptPay QR Code

                                </p>

                                <p className="text-sm text-brand-500">

                                    ชำระผ่าน QR พร้อมเพย์

                                </p>

                            </div>

                        </label>

                        <label className="card flex cursor-pointer items-center gap-3 p-4">

                            <input
                                type="radio"
                                checked={
                                    paymentMethod ===
                                    'BANK_TRANSFER'
                                }
                                onChange={() =>
                                    setPaymentMethod(
                                        'BANK_TRANSFER'
                                    )
                                }
                            />

                            <div>

                                <p className="font-medium">

                                    โอนผ่านธนาคาร

                                </p>

                                <p className="text-sm text-brand-500">

                                    แนบสลิปหลังจากสร้างคำสั่งซื้อ

                                </p>

                            </div>

                        </label>

                    </div>

                </section>
                <section className="card p-5">

                    <h2 className="mb-5 text-xl font-bold">
                        รายการสินค้า
                    </h2>

                    <div className="space-y-4">

                        {items.map((item) => {

                            const image =
                                item.product.images?.[0];

                            return (

                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border-b pb-4 last:border-none"
                                >

                                    <div className="h-20 w-20 overflow-hidden rounded-lg bg-brand-100">

                                        {image ? (

                                            <img
                                                src={image.url}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full items-center justify-center text-xs text-brand-400">

                                                ไม่มีรูป

                                            </div>

                                        )}

                                    </div>

                                    <div className="flex-1">

                                        <h3 className="font-semibold">
                                            {item.product.name}
                                        </h3>

                                        <p className="text-sm text-brand-500">

                                            จำนวน {item.quantity} ชิ้น

                                        </p>

                                        <p className="text-sm text-brand-500">

                                            ราคาต่อชิ้น

                                            {' '}

                                            {formatPrice(
                                                item.product.price
                                            )}

                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p className="font-bold">

                                            {formatPrice(
                                                item.product.price *
                                                item.quantity
                                            )}

                                        </p>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </section>

            </div>

            {/* RIGHT */}

            <aside className="card h-fit p-5 sticky top-6">

                <h2 className="mb-5 text-xl font-bold">

                    สรุปคำสั่งซื้อ

                </h2>

                <div className="space-y-3">

                    <div className="flex justify-between">

                        <span>

                            จำนวนสินค้า

                        </span>

                        <strong>

                            {items.reduce(
                                (sum, item) =>
                                    sum + item.quantity,
                                0
                            )}

                            {' '}

                            ชิ้น

                        </strong>

                    </div>

                    <div className="flex justify-between">

                        <span>

                            ราคาสินค้า

                        </span>

                        <strong>

                            {formatPrice(total)}

                        </strong>

                    </div>

                    <div className="flex justify-between">

                        <span>

                            ค่าจัดส่ง

                        </span>

                        <strong>

                            {formatPrice(
                                SHIPPING_FEE
                            )}

                        </strong>

                    </div>

                </div>

                <hr className="my-5" />

                <div className="flex items-center justify-between">

                    <span className="text-lg font-bold">

                        รวมทั้งหมด

                    </span>

                    <span className="text-2xl font-bold text-brand-600">

                        {formatPrice(
                            total +
                            SHIPPING_FEE
                        )}

                    </span>

                </div>

                <button
                    onClick={submitOrder}
                    disabled={loading}
                    className="btn-primary mt-6 w-full"
                >

                    {loading
                        ? 'กำลังสร้างคำสั่งซื้อ...'
                        : 'ยืนยันคำสั่งซื้อ'}

                </button>
                <section className="card p-5 mt-6">
                    <h2 className="mb-4 text-lg font-bold">
                        ช่องทางชำระเงิน
                    </h2>

                    {paymentMethod === 'PROMPTPAY' ? (
                        <div className="text-center">

                            <img

                                src="https://res.cloudinary.com/xbcq4vfj/image/upload/v1782973856/IMG_1862_psd7t9.jpg"

                                alt="PromptPay"

                                className="mx-auto w-56 rounded-lg border"

                            />

                            <p className="mt-4 font-semibold">
                                พร้อมเพย์
                            </p>

                            <p>
                                099-014-3537
                            </p>

                            <p className="mt-2 text-brand-600 font-bold">
                                ยอดที่ต้องโอน
                            </p>

                            <p className="text-2xl font-bold">
                                {formatPrice(total + SHIPPING_FEE)}
                            </p>

                        </div>
                    ) : (
                        <div className="space-y-2">

                            <div className="flex justify-between">
                                <span>ธนาคาร</span>
                                <strong>กสิกรไทย</strong>
                            </div>

                            <div className="flex justify-between">
                                <span>ชื่อบัญชี</span>
                                <strong>บริษัท นอร์ทอมูเลท จำกัด</strong>
                            </div>

                            <div className="flex justify-between">
                                <span>เลขบัญชี</span>
                                <strong>058-3-62603-4-</strong>
                            </div>

                            <div className="border-t pt-3 mt-3 flex justify-between">
                                <span>ยอดที่ต้องโอน</span>
                                <strong className="text-brand-600">
                                    {formatPrice(total + SHIPPING_FEE)}
                                </strong>
                            </div>

                        </div>
                    )}

                    <p className="mt-5 text-sm text-brand-500">
                        หลังจากสร้างคำสั่งซื้อแล้ว
                        กรุณาโอนเงินและอัปโหลดสลิป
                        ในหน้ารายละเอียดคำสั่งซื้อ
                    </p>
                </section>

                <p className="mt-3 text-center text-xs text-brand-500">

                    เมื่อกดยืนยันคำสั่งซื้อ
                    ระบบจะสร้างออเดอร์
                    และนำคุณไปยังหน้ารายละเอียดคำสั่งซื้อ
                    เพื่ออัปโหลดสลิปการชำระเงิน

                </p>

            </aside>

        </div>

    );

}