# GIỚI THIỆU MÔN HỌC

**Tên môn học:** Phát triển ứng dụng trên thiết bị di động  
**Mã môn học:** NT118  
**Mã lớp:** NT118.Q22  
**Năm học:** HK2 (2025 - 2026)  
**Giảng viên:** Ths.Trần Hồng Nghi  

# GIỚI THIỆU ĐỒ ÁN

**Đề tài:** ShopeeLite - ứng dụng sàn TMĐT  
**Mô tả:** Một phiên bản clone của ứng dụng sàn TMĐT nổi tiếng Shopee, với các tính năng cơ bản được tích hợp AI trong xử lý tìm kiếm và Chatbot.

# CHỨC NĂNG CHÍNH

## 👤 Đăng ký/ Đăng nhập
- Đăng ký tài khoản mới
- Đăng nhập bằng email/password hoặc số điện thoại

## 👤 Quản lý tài khoản người dùng
- Thông tin cá nhân (tên, avatar, số điện thoại, email)
- Quản lý địa chỉ giao hàng
- Cập nhật mật khẩu

## 🔍 Tìm kiếm sản phẩm
- Tìm kiếm theo từ khóa
- Lọc theo giá, danh mục, đánh giá
- Sắp xếp theo độ phổ biến, giá

## 📂 Danh mục sản phẩm
- Hiển thị cây danh mục
- Sản phẩm theo danh mục

## 📦 Chi tiết sản phẩm
- Thông tin chi tiết sản phẩm
- Hình ảnh, video sản phẩm
- Biến thể (size, màu sắc)
- Mô tả sản phẩm

## 👁️ Lịch sử xem sản phẩm
- Lưu trữ sản phẩm đã xem
- Đề xuất sản phẩm liên quan

## 🏪 Follow cửa hàng
- Theo dõi cửa hàng yêu thích
- Nhận thông báo từ cửa hàng

## 🛒 Giỏ hàng
- Thêm/xóa/sửa sản phẩm
- Tính tổng tiền
- Áp dụng voucher

## 💳 Thanh toán
- Chọn phương thức thanh toán
- Xác nhận đơn hàng
- Tích hợp VNPay, Momo, etc.

## 📋 Quản lý đơn hàng
- Xem lịch sử đơn hàng
- Theo dõi trạng thái đơn hàng
- Hủy đơn hàng

## 📍 Quản lý địa chỉ giao hàng
- Thêm/sửa/xóa địa chỉ
- Đặt địa chỉ mặc định

## 💬 Tin nhắn (Chat trực tiếp với người bán)
- Chat real-time
- Gửi hình ảnh, file

## 🔔 Thông báo
- Khuyến mãi
- Tin nhắn mới
- Cập nhật đơn hàng

## ⭐ Đánh giá & review sản phẩm
- Viết review sau khi nhận hàng
- Hình ảnh review
- Vote hữu ích

## ❤️ Đánh dấu/ Yêu thích sản phẩm
- Lưu sản phẩm yêu thích
- Danh sách wishlist

## 🏪 Đăng ký cửa hàng
- Đăng ký trở thành người bán
- Xác minh thông tin

## 📊 Quản lý đơn hàng (Seller)
- Xem đơn hàng mới
- Xác nhận/cập nhật trạng thái
- In hóa đơn

## 📦 Quản lý sản phẩm (Seller)
- Thêm/sửa/xóa sản phẩm
- Quản lý tồn kho
- Upload hình ảnh

## 💰 Quản lý doanh thu
- Thống kê doanh thu theo tháng
- Báo cáo bán hàng
- Rút tiền

## 🎫 Lưu trữ và quản lý voucher
- Tạo voucher cho shop
- Phân phối voucher cho khách hàng

## ⚙️ Quản lý hệ thống (Admin)
- Quản lý user/shop
- Duyệt đăng ký seller
- Thống kê toàn hệ thống

# DATABASE SCHEMA (27 BẢNG) - POSTGRESQL VERSION

## 📋 **PostgreSQL Custom Types (ENUMs)**

```sql
-- Custom ENUM types for PostgreSQL
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE shop_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'out_of_stock');
CREATE TYPE category_status AS ENUM ('active', 'inactive');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE voucher_discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'product');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
```

## 1. users - Thông tin tài khoản người dùng

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'buyer',
  status user_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng, kiểu BIGSERIAL (tương đương BIGINT AUTO_INCREMENT trong MySQL)
- `username`: Tên đăng nhập, duy nhất, tối đa 50 ký tự
- `email`: Email đăng ký, duy nhất, tối đa 100 ký tự
- `phone`: Số điện thoại, duy nhất, tối đa 20 ký tự
- `password_hash`: Hash mật khẩu, tối đa 255 ký tự
- `role`: Vai trò user (buyer/seller/admin), sử dụng custom ENUM type
- `status`: Trạng thái tài khoản (active/inactive/banned), sử dụng custom ENUM
- `created_at`: Thời gian tạo, mặc định CURRENT_TIMESTAMP
- `updated_at`: Thời gian cập nhật cuối, tự động update qua trigger

**Quan hệ:** 1-1 với `user_profiles`, 1-N với nhiều bảng khác

## 2. user_profiles - Hồ sơ chi tiết người dùng

