"""
Seed script: Transform gearvn_products_transformed.csv and insert into PostgreSQL.

Usage:
    pip install psycopg2-binary pandas numpy
    python seed_products.py
"""

import pandas as pd
import numpy as np
import psycopg2
from psycopg2.extras import execute_values
import re
import ast
import sys

# ── Config ──────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "nt118",
    "user": "postgres",
    "password": "postgres",
}

CSV_PATH = r"c:\mobile\NT118\database\gearvn_products_transformed.csv"

# ── Category mapping (auto-detect from product title) ────────────────
CATEGORY_MAP = {
    "Laptop": ["laptop", "macbook", "thinkpad", "ideapad", "vivobook", "zenbook", "gram"],
    "PC - Máy tính bàn": ["pc gvn", "pc intel"],
    "Màn hình": ["màn hình", "monitor"],
    "Card màn hình": ["card màn hình", "vga", "geforce rtx", "radeon rx"],
    "Bàn phím": ["bàn phím", "keyboard"],
    "Chuột": ["chuột", "mouse"],
    "Tai nghe": ["tai nghe", "headset", "headphone"],
    "Loa": ["loa", "speaker"],
    "Tay cầm": ["tay cầm", "gamepad", "controller"],
    "RAM": ["ram"],
    "Ổ cứng & SSD": ["ssd", "ổ cứng", "hdd"],
    "Nguồn máy tính": ["nguồn máy tính", "psu", "nguồn"],
    "Tản nhiệt": ["tản nhiệt", "cooler", "aio"],
    "Vỏ máy tính": ["vỏ máy tính", "case", "vỏ case"],
    "Bo mạch chủ": ["bo mạch chủ", "mainboard", "motherboard"],
    "CPU": ["bộ vi xử lý", "cpu", "ryzen", "intel core"],
    "Quạt máy tính": ["quạt"],
    "Phụ kiện": [
        "lót chuột", "tấm lót", "webcam", "micro", "cáp", "adapter",
        "phụ kiện", "thảm", "túi", "balo", "quà tặng"
    ],
    "Gaming Gear": ["máy chơi game", "code game", "nintendo", "steam deck"],
}

def detect_category(title: str) -> str:
    title_lower = title.lower()
    for cat_name, keywords in CATEGORY_MAP.items():
        for kw in keywords:
            if kw in title_lower:
                return cat_name
    return "Khác"


def slugify(text: str) -> str:
    """Simple slug generator: lowercase, unaccented, hyphenated."""
    slug = text.lower().strip()
    # Remove Vietnamese diacritics (simplified)
    replacements = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
    }
    for vn, en in replacements.items():
        slug = slug.replace(vn, en)
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug[:250]


def parse_thumbnails(val):
    """Parse the thumbnails column (Python list repr string)."""
    if pd.isna(val) or not val:
        return []
    try:
        result = ast.literal_eval(str(val))
        return result if isinstance(result, list) else [str(result)]
    except:
        return [str(val)]


