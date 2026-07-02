import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { categoryApi } from '../../api/category.api';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } =
        await categoryApi.getAll();

      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {

      if (editId) {

        await categoryApi.update(
          editId,
          form
        );

        toast.success('แก้ไขหมวดหมู่สำเร็จ');

      } else {

        await categoryApi.create(form);

        toast.success('เพิ่มหมวดหมู่สำเร็จ');

      }

      setEditId(null);

      setForm({
        name: '',
        description: '',
      });

      loadCategories();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'เกิดข้อผิดพลาด'
      );
    }
  };

  const editCategory = (category) => {
    console.log('EDIT CLICK');
    console.log(category);

    setEditId(category.id);

    setForm({
      name: category.name,
      description: category.description || '',
    });
  };

  const deleteCategory = async (id) => {

    if (!window.confirm('ยืนยันการลบ ?')) {
      return;
    }

    try {

      await categoryApi.remove(id);

      toast.success('ลบสำเร็จ');

      loadCategories();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        'ไม่สามารถลบได้'
      );

    }
  };

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        จัดการหมวดหมู่
      </h1>

      <form
        onSubmit={submit}
        className="card flex flex-wrap items-end gap-4 p-5"
      >

        <div className="flex-1">

          <label className="label">
            ชื่อหมวดหมู่
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

        <div className="flex-1">

          <label className="label">
            คำอธิบาย
          </label>

          <input
            className="input"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />

        </div>

        <button className="btn-primary">
          {editId
            ? 'บันทึก'
            : 'เพิ่มหมวดหมู่'}
        </button>

      </form>

      <div className="card overflow-x-auto p-5">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-2 text-left">
                ชื่อ
              </th>

              <th className="py-2 text-center">
                จำนวนสินค้า
              </th>

              <th className="py-2 text-right">
                จัดการ
              </th>

            </tr>

          </thead>

          <tbody>

            {categories.map((category) => (

              <tr
                key={category.id}
                className="border-b"
              >

                <td className="py-3">
                  {category.name}
                </td>

                <td className="text-center">
                  {category._count?.products || 0}
                </td>

                <td className="text-right space-x-3">

                  <button
                    type="button"
                    onClick={() => {
                      console.log('CLICK BUTTON');
                      editCategory(category);
                    }}
                    className="mr-3 text-brand-500"
                  >
                    <FiEdit2 />
                  </button>

                  <button

                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