```sql
CREATE TABLE user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  full_name VARCHAR(100),
  avatar_url VARCHAR(500),
  date_of_birth DATE,
  gender gender_type,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, NOT NULL, UNIQUE (1-1 relationship)
- `full_name`: Họ tên đầy đủ, tối đa 100 ký tự
- `avatar_url`: URL ảnh đại diện, tối đa 500 ký tự
- `date_of_birth`: Ngày sinh
- `gender`: Giới tính (male/female/other), sử dụng custom ENUM
- `bio`: Tiểu sử cá nhân, TEXT không giới hạn
- `created_at/updated_at`: Timestamps với trigger auto-update

## 3. user_addresses - Địa chỉ giao hàng của user

```sql
CREATE TABLE user_addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  ward VARCHAR(50) NOT NULL,
  street_address TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ensure only one default address per user
CREATE UNIQUE INDEX idx_user_default_address 
ON user_addresses (user_id) 
WHERE is_default = true;
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc
- `recipient_name`: Tên người nhận, bắt buộc
- `recipient_phone`: SĐT người nhận, bắt buộc
- `province/district/ward`: Địa chỉ hành chính, bắt buộc
- `street_address`: Địa chỉ chi tiết, TEXT
- `is_default`: Đánh dấu địa chỉ mặc định, chỉ 1 per user (partial index)
- `created_at`: Thời gian tạo

## 4. categories - Danh mục sản phẩm

