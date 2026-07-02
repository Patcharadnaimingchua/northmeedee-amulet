export default function ProductFilters({
  categories,
  filters,
  onChange,
}) {

  const update = (key, value) =>
    onChange({
      ...filters,
      [key]: value,
    });

  return (
    <div className="card p-4 space-y-4">

      <div>

        <label className="label">
          หมวดหมู่
        </label>

        <select
          className="input"
          value={filters.categoryId || ''}
          onChange={(e) =>
            update('categoryId', e.target.value)
          }
        >
          <option value="">
            ทั้งหมด
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
          จังหวัด
        </label>

        <input
          className="input"
          value={filters.province || ''}
          onChange={(e) =>
            update('province', e.target.value)
          }
        />

      </div>

      <div>

        <label className="label">
          ยุค
        </label>

        <input
          className="input"
          value={filters.era || ''}
          onChange={(e) =>
            update('era', e.target.value)
          }
        />

      </div>

    </div>
  );
}
