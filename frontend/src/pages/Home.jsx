import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { productApi } from '../api/product.api';
import { categoryApi } from '../api/category.api';

import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import banner from '../assets/banner.jpeg';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        productApi.getAll({
          limit: 8,
          sort: 'newest',
        }),
        categoryApi.getAll(),
      ]);

      setProducts(productRes.data.data);
      setCategories(categoryRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">

      <section className="overflow-hidden rounded-3xl shadow-xl">

        <Link to="/products">

          <img

            src={banner}

            alt="North MeeDee Amulet"

            className="w-full h-[370px] object-cover transition duration-500 hover:scale-105"

          />

        </Link>

      </section>

      <section>

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            หมวดหมู่สินค้า
          </h2>

        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">

          {categories.map((category) => (

            <Link
              key={category.id}
              to={`/products?categoryId=${category.id}`}
              className="
group
rounded-2xl
border
border-amber-200
bg-white
px-6
py-5
flex
items-center
justify-between
transition-all
duration-300
hover:border-amber-500
hover:shadow-md

"
            >

              <h3 className="font-semibold">
                {category.name}
              </h3>

            </Link>

          ))}

        </div>

      </section>

      <section>

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            สินค้ามาใหม่
          </h2>

          <Link
            to="/products"
            className="text-brand-500 hover:underline"
          >
            ดูทั้งหมด
          </Link>

        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        )}

      </section>

    </div>
  );
}
