import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { addressApi } from '../api/address.api';

export default function Profile() {

  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const { data } =
        await addressApi.getAll();

      setAddresses(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <div className="card p-6">

        <h1 className="mb-5 text-2xl font-bold">
          โปรไฟล์
        </h1>

        <div className="space-y-2">

          <p>
            <strong>ชื่อ :</strong> {user?.name}
          </p>

          <p>
            <strong>อีเมล :</strong> {user?.email}
          </p>

          <p>
            <strong>เบอร์โทร :</strong> {user?.phone || '-'}
          </p>

          <p>
            <strong>สิทธิ์ :</strong>{' '}
            {user?.role === 'ADMIN'
              ? 'ผู้ดูแลระบบ'
              : 'สมาชิก'}
          </p>

        </div>

      </div>

      <div className="card p-6">

        <h2 className="mb-4 text-xl font-bold">
          ที่อยู่จัดส่ง
        </h2>

        {addresses.length === 0 ? (

          <p className="text-brand-500">
            ยังไม่มีที่อยู่
          </p>

        ) : (

          <div className="space-y-3">

            {addresses.map((address) => (

              <div
                key={address.id}
                className="rounded-lg border border-brand-200 p-4"
              >

                <p className="font-semibold">
                  {address.fullName}
                </p>

                <p>{address.phone}</p>

                <p className="text-sm text-brand-500">
                  {address.line1} {address.subDistrict}{' '}
                  {address.district} {address.province}{' '}
                  {address.postalCode}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
