# 数据模型定义（TypeScript 类型）

> 供前台项目直接复制使用的 TypeScript 类型定义。

## 用户相关

```typescript
interface User {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

interface RegisterRequest {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
```

## 商品相关

```typescript
interface Product {
  id: number;
  slug: string;
  name: string;
  animal: string;
  tagline: string;
  concept: string;
  description: string;
  priceRange: PriceRange;
  specifications: Specifications;
  materials: string[];
  materialOptions: MaterialOption[];
  images: ProductImages;
  faq: FAQItem[];
  relatedProducts: RelatedProduct[];
  relatedInteriors: RelatedInterior[];
  interiorContext: string;
  metaDescription: string;
  hiddenInRegions: string[];
  trendingGeo: TrendingGeo;
  mobileShortKey: string;
  mobileFeatures: MobileFeature[];
  mobileStory: MobileStory;
  mobileCrafts: MobileCraft[];
  mobileScenes: MobileScene[];
  status: 'active' | 'inactive' | 'draft';
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface PriceRange {
  americas: number;
  europe: number;
  asia: number;
  oceania: number;
}

interface Specifications {
  dimensions: {
    width: number;
    depth: number;
    height: number;
    seatHeight: number;
  };
  weight: string;
  materials: string;
  frame: string;
  cushion: string;
  [key: string]: unknown;
}

interface MaterialOption {
  name: string;
  hex: string;
  description?: string;
}

interface ProductImages {
  hero: string;
  gallery: string[];
  detail?: string[];
  [key: string]: string | string[] | undefined;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface RelatedProduct {
  slug: string;
  name: string;
  heroImage: string;
}

interface RelatedInterior {
  name: string;
  heroImage: string;
}

interface TrendingGeo {
  [region: string]: number;
}

interface MobileFeature {
  title: string;
  description: string;
  icon: string;
}

interface MobileStory {
  title: string;
  paragraphs: string[];
}

interface MobileCraft {
  title: string;
  description: string;
  image: string;
}

interface MobileScene {
  title: string;
  description: string;
  image: string;
}

interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

interface ProductDetailResponse {
  product: Product;
}
```

## 购物车相关

```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  itemCount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;
  cartId: string;
  productSlug: string;
  productName: string | null;
  material: string | null;
  colorName: string | null;
  colorHex: string | null;
  quantity: number;
  unitPrice: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AddCartItemRequest {
  productSlug: string;
  material?: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

interface CartResponse {
  cart: Cart;
}
```

## 订单相关

```typescript
interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  total: number;
  currency: string;
  // 收货信息
  firstName: string | null;
  lastName: string | null;
  recipientName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  addressLine: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  // 物流
  carrier: string | null;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  latestShippingEvent: string | null;
  // 商品
  items: OrderItem[];
  // 物流事件
  shippingEvents?: ShippingEvent[];
  // 时间
  createdAt: string;
  updatedAt: string;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
type PaymentStatus = 'pending_payment' | 'paid' | 'refunded' | 'failed';

interface OrderItem {
  id: string;
  orderId: string;
  productSlug: string;
  productName: string | null;
  colorName: string | null;
  colorHex: string | null;
  quantity: number;
  unitPrice: number | null;
  subtotal: number | null;
  imageUrl: string | null;
  createdAt: string;
}

interface ShippingEvent {
  id: string;
  orderId: string;
  status: string;
  description: string | null;
  happenedAt: string;
  createdAt: string;
}

interface CreateOrderRequest {
  paymentMethod: string;
  shippingMethod?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    addressLine: string;
    addressLine2?: string;
    city: string;
    state?: string;
    zipCode: string;
  };
}

interface OrdersResponse {
  orders: Order[];
}
```

## 地址相关

```typescript
interface Address {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  country: string | null;
  addressLine: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateAddressRequest {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  addressLine: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode: string;
  isDefault?: boolean;
}

interface AddressesResponse {
  addresses: Address[];
}
```

## 收藏相关

```typescript
interface Favorite {
  id: string;
  userId: string;
  productSlug: string;
  createdAt: string;
}

interface AddFavoriteRequest {
  productSlug: string;
}

interface FavoritesResponse {
  favorites: Favorite[];
}
```

## 通用响应类型

```typescript
interface ApiError {
  error: string;
}

// 所有接口可能的 HTTP 状态码
// 200 - 成功
// 400 - 请求参数错误
// 401 - 未认证（缺少或无效的 x-session）
// 404 - 资源不存在
// 409 - 冲突（如重复邮箱、重复收藏）
// 500 - 服务器内部错误
```
