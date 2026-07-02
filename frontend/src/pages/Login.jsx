import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = await login(
        form.email,
        form.password
      );

      toast.success('เข้าสู่ระบบสำเร็จ');

      navigate(
        location.state?.from?.pathname ||
          (user.role === 'ADMIN'
            ? '/admin'
            : '/')
      );

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'เข้าสู่ระบบไม่สำเร็จ'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">

      <div className="card p-6">

        <h1 className="mb-6 text-center text-2xl font-bold">
          เข้าสู่ระบบ
        </h1>

        <form
          onSubmit={submit}
          className="space-y-4"
        >

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
              รหัสผ่าน
            </label>

            <input
              type="password"
              required
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
              ? 'กำลังเข้าสู่ระบบ...'
              : 'เข้าสู่ระบบ'}
          </button>

        </form>

        <p className="mt-4 text-center text-sm">

          ยังไม่มีบัญชี?

          <Link
            to="/register"
            className="ml-1 text-brand-500 hover:underline"
          >
            สมัครสมาชิก
          </Link>

        </p>

      </div>

    </div>
  );
}
