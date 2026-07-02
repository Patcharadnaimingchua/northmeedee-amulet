import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import toast from 'react-hot-toast';

import { cartApi } from '../api/cart.api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setTotal(0);
      return;
    }

    try {
      const { data } = await cartApi.get();

      setItems(data.data.items || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบ');
      return;
    }

    await cartApi.addItem(productId, quantity);

    toast.success('เพิ่มลงตะกร้าแล้ว');

    await refresh();
  };

  const updateItem = async (itemId, quantity) => {
    await cartApi.updateItem(itemId, quantity);

    await refresh();
  };

  const removeItem = async (itemId) => {
    await cartApi.removeItem(itemId);

    toast.success('ลบสินค้าแล้ว');

    await refresh();
  };

  const clear = async () => {
    await cartApi.clear();

    await refresh();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count: items.length,
        refresh,
        addItem,
        updateItem,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
