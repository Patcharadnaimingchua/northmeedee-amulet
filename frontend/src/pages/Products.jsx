import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { productApi } from '../api/product.api';
import { categoryApi } from '../api/category.api';

import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

export default function Products() {

  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);

  const filters = React.useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const page = Number(filters.page || 1);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const { data } =
        await categoryApi.getAll();

      setCategories(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      const { data } =
        await productApi.getAll({
          ...filters,
          page,
        });

      setProducts(data.data);

      if (data.meta) {
        setMeta(data.meta);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (next) => {
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(
        ([, value]) =>
          value !== '' &&
          value !== undefined
      )
    );

    setSearchParams({
      ...cleaned,
      page: 1,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">

      <ProductFilters
        categories={categories}
        filters={filters}
        onChange={updateFilters}
      />

      <div>

        <h1 className="mb-6 text-2xl font-bold">

          {filters.search
            ? `ผลการค้นหา "${filters.search}"`
            : 'สินค้าทั้งหมด'}

        </h1>

        {loading ? (

          <Loading />

        ) : products.length === 0 ? (

          <p className="py-10 text-center text-brand-500">
            ไม่พบสินค้า
          </p>

        ) : (

          <>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onChange={(newPage) =>
                setSearchParams({
                  ...filters,
                  page: String(newPage),
                })
              }
            />

          </>

        )}

      </div>

    </div>
  );
}
