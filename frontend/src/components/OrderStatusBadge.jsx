const statusMap = {
  PENDING: {
    label: 'รอดำเนินการ',
    color: 'bg-gray-100 text-gray-700',
  },
  WAITING_PAYMENT: {
    label: 'รอชำระเงิน',
    color: 'bg-yellow-100 text-yellow-700',
  },
  PAID: {
    label: 'ชำระเงินแล้ว',
    color: 'bg-blue-100 text-blue-700',
  },
  PACKING: {
    label: 'กำลังแพ็ค',
    color: 'bg-indigo-100 text-indigo-700',
  },
  SHIPPING: {
    label: 'กำลังจัดส่ง',
    color: 'bg-purple-100 text-purple-700',
  },
  COMPLETED: {
    label: 'สำเร็จ',
    color: 'bg-green-100 text-green-700',
  },
  CANCELLED: {
    label: 'ยกเลิก',
    color: 'bg-red-100 text-red-700',
  },
};

export default function OrderStatusBadge({
  status,
}) {
  const item =
    statusMap[status] ||
    statusMap.PENDING;

  return (
    <span
      className={`badge ${item.color}`}
    >
      {item.label}
    </span>
  );
}
