import { FiStar } from 'react-icons/fi';

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 18,
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={
            star <= value
              ? 'text-yellow-500'
              : 'text-gray-300'
          }
        >
          <FiStar
            size={size}
            fill={
              star <= value
                ? 'currentColor'
                : 'none'
            }
          />
        </button>
      ))}
    </div>
  );
}
