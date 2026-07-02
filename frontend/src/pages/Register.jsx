import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await register(form);

      toast.success(
        'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ'
      );

      navigate('/login');

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'สมัครสมาชิกไม่สำเร็จ'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">

      <div className="card p-6">

        <h1 className="mb-6 text-center text-2xl font-bold">
          สมัครสมาชิก
        </h1>

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <div>

            <label className="label">
              ชื่อ
            </label>

            <input
              required
              className="input"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

          </div>

          <div>

            <label className="label">
              อีเมล
            </label>

            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

          </div>

          <div>

            <label className="label">
              เบอร์โทร
            </label>

            <input
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

          <div>

            <label className="label">
              รหัสผ่าน
            </label>

            <input
              type="password"
              required
              minLength={6}
              className="input"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

          </div>

          <button
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? 'กำลังสมัคร...'
              : 'สมัครสมาชิก'}
          </button>

        </form>

        <p className="mt-4 text-center text-sm">

          มีบัญชีอยู่แล้ว?

          <Link
            to="/login"
            className="ml-1 text-brand-500 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>

        </p>

      </div>

    </div>
  );
}
