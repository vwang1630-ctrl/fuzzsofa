// Order storage utility - stores orders in localStorage

export interface OrderItem {
  name: string;
  color: string;
  fabric: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress?: {
    name: string;
    phone: string;
    country: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    zip: string;
  };
}

const ORDERS_STORAGE_KEY = 'fuzz_orders';

// Get all orders from localStorage
export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    console.log('getOrders: raw data =', data);
    const result = data ? JSON.parse(data) : [];
    console.log('getOrders: parsed result =', result);
    return result;
  } catch (e) {
    console.error('getOrders error:', e);
    return [];
  }
}

// Save order to localStorage
export function saveOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getOrders();
    // Add new order at the beginning
    orders.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save order:', e);
  }
}

// Update order status
export function updateOrderStatus(orderId: string, status: Order['status']): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  } catch (e) {
    console.error('Failed to update order status:', e);
  }
}

// Get order by ID
export function getOrderById(orderId: string): Order | null {
  if (typeof window === 'undefined') return null;
  const orders = getOrders();
  return orders.find(o => o.id === orderId) || null;
}

// Delete order
export function deleteOrder(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getOrders().filter(o => o.id !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to delete order:', e);
  }
}

// Generate order ID
export function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FUZZ-${dateStr}-${random}`;
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