def main():
    print("=" * 60)
    print("  ShopeeLite Product Seeder")
    print("=" * 60)

    # ── 1. Read CSV ───────────────────────────────────────────
    print(f"\n[1/6] Reading CSV: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH, dtype={"id": str})
    print(f"  → {len(df)} rows loaded")

    # ── 2. Clean & Transform ──────────────────────────────────
    print("[2/6] Cleaning and transforming data...")

    # Remove rows with empty title or 0 price
    df = df[df['title'].notna() & (df['title'].str.strip() != '')]
    df = df[df['salePrice'].notna() & (df['salePrice'] > 0)]
    print(f"  → {len(df)} valid products after filtering")

    # Generate missing fields using numpy
    np.random.seed(42)

    # stock_quantity: random between 10-500
    df['stock_quantity'] = np.random.randint(10, 501, size=len(df))

    # sold_quantity: based on reviewCount with some randomness
    df['sold_quantity'] = (df['reviewCount'].fillna(0).astype(int) *
                           np.random.uniform(2, 8, size=len(df))).astype(int)

    # weight_grams: random realistic weights based on category
    df['weight_grams'] = np.random.randint(200, 5000, size=len(df))

    # dimensions: generate random dimensions
    widths = np.random.randint(10, 60, size=len(df))
    heights = np.random.randint(5, 40, size=len(df))
    depths = np.random.randint(1, 30, size=len(df))
    df['dimensions'] = [f"{w}x{h}x{d}" for w, h, d in zip(widths, heights, depths)]

    # Detect categories
    df['category_name'] = df['title'].apply(detect_category)
    print(f"  → Categories detected: {df['category_name'].nunique()}")
    print(f"    {df['category_name'].value_counts().to_dict()}")

    # Generate slugs (ensure uniqueness)
    df['slug'] = df.apply(
        lambda row: slugify(row['title']) + '-' + str(row['id']), axis=1
    )

    # Fix rating to 0.00-5.00 range
    df['rating'] = df['rating'].clip(0, 5).round(2)

    # ── 3. Connect to PostgreSQL ──────────────────────────────
    print("[3/6] Connecting to PostgreSQL...")
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False
    cur = conn.cursor()
    print(f"  → Connected to {DB_CONFIG['dbname']}@{DB_CONFIG['host']}")

    try:
        # ── 4. Create tables ──────────────────────────────────
        print("[4/6] Creating tables if not exist...")

        cur.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id BIGSERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                parent_id BIGINT,
                image_url VARCHAR(500),
                sort_order INTEGER DEFAULT 0,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS shops (
                id BIGSERIAL PRIMARY KEY,
                owner_id BIGINT NOT NULL DEFAULT 1,
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
                status VARCHAR(20) DEFAULT 'active',
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id BIGSERIAL PRIMARY KEY,
                shop_id BIGINT NOT NULL DEFAULT 1,
                category_id BIGINT NOT NULL DEFAULT 1,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                price DECIMAL(15,2) NOT NULL,
                original_price DECIMAL(15,2),
                stock_quantity INTEGER DEFAULT 0,
                sold_quantity INTEGER DEFAULT 0,
                rating DECIMAL(3,2) DEFAULT 0.00,
                total_reviews INTEGER DEFAULT 0,
                status VARCHAR(20) DEFAULT 'active',
                weight_grams INTEGER,
                dimensions VARCHAR(50),
                brand VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS product_images (
                id BIGSERIAL PRIMARY KEY,
                product_id BIGINT NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                alt_text VARCHAR(255),
                sort_order INTEGER DEFAULT 0,
                is_main BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        conn.commit()

        # Add brand column if missing (EF Core may have created table without it)
        cur.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'products' AND column_name = 'brand'
                ) THEN
                    ALTER TABLE products ADD COLUMN brand VARCHAR(100);
                END IF;
            END $$;
        """)
        conn.commit()
        print("  -> Tables ready")

        # ── 5. Seed categories & shop ─────────────────────────
        print("[5/6] Seeding categories and default shop...")

        # Clear old data
        cur.execute("DELETE FROM product_images;")
        cur.execute("DELETE FROM products;")
        cur.execute("DELETE FROM categories;")
        cur.execute("DELETE FROM shops;")
        conn.commit()

        # Insert categories
        unique_cats = df['category_name'].unique()
        cat_id_map = {}
        for i, cat_name in enumerate(sorted(unique_cats), 1):
            cat_slug = slugify(cat_name) or f"category-{i}"
            cur.execute(
                """INSERT INTO categories (name, slug, sort_order)
                   VALUES (%s, %s, %s) RETURNING id;""",
                (cat_name, cat_slug, i)
            )
            cat_id_map[cat_name] = cur.fetchone()[0]
        conn.commit()
        print(f"  → {len(cat_id_map)} categories created")

        # Insert default shop (GearVN Store)
        cur.execute("""
            INSERT INTO shops (owner_id, name, slug, description, rating, total_products, is_verified)
            VALUES (1, 'GearVN Official', 'gearvn-official',
                    'Cửa hàng công nghệ hàng đầu Việt Nam', 4.80, %s, true)
            RETURNING id;
        """, (len(df),))
        shop_id = cur.fetchone()[0]
        conn.commit()
        print(f"  → Default shop created (id={shop_id})")

        # ── 6. Seed products & images ─────────────────────────
        print(f"[6/6] Inserting {len(df)} products...")

        product_count = 0
        image_count = 0

        for _, row in df.iterrows():
            cat_id = cat_id_map.get(row['category_name'], 1)
            sale_price = float(row['salePrice'])
            orig_price = float(row['originalPrice']) if pd.notna(row['originalPrice']) and float(row['originalPrice']) > 0 else None

            # If salePrice >= originalPrice, swap or set original to None
            if orig_price and sale_price >= orig_price:
                orig_price = round(sale_price * np.random.uniform(1.2, 1.8), 2)

            desc = str(row['description']) if pd.notna(row['description']) else 'Mô tả sản phẩm đang được cập nhật.'
            brand_val = str(row['brand']) if pd.notna(row['brand']) and str(row['brand']).strip() not in ['', 'Khác', 'Không thương hiệu'] else None
            rating_val = round(float(row['rating']), 2) if pd.notna(row['rating']) else 0.0
            review_count = int(row['reviewCount']) if pd.notna(row['reviewCount']) else 0

            cur.execute("""
                INSERT INTO products (
                    shop_id, category_id, name, slug, description,
                    price, original_price, stock_quantity, sold_quantity,
                    rating, total_reviews, status, weight_grams, dimensions, brand
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                RETURNING id;
            """, (
                shop_id, cat_id, str(row['title']), row['slug'], desc,
                sale_price, orig_price,
                int(row['stock_quantity']), int(row['sold_quantity']),
                rating_val, review_count, 'active',
                int(row['weight_grams']), row['dimensions'], brand_val
            ))
            product_id = cur.fetchone()[0]
            product_count += 1

            # Main image
            main_img = str(row['image']) if pd.notna(row['image']) else None
            if main_img:
                cur.execute("""
                    INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_main)
                    VALUES (%s, %s, %s, 0, true);
                """, (product_id, main_img, str(row['title'])[:255]))
                image_count += 1

            # Detail image (if different from main)
            detail_img = str(row['detailImage']) if pd.notna(row.get('detailImage')) else None
            if detail_img and detail_img != main_img:
                cur.execute("""
                    INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_main)
                    VALUES (%s, %s, %s, 1, false);
                """, (product_id, detail_img, f"Detail - {str(row['title'])[:240]}"))
                image_count += 1

            # Thumbnails
            thumbs = parse_thumbnails(row.get('thumbnails'))
            for idx, thumb_url in enumerate(thumbs):
                if thumb_url and thumb_url not in (main_img, detail_img):
                    cur.execute("""
                        INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_main)
                        VALUES (%s, %s, %s, %s, false);
                    """, (product_id, str(thumb_url), f"Thumb {idx+1}", idx + 2))
                    image_count += 1

            if product_count % 500 == 0:
                conn.commit()
                print(f"  → {product_count} products inserted...")

        conn.commit()

        print("\n" + "=" * 60)
        print(f"  ✅ DONE!")
        print(f"  → Products inserted: {product_count}")
        print(f"  → Images inserted:   {image_count}")
        print(f"  → Categories:        {len(cat_id_map)}")
        print("=" * 60)

    except Exception as e:
        conn.rollback()
        print(f"\n❌ ERROR: {e}")
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
