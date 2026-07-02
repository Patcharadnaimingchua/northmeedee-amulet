export default function Pagination({
  page,
  totalPages,
  onChange,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="mt-8 flex justify-center gap-2">

      <button
        className="btn-outline"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ก่อนหน้า
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={
            p === page
              ? 'btn-primary'
              : 'btn-outline'
          }
        >
          {p}
        </button>
      ))}

      <button
        className="btn-outline"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        ถัดไป
      </button>

    </div>
  );
}
