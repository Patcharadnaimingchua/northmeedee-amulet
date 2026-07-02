import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { productApi } from '../../api/product.api';
import { categoryApi } from '../../api/category.api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  material: '',
  temple: '',
  province: '',
  era: '',
  categoryId: '',
  isActive: true,
};

const formatPrice = (price) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] = useState(null);

  const [images, setImages] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data } = await productApi.getAll({
        search,
        limit: 100,
      });

      setProducts(data.data);

    } catch (err) {
      console.error(err);

      toast.error('โหลดสินค้าไม่สำเร็จ');

    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } =
        await categoryApi.getAll();

      setCategories(data.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);

    setImages([]);

    setForm(emptyForm);

    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);

    setImages([]);

    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      material: product.material || '',
      temple: product.temple || '',
      province: product.province || '',
      era: product.era || '',
      categoryId: product.categoryId,
      isActive: product.isActive,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setEditing(null);

    setShowModal(false);

    setImages([]);

    setForm(emptyForm);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((file) => {
        formData.append('images', file);
      });

      if (editing) {
        await productApi.update(
          editing.id,
          formData
        );

        toast.success('แก้ไขสินค้าสำเร็จ');

      } else {
        await productApi.create(formData);

        toast.success('เพิ่มสินค้าสำเร็จ');
      }

      await loadProducts();
      closeModal();

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        'บันทึกข้อมูลไม่สำเร็จ'
      );
    }
  };

  const deleteProduct = async (id) => {
    if (
      !window.confirm(
        'ยืนยันการลบสินค้านี้ ?'
      )
    ) {
      return;
    }

    try {
      await productApi.remove(id);

      toast.success(
        'ลบสินค้าสำเร็จ'
      );

      await loadProducts();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'ลบสินค้าไม่สำเร็จ'
      );
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            จัดการสินค้า
          </h1>

          <p className="text-brand-500">
            ทั้งหมด {products.length} รายการ
          </p>

        </div>

        <button
          onClick={openCreate}
          className="btn-primary"
        >
          + เพิ่มสินค้า
        </button>

      </div>

      <div className="card p-4">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">

        {loading ? (

          <div className="py-20 text-center">
            กำลังโหลดข้อมูล...
          </div>

        ) : products.length === 0 ? (

          <div className="py-20 text-center">
            ไม่พบสินค้า
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-brand-50">

                <tr>

                  <th className="px-4 py-3">
                    รูป
                  </th>

                  <th className="px-4 py-3">
                    ชื่อสินค้า
                  </th>

                  <th className="px-4 py-3">
                    หมวดหมู่
                  </th>

                  <th className="px-4 py-3">
                    ราคา
                  </th>

                  <th className="px-4 py-3">
                    Stock
                  </th>

                  <th className="px-4 py-3">
                    สถานะ
                  </th>

                  <th className="px-4 py-3 text-center">
                    จัดการ
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map((product) => (

                  <tr
                    key={product.id}
                    className="border-t"
                  >

                    <td className="px-4 py-3">

                      {product.images?.length ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-16 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100 text-xs">
                          No Image
                        </div>
                      )}

                    </td>

                    <td className="px-4 py-3 font-medium">

                      {product.name}

                    </td>

                    <td className="px-4 py-3">

                      {product.category?.name}

                    </td>

                    <td className="px-4 py-3">

                      {formatPrice(
                        product.price
                      )}

                    </td>

                    <td className="px-4 py-3">

                      {product.stock}

                    </td>

                    <td className="px-4 py-3">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {product.isActive
                          ? 'พร้อมขาย'
                          : 'ปิดขาย'}
                      </span>

                    </td>

                    <td className="px-4 py-3">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            openEdit(product)
                          }
                          className="btn-outline"
                        >
                          แก้ไข
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(
                              product.id
                            )
                          }
                          className="btn-danger"
                        >
                          ลบ
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold">

                {editing
                  ? 'แก้ไขสินค้า'
                  : 'เพิ่มสินค้าใหม่'}

              </h2>

              <button
                onClick={closeModal}
                className="text-2xl"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={saveProduct}
              className="space-y-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="label">
                    ชื่อสินค้า
                  </label>

                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div>

                  <label className="label">
                    หมวดหมู่
                  </label>

                  <select
                    className="input"
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoryId:
                          e.target.value,
                      })
                    }
                    required
                  >

                    <option value="">
                      เลือกหมวดหมู่
                    </option>

                    {categories.map((c) => (

                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.name}
                      </option>

                    ))}

                  </select>

                </div>

                <div>

                  <label className="label">
                    ราคา
                  </label>

                  <input
                    type="number"
                    className="input"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price:
                          e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div>

                  <label className="label">
                    Stock
                  </label>

                  <input
                    type="number"
                    className="input"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock:
                          e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div>

                  <label className="label">
                    วัด
                  </label>

                  <input
                    className="input"
                    value={form.temple}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        temple:
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
                    ยุค
                  </label>

                  <input
                    className="input"
                    value={form.era}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        era:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div>

                  <label className="label">
                    วัสดุ
                  </label>

                  <input
                    className="input"
                    value={form.material}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        material:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              <div>

                <label className="label">
                  รายละเอียดสินค้า
                </label>

                <textarea
                  rows={6}
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
              <div>

                <label className="label">
                  รูปสินค้า
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setImages(
                      Array.from(
                        e.target.files
                      )
                    )
                  }
                />

              </div>

              {editing &&
                editing.images?.length > 0 && (

                  <div>

                    <label className="label">
                      รูปปัจจุบัน
                    </label>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                      {editing.images.map(
                        (image) => (

                          <div
                            key={image.id}
                            className="relative"
                          >

                            <img
                              src={image.url}
                              alt=""
                              className="h-28 w-full rounded-lg border object-cover"
                            />

                            <button
                              type="button"
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    'ลบรูปนี้ ?'
                                  )
                                ) {
                                  return;
                                }

                                try {
                                  await productApi.removeImage(image.id);

                                  toast.success('ลบรูปสำเร็จ');

                                  const { data } = await productApi.getOne(

                                    editing.id

                                  );

                                  setEditing(data.data);

                                  await loadProducts();

                                } catch (err) {
                                  toast.error(
                                    'ลบรูปไม่สำเร็จ'
                                  );
                                }
                              }}
                              className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white"
                            >
                              ลบ
                            </button>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

              {images.length > 0 && (

                <div>

                  <label className="label">
                    Preview
                  </label>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                    {images.map((file) => (

                      <img
                        key={file.name}
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="h-28 w-full rounded-lg border object-cover"
                      />

                    ))}

                  </div>

                </div>

              )}

              <div className="flex items-center gap-3">

                <input
                  id="active"
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isActive:
                        e.target.checked,
                    })
                  }
                />

                <label htmlFor="active">
                  เปิดขายสินค้า
                </label>

              </div>

              <div className="flex justify-end gap-3 border-t pt-6">

                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-outline"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? 'กำลังบันทึก...'
                    : editing
                      ? 'บันทึกการแก้ไข'
                      : 'เพิ่มสินค้า'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
      
    </div>
  );

}