```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id BIGINT,
  image_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  status category_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Index for tree structure queries
CREATE INDEX idx_categories_parent_sort ON categories(parent_id, sort_order);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `name`: Tên danh mục, bắt buộc
- `slug`: URL slug duy nhất, bắt buộc
- `description`: Mô tả danh mục, TEXT
- `parent_id`: FK tự tham chiếu cho cây danh mục
- `image_url`: Ảnh đại diện danh mục
- `sort_order`: Thứ tự sắp xếp
- `status`: Trạng thái danh mục (active/inactive)
- `created_at/updated_at`: Timestamps

## 5. shops - Thông tin cửa hàng

```sql
CREATE TABLE shops (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  status shop_status DEFAULT 'active',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_shops_updated_at 
    BEFORE UPDATE ON shops 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Partial index for active shops
CREATE INDEX idx_shops_active_rating ON shops(rating) WHERE status = 'active';
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `owner_id`: FK đến users (chủ shop), bắt buộc
- `name`: Tên cửa hàng, bắt buộc
- `slug`: URL slug duy nhất
- `description`: Mô tả cửa hàng
- `logo_url/cover_image_url`: Ảnh logo và cover
- `address/phone/email`: Thông tin liên hệ
- `rating`: Đánh giá trung bình (0.00-5.00)
- `total_reviews/total_products`: Thống kê
- `status`: Trạng thái cửa hàng
- `is_verified`: Đã xác minh chưa

## 6. products - Thông tin sản phẩm

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  original_price DECIMAL(15,2),
  stock_quantity INTEGER DEFAULT 0,
  sold_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  status product_status DEFAULT 'active',
  weight_grams INTEGER,
  dimensions VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_products_category_status ON products(category_id, status);
CREATE INDEX idx_products_shop_status ON products(shop_id, status);
CREATE INDEX idx_products_price ON products(price) WHERE status = 'active';
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `shop_id`: FK đến shops, bắt buộc
- `category_id`: FK đến categories, bắt buộc
- `name`: Tên sản phẩm, bắt buộc
- `slug`: URL slug duy nhất
- `description`: Mô tả chi tiết sản phẩm
- `price`: Giá bán hiện tại, bắt buộc
- `original_price`: Giá gốc (có thể null)
- `stock_quantity`: Tồn kho
- `sold_quantity`: Đã bán
- `rating`: Đánh giá trung bình
- `total_reviews`: Số lượng review
- `status`: Trạng thái sản phẩm
- `weight_grams`: Trọng lượng (gram)
- `dimensions`: Kích thước (WxHxD)

## 7. product_images - Hình ảnh sản phẩm

```sql
CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_main BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Ensure only one main image per product
CREATE UNIQUE INDEX idx_product_main_image 
ON product_images (product_id) 
WHERE is_main = true;

-- Index for sorting images
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort_order);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `product_id`: FK đến products, bắt buộc, CASCADE DELETE
- `image_url`: URL hình ảnh, bắt buộc
- `alt_text`: Mô tả hình ảnh cho SEO
- `sort_order`: Thứ tự hiển thị
- `is_main`: Đánh dấu hình chính (chỉ 1 hình/product)
- `created_at`: Thời gian tạo

## 8. product_variants - Biến thể sản phẩm

```sql
CREATE TABLE product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(100) NOT NULL,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `product_id`: FK đến products, bắt buộc, CASCADE DELETE
- `name`: Tên biến thể (Size, Color, etc.)
- `value`: Giá trị biến thể (XL, Red, etc.)
- `price_modifier`: Phụ thu (+/- so với giá gốc)
- `stock_quantity`: Tồn kho riêng cho biến thể
- `sku`: Mã SKU duy nhất cho biến thể
- `created_at`: Thời gian tạo

## 9. favorites - Sản phẩm yêu thích

```sql
CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id, created_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc, CASCADE DELETE
- `product_id`: FK đến products, bắt buộc, CASCADE DELETE
- `created_at`: Thời gian thêm vào yêu thích
- `UNIQUE(user_id, product_id)`: Đảm bảo không trùng lặp

## 10. follows - Follow cửa hàng

```sql
CREATE TABLE follows (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  shop_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  UNIQUE(user_id, shop_id)
);

CREATE INDEX idx_follows_user ON follows(user_id, created_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc, CASCADE DELETE
- `shop_id`: FK đến shops, bắt buộc, CASCADE DELETE
- `created_at`: Thời gian follow
- `UNIQUE(user_id, shop_id)`: Đảm bảo không trùng lặp

## 11. view_history - Lịch sử xem sản phẩm

```sql
CREATE TABLE view_history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_view_history_user_viewed ON view_history(user_id, viewed_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc, CASCADE DELETE
- `product_id`: FK đến products, bắt buộc, CASCADE DELETE
- `viewed_at`: Thời gian xem sản phẩm

## 12. cart_items - Giỏ hàng

```sql
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  variant_id BIGINT,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
  CHECK (quantity > 0)
);

CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE UNIQUE INDEX idx_cart_unique_item ON cart_items(user_id, product_id, COALESCE(variant_id, -1));
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc, CASCADE DELETE
- `product_id`: FK đến products, bắt buộc, CASCADE DELETE
- `variant_id`: FK đến product_variants, optional, SET NULL khi xóa
- `quantity`: Số lượng, bắt buộc > 0 (CHECK constraint)
- `added_at`: Thời gian thêm vào giỏ
- `updated_at`: Thời gian cập nhật cuối
- `UNIQUE INDEX`: Đảm bảo không trùng sản phẩm + biến thể trong giỏ

## 13. orders - Đơn hàng

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_id BIGINT NOT NULL,
  shop_id BIGINT NOT NULL,
  shipping_address_id BIGINT NOT NULL,
  voucher_id BIGINT,
  shop_voucher_id BIGINT,
  subtotal DECIMAL(15,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status payment_status DEFAULT 'pending',
  status order_status DEFAULT 'pending',
  notes TEXT,
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id),
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id),
  FOREIGN KEY (shop_voucher_id) REFERENCES shop_vouchers(id)
);

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status, ordered_at DESC);
CREATE INDEX idx_orders_shop_status ON orders(shop_id, status, ordered_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `order_number`: Mã đơn hàng duy nhất, bắt buộc
- `buyer_id`: FK đến users (người mua), bắt buộc, CASCADE DELETE
- `shop_id`: FK đến shops (người bán), bắt buộc, CASCADE DELETE
- `shipping_address_id`: FK đến user_addresses, bắt buộc
- `voucher_id/shop_voucher_id`: FK đến vouchers, optional
- `subtotal`: Tổng tiền hàng, bắt buộc
- `shipping_fee`: Phí ship
- `discount_amount`: Giảm giá từ voucher
- `total_amount`: Tổng thanh toán, bắt buộc
- `payment_method`: Phương thức thanh toán
- `payment_status`: Trạng thái thanh toán
- `status`: Trạng thái đơn hàng
- `notes`: Ghi chú đơn hàng
- `ordered_at`: Thời gian đặt hàng
- `updated_at`: Thời gian cập nhật cuối

## 14. order_items - Chi tiết đơn hàng

```sql
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  variant_id BIGINT,
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(id),
  CHECK (quantity > 0),
  CHECK (unit_price >= 0),
  CHECK (total_price >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `order_id`: FK đến orders, bắt buộc, CASCADE DELETE
- `product_id`: FK đến products, bắt buộc (snapshot data)
- `variant_id`: FK đến product_variants, optional
- `product_name`: Snapshot tên sản phẩm tại thời điểm mua
- `product_image`: Snapshot hình sản phẩm
- `quantity`: Số lượng mua, bắt buộc > 0
- `unit_price`: Giá đơn vị tại thời điểm mua
- `total_price`: Thành tiền = quantity × unit_price
- `CHECK constraints`: Validation cho quantity và price

## 15. payments - Thông tin thanh toán

```sql
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'VND',
  status payment_status DEFAULT 'pending',
  payment_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `order_id`: FK đến orders, bắt buộc, CASCADE DELETE (1-1 relationship)
- `payment_method`: Phương thức thanh toán (VNPay, Momo, etc.)
- `transaction_id`: Mã giao dịch từ cổng thanh toán, duy nhất
- `amount`: Số tiền thanh toán
- `currency`: Đơn vị tiền tệ, mặc định VND
- `status`: Trạng thái thanh toán
- `payment_data`: JSONB lưu dữ liệu bổ sung từ cổng thanh toán
- `created_at/updated_at`: Timestamps

## 16. reviews - Đánh giá sản phẩm

```sql
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  reviewer_id BIGINT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_reviews_product_rating ON reviews(product_id, rating);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id, created_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `order_id`: FK đến orders, bắt buộc (đảm bảo đã mua mới review)
- `product_id`: FK đến products, bắt buộc, CASCADE DELETE
- `reviewer_id`: FK đến users, bắt buộc, CASCADE DELETE
- `rating`: Đánh giá sao (1-5), CHECK constraint
- `comment`: Nội dung review
- `is_verified`: Đánh dấu review đã xác minh (đã mua hàng)
- `helpful_votes`: Số vote hữu ích từ users khác
- `created_at/updated_at`: Timestamps

## 17. messages - Tin nhắn chat

```sql
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id BIGINT NOT NULL,
  receiver_id BIGINT NOT NULL,
  order_id BIGINT,
  message_type message_type DEFAULT 'text',
  content TEXT,
  attachment_url VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Indexes for chat performance
CREATE INDEX idx_messages_sender_sent ON messages(sender_id, sent_at DESC);
CREATE INDEX idx_messages_receiver_sent ON messages(receiver_id, sent_at DESC);
CREATE INDEX idx_messages_conversation ON messages(LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), sent_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `sender_id`: FK đến users (người gửi), bắt buộc, CASCADE DELETE
- `receiver_id`: FK đến users (người nhận), bắt buộc, CASCADE DELETE
- `order_id`: FK đến orders, optional (chat về đơn hàng cụ thể)
- `message_type`: Loại tin nhắn (text/image/file/product)
- `content`: Nội dung tin nhắn
- `attachment_url`: URL file đính kèm
- `is_read`: Đã đọc chưa
- `sent_at`: Thời gian gửi
- `Functional index`: LEAST/GREATEST cho conversation grouping

## 18. notifications - Thông báo hệ thống

```sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc, CASCADE DELETE
- `type`: Loại thông báo (order, message, promotion, etc.)
- `title`: Tiêu đề thông báo, bắt buộc
- `message`: Nội dung chi tiết
- `data`: JSONB lưu dữ liệu bổ sung (order_id, product_id, etc.)
- `is_read`: Đã đọc chưa
- `created_at`: Thời gian tạo

## 19. vouchers - Voucher hệ thống

```sql
CREATE TABLE vouchers (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type voucher_discount_type NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(15,2),
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_vouchers_active_dates ON vouchers(start_date, end_date) WHERE is_active = true;
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `code`: Mã voucher, duy nhất, bắt buộc
- `name`: Tên voucher, bắt buộc
- `description`: Mô tả chi tiết
- `discount_type`: Loại giảm giá (percentage/fixed)
- `discount_value`: Giá trị giảm
- `min_order_value`: Giá trị đơn hàng tối thiểu
- `max_discount`: Giảm giá tối đa (cho percentage)
- `usage_limit`: Giới hạn số lần sử dụng
- `used_count`: Đã sử dụng bao nhiêu lần
- `start_date/end_date`: Thời gian hiệu lực
- `is_active`: Trạng thái active
- `created_by`: FK đến users (admin tạo)

## 20. shop_vouchers - Voucher của shop

```sql
CREATE TABLE shop_vouchers (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type voucher_discount_type NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(15,2),
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

CREATE INDEX idx_shop_vouchers_shop_code ON shop_vouchers(shop_id, code);
CREATE INDEX idx_shop_vouchers_active_dates ON shop_vouchers(start_date, end_date) WHERE is_active = true;
```

**Giải thích từng thuộc tính:**
- Tương tự như `vouchers` nhưng:
- `shop_id`: FK đến shops, bắt buộc, CASCADE DELETE
- Voucher do shop tự tạo và quản lý

## 21. user_vouchers - Voucher user sở hữu

```sql
CREATE TABLE user_vouchers (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  voucher_id BIGINT,
  shop_voucher_id BIGINT,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
  FOREIGN KEY (shop_voucher_id) REFERENCES shop_vouchers(id) ON DELETE CASCADE,
  CHECK (voucher_id IS NOT NULL OR shop_voucher_id IS NOT NULL)
);

CREATE INDEX idx_user_vouchers_user_expires ON user_vouchers(user_id, expires_at, is_used);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc, CASCADE DELETE
- `voucher_id`: FK đến vouchers, optional
- `shop_voucher_id`: FK đến shop_vouchers, optional
- `is_used`: Đã sử dụng chưa
- `used_at`: Thời gian sử dụng
- `expires_at`: Thời gian hết hạn, bắt buộc
- `CHECK constraint`: Đảm bảo có ít nhất 1 voucher reference

## 22. order_tracking - Theo dõi đơn hàng

```sql
CREATE TABLE order_tracking (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE INDEX idx_order_tracking_order_created ON order_tracking(order_id, created_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `order_id`: FK đến orders, bắt buộc, CASCADE DELETE
- `status`: Trạng thái mới (Confirmed, Shipping, Delivered, etc.)
- `description`: Mô tả chi tiết trạng thái
- `location`: Vị trí hiện tại (khi shipping)
- `updated_by`: FK đến users (người cập nhật)
- `created_at`: Thời gian cập nhật trạng thái

## 23. admin_users - Tài khoản admin

```sql
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  role VARCHAR(50) DEFAULT 'moderator',
  permissions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, bắt buộc, UNIQUE (1-1 relationship)
- `role`: Vai trò admin (super_admin, moderator, etc.)
- `permissions`: JSONB lưu quyền hạn chi tiết
- `created_at`: Thời gian cấp quyền admin

## 24. product_search_logs - Log tìm kiếm sản phẩm

```sql
CREATE TABLE product_search_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  search_query VARCHAR(500) NOT NULL,
  filters JSONB,
  result_count INTEGER DEFAULT 0,
  searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_search_logs_query_searched ON product_search_logs(search_query, searched_at DESC);
CREATE INDEX idx_search_logs_searched_at ON product_search_logs(searched_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, optional, SET NULL khi xóa
- `search_query`: Từ khóa tìm kiếm, bắt buộc
- `filters`: JSONB lưu các bộ lọc đã áp dụng
- `result_count`: Số kết quả tìm được
- `searched_at`: Thời gian tìm kiếm

## 25. system_logs - Log hệ thống

```sql
CREATE TABLE system_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id BIGINT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_system_logs_action_resource ON system_logs(action, resource_type, resource_id);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `user_id`: FK đến users, optional, SET NULL khi xóa
- `action`: Hành động thực hiện (create, update, delete, etc.)
- `resource_type`: Loại đối tượng (user, product, order, etc.)
- `resource_id`: ID của đối tượng
- `old_values`: JSONB lưu giá trị cũ (cho update)
- `new_values`: JSONB lưu giá trị mới
- `ip_address`: Địa chỉ IP (kiểu INET)
- `user_agent`: Thông tin browser/client
- `created_at`: Thời gian thực hiện

## 26. message_attachments - File đính kèm tin nhắn

```sql
CREATE TABLE message_attachments (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE INDEX idx_message_attachments_message ON message_attachments(message_id);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `message_id`: FK đến messages, bắt buộc, CASCADE DELETE
- `file_name`: Tên file, bắt buộc
- `file_url`: URL file, bắt buộc
- `file_type`: Loại file (image, document, video, etc.)
- `file_size`: Kích thước file (bytes)
- `created_at`: Thời gian upload

## 27. review_images - Hình ảnh review

```sql
CREATE TABLE review_images (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

CREATE INDEX idx_review_images_review_sort ON review_images(review_id, sort_order);
```

**Giải thích từng thuộc tính:**
- `id`: Khóa chính tự tăng
- `review_id`: FK đến reviews, bắt buộc, CASCADE DELETE
- `image_url`: URL hình ảnh, bắt buộc
- `caption`: Chú thích hình ảnh
- `sort_order`: Thứ tự hiển thị
- `created_at`: Thời gian upload

## 📊 **PostgreSQL-Specific Features Used**

### **Custom ENUM Types:**
- `user_role`, `user_status`, `shop_status`, `product_status`
- `order_status`, `payment_status`, `voucher_discount_type`
- `message_type`, `gender_type`, `category_status`

### **Advanced Data Types:**
- `BIGSERIAL`: Auto-incrementing big integer
- `JSONB`: Binary JSON for better performance and indexing
- `INET`: IP address storage
- `TIMESTAMP`: Full timestamp support

### **Triggers for Auto-Update:**
- `update_updated_at_column()` function
- Triggers on all tables with `updated_at` field

### **Advanced Constraints:**
- `CHECK` constraints for data validation
- `UNIQUE` constraints with expressions
- `EXCLUDE` constraints where needed

### **Performance Indexes:**
- Partial indexes with `WHERE` clauses
- Composite indexes for common query patterns
- Functional indexes (e.g., `LEAST`/`GREATEST` for conversations)

### **Data Integrity:**
- Proper foreign key relationships
- Cascade delete where appropriate
- Set null for optional relationships

This PostgreSQL schema provides better performance, data integrity, and scalability compared to MySQL for a complex e-commerce application like ShopeeLite.

# 🔍 **THUỘC TÍNH YẾU & BẢNG CHI TIẾT**

## **Khái niệm Thuộc tính Yếu (Weak Entities)**

**Thuộc tính yếu** là các thực thể phụ thuộc vào thực thể chính (strong entity) để tồn tại. Chúng không thể tồn tại độc lập và thường có khóa chính composite (kết hợp khóa của thực thể chính).

## **Bảng Chi Tiết (Detail Tables)**

### **1. orders → order_items** 
**Đã implement:** ✅
```sql
-- orders: Thực thể chính (Strong Entity)
-- order_items: Thuộc tính yếu phụ thuộc vào orders

CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,           -- ID độc lập
  order_id BIGINT NOT NULL,                       -- FK đến orders (bắt buộc)
  product_id BIGINT NOT NULL,                     -- Sản phẩm trong đơn
  variant_id BIGINT,                              -- Biến thể (optional)
  product_name VARCHAR(255) NOT NULL,             -- Snapshot tên SP
  product_image VARCHAR(500),                     -- Snapshot hình SP
  quantity INT NOT NULL,                          -- Số lượng mua
  unit_price DECIMAL(15,2) NOT NULL,              -- Giá tại thời điểm mua
  total_price DECIMAL(15,2) NOT NULL,             -- Thành tiền
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);
```
**Lý do cần bảng chi tiết:**
- Giá sản phẩm có thể thay đổi sau khi đặt hàng
- Sản phẩm có thể bị xóa nhưng đơn hàng vẫn tồn tại
- Cần lưu snapshot thông tin tại thời điểm đặt hàng
- Một đơn hàng có nhiều sản phẩm khác nhau

### **2. products → product_images**
**Đã implement:** ✅
```sql
-- products: Thực thể chính
-- product_images: Thuộc tính yếu (1 product có nhiều hình)

CREATE TABLE product_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,                     -- FK bắt buộc
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),                          -- Mô tả hình ảnh
  sort_order INT DEFAULT 0,                       -- Thứ tự hiển thị
  is_main BOOLEAN DEFAULT FALSE,                  -- Hình chính
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```
**Lý do cần bảng chi tiết:**
- Một sản phẩm có thể có nhiều hình ảnh
- Thứ tự hiển thị linh hoạt
- Có thể đánh dấu hình chính
- Dễ quản lý và mở rộng

### **3. products → product_variants**
**Đã implement:** ✅
```sql
-- products: Thực thể chính  
-- product_variants: Thuộc tính yếu (size, màu sắc, etc.)

CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,                     -- FK bắt buộc
  name VARCHAR(100) NOT NULL,                     -- "Size", "Color"
  value VARCHAR(100) NOT NULL,                    -- "XL", "Red"
  price_modifier DECIMAL(10,2) DEFAULT 0,         -- Phụ thu (+/-)
  stock_quantity INT DEFAULT 0,                   -- Tồn kho riêng
  sku VARCHAR(100) UNIQUE,                        -- Mã SKU duy nhất
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```
**Lý do cần bảng chi tiết:**
- Sản phẩm có nhiều biến thể (size, màu, etc.)
- Mỗi biến thể có tồn kho riêng
- Giá có thể khác nhau
- SKU riêng biệt để quản lý

### **4. users → user_addresses**
**Đã implement:** ✅
```sql
-- users: Thực thể chính
-- user_addresses: Thuộc tính yếu (địa chỉ giao hàng)

CREATE TABLE user_addresses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,                        -- FK bắt buộc
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  ward VARCHAR(50) NOT NULL,
  street_address TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,               -- Địa chỉ mặc định
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
**Lý do cần bảng chi tiết:**
- Một user có thể có nhiều địa chỉ giao hàng
- Đánh dấu địa chỉ mặc định
- Lưu thông tin người nhận riêng biệt

### **5. users → user_profiles**
**Đã implement:** ✅
```sql
-- users: Thực thể chính
-- user_profiles: Thuộc tính yếu (thông tin cá nhân mở rộng)

CREATE TABLE user_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,                        -- FK bắt buộc
  full_name VARCHAR(100),
  avatar_url VARCHAR(500),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
**Lý do cần bảng chi tiết:**
- Thông tin cá nhân có thể null (không bắt buộc)
- Tách biệt với thông tin đăng nhập
- Dễ mở rộng thêm fields sau

### **6. shops → shop_vouchers**
**Đã implement:** ✅
```sql
-- shops: Thực thể chính
-- shop_vouchers: Thuộc tính yếu (voucher do shop tạo)

CREATE TABLE shop_vouchers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  shop_id BIGINT NOT NULL,                        -- FK bắt buộc
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(15,2),
  max_discount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);
```
**Lý do cần bảng chi tiết:**
- Shop có thể tạo nhiều voucher khác nhau
- Quản lý usage limit và thời hạn riêng biệt
- Theo dõi số lần sử dụng

### **7. orders → order_tracking**
**Đã implement:** ✅
```sql
-- orders: Thực thể chính
-- order_tracking: Thuộc tính yếu (lịch sử trạng thái đơn hàng)

CREATE TABLE order_tracking (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,                       -- FK bắt buộc
  status VARCHAR(50) NOT NULL,                    -- Trạng thái mới
  description TEXT,                               -- Mô tả chi tiết
  location VARCHAR(255),                          -- Vị trí hiện tại
  updated_by BIGINT,                              -- Người cập nhật
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);
```
**Lý do cần bảng chi tiết:**
- Theo dõi lịch sử thay đổi trạng thái
- Ghi lại ai đã cập nhật và khi nào
- Lưu vị trí giao hàng

### **8. messages → message_attachments** (Đã implement)
**Đã implement:** ✅
```sql
-- messages: Thực thể chính
-- message_attachments: Thuộc tính yếu (file đính kèm)

CREATE TABLE message_attachments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  message_id BIGINT NOT NULL,                     -- FK bắt buộc
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),                          -- image, document, etc.
  file_size INT,                                  -- Dung lượng file (bytes)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);
```
**Mô tả:** File đính kèm trong tin nhắn chat  
**Quan hệ:** N-1 với `messages` (1 tin nhắn có nhiều file đính kèm)

### **9. reviews → review_images** (Đã implement)
**Đã implement:** ✅
```sql
-- reviews: Thực thể chính
-- review_images: Thuộc tính yếu (hình ảnh review)

CREATE TABLE review_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  review_id BIGINT NOT NULL,                      -- FK bắt buộc
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),                           -- Chú thích hình ảnh
  sort_order INT DEFAULT 0,                       -- Thứ tự hiển thị
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);
```
**Mô tả:** Bộ sưu tập hình ảnh trong review sản phẩm  
**Quan hệ:** N-1 với `reviews` (1 review có nhiều hình ảnh)

### **10. categories → category_attributes** (Đề xuất thêm)
**Chưa implement:** ❌
```sql
-- categories: Thực thể chính
-- category_attributes: Thuộc tính yếu (thuộc tính động theo danh mục)

CREATE TABLE category_attributes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL,                    -- FK bắt buộc
  attribute_name VARCHAR(100) NOT NULL,           -- "Thương hiệu", "Xuất xứ"
  attribute_type ENUM('text', 'number', 'select', 'multiselect') DEFAULT 'text',
  is_required BOOLEAN DEFAULT FALSE,
  is_filterable BOOLEAN DEFAULT FALSE,            -- Có thể lọc không
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```
**Mô tả:** Thuộc tính động cho từng danh mục sản phẩm  
**Quan hệ:** N-1 với `categories`

## **Các Bảng Chi Tiết Đã Implement (10/10)**

| Bảng Chính | Bảng Chi Tiết | Mục đích | Ưu Tiên |
|------------|---------------|----------|---------|
| orders | order_items | Chi tiết sản phẩm trong đơn hàng | Cao |
| products | product_images | Bộ sưu tập hình ảnh sản phẩm | Cao |
| products | product_variants | Các biến thể (size, màu, etc.) | Cao |
| users | user_addresses | Địa chỉ giao hàng | Cao |
| users | user_profiles | Thông tin cá nhân mở rộng | Cao |
| shops | shop_vouchers | Voucher do shop tạo | Cao |
| orders | order_tracking | Lịch sử trạng thái đơn hàng | Cao |
| users | admin_users | Quyền admin bổ sung | Cao |
| **messages** | **message_attachments** | **File đính kèm chat** | **Cao** |
| **reviews** | **review_images** | **Hình ảnh review** | **Cao** |

## **Nguyên Tắc Thiết Kế Bảng Chi Tiết**

1. **Khóa Ngoại Bắt Buộc**: FK đến bảng chính không được null
2. **CASCADE DELETE**: Xóa bản chính → xóa bản chi tiết
3. **Snapshot Data**: Lưu thông tin tại thời điểm tạo (giá, tên, etc.)
4. **Thứ Tự & Ưu Tiên**: sort_order, is_main, is_default
5. **Metadata**: created_at, updated_at, created_by
6. **Validation**: CHECK constraints, UNIQUE constraints
7. **Indexing**: FK indexes cho performance

# 📊 **ER DIAGRAM - MÔI QUAN HỆ**

```
┌─────────────────┐           ┌─────────────────┐
│     users       │           │  user_profiles  │
│  (Người dùng)   │◄──────────┼─────────────────┤
│ - id (PK)       │ 1:1       │ - id (PK)       │
│ - username      │           │ - user_id (FK)  │
│ - email         │           │ - full_name     │
│ - phone         │           │ - avatar_url    │
│ - role          │           │ - date_of_birth │
│ - status        │           │ - gender        │
└─────────┬───────┘           └─────────────────┘
          │
          │ 1:N
          │
          ├─────────────────┐
          │ user_addresses  │
          │ (Địa chỉ)       │
          │ - id (PK)       │
          │ - user_id (FK)  │
          │ - recipient_name│
          │ - recipient_phone│
          │ - province      │
          │ - district      │
          │ - ward          │
          │ - street_address│
          └─────────────────┘
          │
          │ N:N (favorites)
          │ N:N (follows)
          │ N:N (view_history)
          │ N:N (messages)
          │
          ├─────────────────┐           ┌─────────────────┐
          │   favorites     │           │    follows      │
          │ (Yêu thích SP)  │           │ (Theo dõi shop) │
          │ - id (PK)       │           │ - id (PK)       │
          │ - user_id (FK)  │           │ - user_id (FK)  │
          │ - product_id(FK)│           │ - shop_id (FK)  │
          └─────────────────┘           └─────────────────┘

┌─────────────────┐           ┌─────────────────┐
│   categories    │           │     shops       │
│  (Danh mục)     │           │ (Cửa hàng)     │
│ - id (PK)       │           │ - id (PK)      │
│ - name          │           │ - owner_id (FK)│
│ - slug          │           │ - name         │
│ - parent_id (FK)│◄──────────┼ - slug         │
│ - image_url     │ Self-ref  │ - description  │
│ - sort_order    │           │ - logo_url     │
└─────────┬───────┘           └───────┬─────────┘
          │ 1:N                            │
          │                               │ 1:N
          │                               │
┌─────────────────┐           ┌─────────────────┐
│    products     │           │     orders      │
│ (Sản phẩm)      │◄──────────┼─────────────────┤
│ - id (PK)       │ N:1       │ (Đơn hàng)      │
│ - shop_id (FK)  │           │ - id (PK)       │
│ - category_id(FK│           │ - buyer_id (FK) │
│ - name          │           │ - shop_id (FK)  │
│ - price         │           │ - order_number  │
│ - stock_quantity│           │ - total_amount  │
└─────────┬───────┘           └───────┬─────────┘
          │                               │
          │ 1:N                          │ 1:N
          │                               │
          ├─────────────────┐           ┌─────────────────┐
          │ product_images  │           │   order_items   │
          │ (Hình ảnh SP)   │           │ (Chi tiết đơn)  │
          │ - id (PK)       │           │ - id (PK)       │
          │ - product_id(FK)│           │ - order_id (FK) │
          │ - image_url     │           │ - product_id(FK)│
          │ - alt_text      │           │ - quantity      │
          │ - sort_order    │           │ - unit_price    │
          └─────────────────┘           └─────────────────┘
          │                               │
          │ 1:N                          │ 1:1
          │                               │
          ├─────────────────┐           ┌─────────────────┐
          │product_variants │           │    payments     │
          │ (Biến thể SP)   │           │ (Thanh toán)    │
          │ - id (PK)       │           │ - id (PK)       │
          │ - product_id(FK)│           │ - order_id (FK) │
          │ - name          │           │ - amount        │
          │ - value         │           │ - status        │
          │ - price_modifier│           │ - transaction_id│
          └─────────────────┘           └─────────────────┘
          │
          │ N:N (cart_items)
          │
          ├─────────────────┐
          │   cart_items    │
          │ (Giỏ hàng)      │
          │ - id (PK)       │
          │ - user_id (FK)  │
          │ - product_id(FK)│
          │ - variant_id(FK)│
          │ - quantity      │
          └─────────────────┘
```

# 🔗 **TỔNG QUAN QUAN HỆ**

## **Quan hệ 1-1 (One-to-One)**

1. **users ↔ user_profiles**: Một user có đúng 1 profile
2. **orders ↔ payments**: Một đơn hàng có đúng 1 thanh toán
3. **users ↔ admin_users**: Một user có đúng 1 admin info (nếu là admin)

## **Quan hệ 1-N (One-to-Many)**

1. **users → user_addresses**: 1 user có nhiều địa chỉ
2. **categories → products**: 1 category có nhiều products
3. **categories → categories**: Self-referencing (parent-child)
4. **shops → products**: 1 shop có nhiều products
5. **users → shops**: 1 user sở hữu 1 shop
6. **products → product_images**: 1 product có nhiều hình ảnh
7. **products → product_variants**: 1 product có nhiều biến thể
8. **users → orders**: 1 user (buyer) có nhiều orders
9. **shops → orders**: 1 shop có nhiều orders
10. **orders → order_items**: 1 order có nhiều items
11. **orders → order_tracking**: 1 order có nhiều tracking records
12. **products → reviews**: 1 product có nhiều reviews
13. **users → reviews**: 1 user viết nhiều reviews
14. **users → notifications**: 1 user nhận nhiều notifications
15. **shops → shop_vouchers**: 1 shop tạo nhiều vouchers
16. **users → system_logs**: 1 user có nhiều log entries

## **Quan hệ N-N (Many-to-Many)**

1. **users ↔ products (favorites)**: Nhiều users yêu thích nhiều products
2. **users ↔ shops (follows)**: Nhiều users theo dõi nhiều shops
3. **users ↔ products (view_history)**: Nhiều users xem nhiều products
4. **users ↔ products (cart_items)**: Nhiều users thêm nhiều products vào giỏ
5. **users ↔ users (messages)**: Nhiều users chat với nhiều users
6. **users ↔ vouchers (user_vouchers)**: Nhiều users sở hữu nhiều vouchers
7. **users ↔ shop_vouchers (user_vouchers)**: Nhiều users sở hữu nhiều shop vouchers

## **Quan hệ Optional (Foreign Key có thể NULL)**

1. **orders → vouchers**: Đơn hàng có thể không dùng voucher
2. **orders → shop_vouchers**: Đơn hàng có thể không dùng shop voucher
3. **order_items → product_variants**: Item có thể không có biến thể
4. **cart_items → product_variants**: Cart item có thể không có biến thể
5. **messages → orders**: Tin nhắn có thể không liên quan đến đơn hàng
6. **product_search_logs → users**: Search log có thể từ user chưa đăng nhập
7. **system_logs → users**: Log có thể từ hệ thống (không có user)

# 🌐 **API ENDPOINTS**

## Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

## User Management
- `GET /api/user/profile` - Lấy profile
- `PUT /api/user/profile` - Cập nhật profile
- `PUT /api/user/password` - Cập nhật mật khẩu
- `GET /api/user/addresses` - Danh sách địa chỉ
- `POST /api/user/addresses` - Thêm địa chỉ
- `PUT /api/user/addresses/:id` - Sửa địa chỉ
- `DELETE /api/user/addresses/:id` - Xóa địa chỉ
- `GET /api/orders` - Danh sách đơn hàng theo người dùng
- `GET /api/cart` - Giỏ hàng của người dùng

## Home
- `GET /api/home/banners` - Danh sách banner
- `GET /api/home/popup-ads` - Thông tin popup ads
- `GET /api/home/flash-sale` - Danh sách sản phẩm flash sale
- `GET /api/home/recommended-products` - Danh sách sản phẩm khuyến nghị

## Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/history` - Lịch sử xem sản phẩm
- `POST /api/products/:id/view` - Ghi nhận đã xem sản phẩm
- `GET /api/categories` - Danh mục
- `GET /api/search` - Tìm kiếm sản phẩm
- `GET /api/products/:id/reviews` - Danh sách đánh giá theo sản phẩm

## Reviews
- `POST /api/products/:id/reviews` - Thêm đánh giá
- `DELETE /api/reviews/:id` - Xóa đánh giá

## Favorites
- `GET /api/favorites` - Danh sách yêu thích
- `POST /api/products/:id/favorite` - Yêu thích
- `DELETE /api/products/:id/favorite` - Bỏ yêu thích

## Brands & Categories
- `POST /api/categories` - Thêm loại hàng
- `PUT /api/categories/:id` - Sửa loại hàng
- `DELETE /api/categories/:id` - Xóa loại hàng
- `GET /api/brands` - Lấy thông tin nhãn hàng
- `GET /api/brands/:id/products` - Danh sách sản phẩm theo nhãn hàng

## Shopping & Orders
- `GET /api/cart` - Giỏ hàng
- `POST /api/cart` - Thêm vào giỏ
- `PUT /api/cart/:id` - Cập nhật số lượng
- `DELETE /api/cart/:id` - Xóa khỏi giỏ
- `POST /api/orders` - Đặt hàng
- `GET /api/orders` - Lịch sử đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

## Vouchers
- `GET /api/vouchers` - Danh sách voucher
- `POST /api/vouchers` - Tạo voucher
- `PUT /api/vouchers/:id` - Cập nhật voucher
- `DELETE /api/vouchers/:id` - Xóa voucher
- `POST /api/vouchers/:id/claim` - Lưu voucher vào tài khoản

## Payments
- `POST /api/payments` - Thanh toán đơn hàng
- `POST /api/payments/apply-voucher` - Áp mã giảm giá
- `POST /api/payments/vnpay/create` - Tạo giao dịch VNPay
- `GET /api/payments/vnpay/callback` - Callback VNPay

## Shops
- `POST /api/shops/register` - Đăng ký cửa hàng
- `POST /api/shops/:id/follow` - Follow cửa hàng
- `DELETE /api/shops/:id/follow` - Unfollow cửa hàng

## Chat & Notifications
- `GET /api/messages` - Tin nhắn
- `POST /api/messages` - Gửi tin nhắn
- `GET /api/notifications` - Thông báo

## AI Search
- `POST /api/ai/search-by-needs` - AI tìm kiếm sản phẩm theo nhu cầu

## Seller APIs
- `POST /api/seller/register` - Đăng ký bán hàng
- `GET /api/seller/products` - Quản lý sản phẩm
- `POST /api/seller/products` - Thêm sản phẩm
- `GET /api/seller/orders` - Quản lý đơn hàng
- `GET /api/seller/revenue` - Báo cáo doanh thu

## Admin APIs
- `GET /api/admin/users` - Quản lý users
- `GET /api/admin/shops` - Quản lý shops
- `GET /api/admin/stats` - Thống kê hệ thống