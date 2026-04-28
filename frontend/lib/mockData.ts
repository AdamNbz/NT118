import { ProductDTO } from './productApi';

export interface ProductReviewItemResponse {
  id: number;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  helpfulVotes: number;
  createdAt: string;
  reviewerId: number;
  reviewerName: string;
}

export interface ShopDTO {
  id: number;
  ownerId: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  isVerified: boolean;
  createdAt: string;
}

export const MOCK_PRODUCTS: ProductDTO[] = [
  {
    id: 1,
    name: 'Nike Air Max 270 React',
    slug: 'nike-air-max-270-react',
    description: 'The Nike Air Max 270 React uses lightweight, layered, no-sew materials to create a modern style that looks as good as it feels.',
    price: 2450000,
    originalPrice: 3500000,
    discount: 30,
    rating: 4.5,
    totalReviews: 128,
    soldQuantity: 450,
    stockQuantity: 50,
    brand: 'Nike',
    categoryId: 1,
    shopId: 101,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    thumbnails: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'
    ],
    variants: [
      { id: 10, name: 'Màu sắc', value: 'Đỏ Trắng', priceModifier: 0, stockQuantity: 20 },
      { id: 11, name: 'Màu sắc', value: 'Đen Xám', priceModifier: 50000, stockQuantity: 15 },
      { id: 12, name: 'Màu sắc', value: 'Xanh Neon', priceModifier: 100000, stockQuantity: 10 },
      { id: 20, name: 'Kích cỡ', value: '40', priceModifier: 0, stockQuantity: 50 },
      { id: 21, name: 'Kích cỡ', value: '41', priceModifier: 0, stockQuantity: 50 },
      { id: 22, name: 'Kích cỡ', value: '42', priceModifier: 0, stockQuantity: 50 },
      { id: 23, name: 'Kích cỡ', value: '43', priceModifier: 0, stockQuantity: 20 },
    ]
  },
  {
    id: 2,
    name: 'Apple iPad Air (5th Generation)',
    slug: 'apple-ipad-air-m1',
    description: 'iPad Air with M1 chip. 10.9-inch Liquid Retina display. 12MP Wide camera. 12MP Ultra Wide front camera with Center Stage.',
    price: 15490000,
    originalPrice: 16990000,
    discount: 8,
    rating: 4.9,
    totalReviews: 856,
    soldQuantity: 1200,
    stockQuantity: 15,
    brand: 'Apple',
    categoryId: 2,
    shopId: 102,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    thumbnails: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800'
    ]
  },
  {
    id: 3,
    name: 'Sony WH-1000XM4 Noise Cancelling',
    slug: 'sony-wh-1000xm4',
    description: 'Sony’s intelligent industry-leading noise canceling headphones with premium sound elevate your listening experience.',
    price: 6490000,
    originalPrice: 8450000,
    discount: 23,
    rating: 4.8,
    totalReviews: 2405,
    soldQuantity: 5600,
    stockQuantity: 30,
    brand: 'Sony',
    categoryId: 2,
    shopId: 103,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    thumbnails: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    ]
  },
  {
    id: 4,
    name: 'Mechanical Keyboard RGB Custom',
    slug: 'mechanical-keyboard-rgb',
    description: 'Premium mechanical keyboard with hot-swappable switches and customizable RGB lighting.',
    price: 1850000,
    originalPrice: 2200000,
    discount: 15,
    rating: 4.6,
    totalReviews: 45,
    soldQuantity: 120,
    stockQuantity: 10,
    brand: 'Keychron',
    categoryId: 2,
    shopId: 101,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
    thumbnails: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800'
    ]
  },
  {
    id: 5,
    name: "Women's Casual Summer Dress",
    slug: 'womens-summer-dress',
    description: 'Lightweight and breathable summer dress, perfect for beach outings or casual walks.',
    price: 450000,
    originalPrice: 650000,
    discount: 30,
    rating: 4.3,
    totalReviews: 320,
    soldQuantity: 890,
    stockQuantity: 100,
    brand: 'OEM',
    categoryId: 3,
    shopId: 104,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
    thumbnails: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800'
    ]
  },
  {
    id: 6,
    name: 'Samsung Galaxy S23 Ultra',
    slug: 'samsung-s23-ultra',
    description: 'The ultimate Android smartphone with 200MP camera and built-in S Pen.',
    price: 23990000,
    originalPrice: 26990000,
    discount: 11,
    rating: 4.9,
    totalReviews: 156,
    soldQuantity: 340,
    stockQuantity: 5,
    brand: 'Samsung',
    categoryId: 2,
    shopId: 105,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800',
    thumbnails: [
      'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800'
    ]
  }
];

export const MOCK_REVIEWS: ProductReviewItemResponse[] = [
  {
    id: 1,
    rating: 5,
    comment: 'Sản phẩm tuyệt vời, đóng gói cẩn thận. Rất hài lòng!',
    isVerified: true,
    helpfulVotes: 12,
    createdAt: '2026-04-15T08:30:00Z',
    reviewerId: 201,
    reviewerName: 'Nguyễn Văn A'
  },
  {
    id: 2,
    rating: 4,
    comment: 'Giày đi êm chân, màu sắc đẹp như hình. Tuy nhiên giao hàng hơi chậm một chút.',
    isVerified: true,
    helpfulVotes: 5,
    createdAt: '2026-04-16T10:15:00Z',
    reviewerId: 202,
    reviewerName: 'Trần Thị B'
  },
  {
    id: 3,
    rating: 5,
    comment: 'Chất lượng quá tốt so với tầm giá. Sẽ tiếp tục ủng hộ shop.',
    isVerified: true,
    helpfulVotes: 8,
    createdAt: '2026-04-18T14:45:00Z',
    reviewerId: 203,
    reviewerName: 'Lê Văn C'
  },
  {
    id: 4,
    rating: 3,
    comment: 'Hơi rộng một chút nhưng vẫn ổn. Shop phục vụ nhiệt tình.',
    isVerified: false,
    helpfulVotes: 2,
    createdAt: '2026-04-20T09:00:00Z',
    reviewerId: 204,
    reviewerName: 'Phạm Thị D'
  }
];

export const MOCK_SHOPS: ShopDTO[] = [
  {
    id: 1,
    ownerId: 101,
    name: 'GearVN Official',
    slug: 'gearvn-official',
    description: 'Chuyên cung cấp linh kiện máy tính, laptop, gaming gear chính hãng.',
    logoUrl: null,
    coverImageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000',
    address: '78-80 Hoàng Hoa Thám, Phường 12, Quận Tân Bình, TP.HCM',
    phone: '1800 6975',
    email: 'cskh@gearvn.com',
    rating: 4.8,
    totalReviews: 2540,
    totalProducts: 450,
    isVerified: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 2,
    ownerId: 102,
    name: 'Nike Vietnam',
    slug: 'nike-vietnam',
    description: 'Cửa hàng phân phối chính hãng các sản phẩm Nike tại Việt Nam.',
    logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000',
    address: 'Vincom Center Đồng Khởi, Quận 1, TP.HCM',
    phone: '028 3822 0000',
    email: 'contact@nike.vn',
    rating: 4.9,
    totalReviews: 12500,
    totalProducts: 800,
    isVerified: true,
    createdAt: '2019-05-15T00:00:00Z'
  }
];
