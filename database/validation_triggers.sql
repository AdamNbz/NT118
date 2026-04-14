-- Validation triggers for NT118 backend
-- Apply with: psql -d <db_name> -f database/validation_triggers.sql

BEGIN;

-- Helper: basic email format check
CREATE OR REPLACE FUNCTION is_valid_email(input text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT input ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$';
$$;

-- Helper: slug format check
CREATE OR REPLACE FUNCTION is_valid_slug(input text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT input ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$';
$$;

-- Helper: voucher code format check
CREATE OR REPLACE FUNCTION is_valid_voucher_code(input text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT input ~ '^[A-Z0-9_-]+$';
$$;

-- users
CREATE OR REPLACE FUNCTION trg_validate_users()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.email := lower(btrim(NEW.email));

    IF NEW.email IS NULL OR NEW.email = '' THEN
        RAISE EXCEPTION 'users.email is required';
    END IF;

    IF length(NEW.email) > 100 THEN
        RAISE EXCEPTION 'users.email length must be <= 100';
    END IF;

    IF NOT is_valid_email(NEW.email) THEN
        RAISE EXCEPTION 'users.email format is invalid';
    END IF;

    IF NEW.username IS NULL OR btrim(NEW.username) = '' THEN
        RAISE EXCEPTION 'users.username is required';
    END IF;

    IF NEW.phone IS NOT NULL AND length(NEW.phone) > 20 THEN
        RAISE EXCEPTION 'users.phone length must be <= 20';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.users') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_users ON users;
        CREATE TRIGGER validate_users
        BEFORE INSERT OR UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION trg_validate_users();
    END IF;
END
$$;

-- user_profiles
CREATE OR REPLACE FUNCTION trg_validate_user_profiles()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.user_id IS NULL OR NEW.user_id <= 0 THEN
        RAISE EXCEPTION 'user_profiles.user_id must be > 0';
    END IF;

    IF NEW.full_name IS NOT NULL AND length(NEW.full_name) > 100 THEN
        RAISE EXCEPTION 'user_profiles.full_name length must be <= 100';
    END IF;

    IF NEW.avatar_url IS NOT NULL AND length(NEW.avatar_url) > 500 THEN
        RAISE EXCEPTION 'user_profiles.avatar_url length must be <= 500';
    END IF;

    IF NEW.date_of_birth IS NOT NULL AND NEW.date_of_birth > CURRENT_DATE THEN
        RAISE EXCEPTION 'user_profiles.date_of_birth cannot be in the future';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.user_profiles') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_user_profiles ON user_profiles;
        CREATE TRIGGER validate_user_profiles
        BEFORE INSERT OR UPDATE ON user_profiles
        FOR EACH ROW EXECUTE FUNCTION trg_validate_user_profiles();
    END IF;
END
$$;

-- user_addresses
CREATE OR REPLACE FUNCTION trg_validate_user_addresses()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.user_id IS NULL OR NEW.user_id <= 0 THEN
        RAISE EXCEPTION 'user_addresses.user_id must be > 0';
    END IF;

    IF NEW.recipient_name IS NULL OR btrim(NEW.recipient_name) = '' OR length(NEW.recipient_name) > 100 THEN
        RAISE EXCEPTION 'user_addresses.recipient_name is required and must be <= 100';
    END IF;

    IF NEW.recipient_phone IS NULL OR btrim(NEW.recipient_phone) = '' OR length(NEW.recipient_phone) > 20 THEN
        RAISE EXCEPTION 'user_addresses.recipient_phone is required and must be <= 20';
    END IF;

    IF NEW.province IS NULL OR btrim(NEW.province) = '' OR length(NEW.province) > 50 THEN
        RAISE EXCEPTION 'user_addresses.province is required and must be <= 50';
    END IF;

    IF NEW.district IS NULL OR btrim(NEW.district) = '' OR length(NEW.district) > 50 THEN
        RAISE EXCEPTION 'user_addresses.district is required and must be <= 50';
    END IF;

    IF NEW.ward IS NULL OR btrim(NEW.ward) = '' OR length(NEW.ward) > 50 THEN
        RAISE EXCEPTION 'user_addresses.ward is required and must be <= 50';
    END IF;

    IF NEW.street_address IS NULL OR btrim(NEW.street_address) = '' OR length(NEW.street_address) > 500 THEN
        RAISE EXCEPTION 'user_addresses.street_address is required and must be <= 500';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.user_addresses') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_user_addresses ON user_addresses;
        CREATE TRIGGER validate_user_addresses
        BEFORE INSERT OR UPDATE ON user_addresses
        FOR EACH ROW EXECUTE FUNCTION trg_validate_user_addresses();
    END IF;
END
$$;

-- categories
CREATE OR REPLACE FUNCTION trg_validate_categories()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.name IS NULL OR btrim(NEW.name) = '' OR length(NEW.name) > 100 THEN
        RAISE EXCEPTION 'categories.name is required and must be <= 100';
    END IF;

    IF NEW.slug IS NULL OR btrim(NEW.slug) = '' OR length(NEW.slug) > 100 OR NOT is_valid_slug(NEW.slug) THEN
        RAISE EXCEPTION 'categories.slug is invalid';
    END IF;

    IF NEW.description IS NOT NULL AND length(NEW.description) > 1000 THEN
        RAISE EXCEPTION 'categories.description length must be <= 1000';
    END IF;

    IF NEW.image_url IS NOT NULL AND length(NEW.image_url) > 500 THEN
        RAISE EXCEPTION 'categories.image_url length must be <= 500';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.categories') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_categories ON categories;
        CREATE TRIGGER validate_categories
        BEFORE INSERT OR UPDATE ON categories
        FOR EACH ROW EXECUTE FUNCTION trg_validate_categories();
    END IF;
END
$$;

-- products
CREATE OR REPLACE FUNCTION trg_validate_products()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.shop_id IS NULL OR NEW.shop_id <= 0 THEN
        RAISE EXCEPTION 'products.shop_id must be > 0';
    END IF;

    IF NEW.category_id IS NULL OR NEW.category_id <= 0 THEN
        RAISE EXCEPTION 'products.category_id must be > 0';
    END IF;

    IF NEW.name IS NULL OR btrim(NEW.name) = '' OR length(NEW.name) > 255 THEN
        RAISE EXCEPTION 'products.name is required and must be <= 255';
    END IF;

    IF NEW.slug IS NULL OR btrim(NEW.slug) = '' OR length(NEW.slug) > 255 OR NOT is_valid_slug(NEW.slug) THEN
        RAISE EXCEPTION 'products.slug is invalid';
    END IF;

    IF NEW.description IS NOT NULL AND length(NEW.description) > 2000 THEN
        RAISE EXCEPTION 'products.description length must be <= 2000';
    END IF;

    IF NEW.price IS NULL OR NEW.price <= 0 THEN
        RAISE EXCEPTION 'products.price must be > 0';
    END IF;

    IF NEW.stock_quantity < 0 OR NEW.stock_quantity > 1000000 THEN
        RAISE EXCEPTION 'products.stock_quantity must be in range [0, 1000000]';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.products') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_products ON products;
        CREATE TRIGGER validate_products
        BEFORE INSERT OR UPDATE ON products
        FOR EACH ROW EXECUTE FUNCTION trg_validate_products();
    END IF;
END
$$;

-- cart_items
CREATE OR REPLACE FUNCTION trg_validate_cart_items()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.user_id IS NULL OR NEW.user_id <= 0 THEN
        RAISE EXCEPTION 'cart_items.user_id must be > 0';
    END IF;

    IF NEW.product_id IS NULL OR NEW.product_id <= 0 THEN
        RAISE EXCEPTION 'cart_items.product_id must be > 0';
    END IF;

    IF NEW.variant_id IS NOT NULL AND NEW.variant_id <= 0 THEN
        RAISE EXCEPTION 'cart_items.variant_id must be > 0 when provided';
    END IF;

    IF NEW.quantity < 1 OR NEW.quantity > 1000 THEN
        RAISE EXCEPTION 'cart_items.quantity must be in range [1, 1000]';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.cart_items') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_cart_items ON cart_items;
        CREATE TRIGGER validate_cart_items
        BEFORE INSERT OR UPDATE ON cart_items
        FOR EACH ROW EXECUTE FUNCTION trg_validate_cart_items();
    END IF;
END
$$;

-- orders
CREATE OR REPLACE FUNCTION trg_validate_orders()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.buyer_id IS NULL OR NEW.buyer_id <= 0 THEN
        RAISE EXCEPTION 'orders.buyer_id must be > 0';
    END IF;

    IF NEW.shop_id IS NULL OR NEW.shop_id <= 0 THEN
        RAISE EXCEPTION 'orders.shop_id must be > 0';
    END IF;

    IF NEW.shipping_address_id IS NULL OR NEW.shipping_address_id <= 0 THEN
        RAISE EXCEPTION 'orders.shipping_address_id must be > 0';
    END IF;

    IF NEW.payment_method IS NOT NULL AND length(NEW.payment_method) > 50 THEN
        RAISE EXCEPTION 'orders.payment_method length must be <= 50';
    END IF;

    IF NEW.notes IS NOT NULL AND length(NEW.notes) > 1000 THEN
        RAISE EXCEPTION 'orders.notes length must be <= 1000';
    END IF;

    IF NEW.subtotal < 0 OR NEW.shipping_fee < 0 OR NEW.discount_amount < 0 OR NEW.total_amount < 0 THEN
        RAISE EXCEPTION 'orders monetary values must be >= 0';
    END IF;

    IF NEW.total_amount <> NEW.subtotal + NEW.shipping_fee - NEW.discount_amount THEN
        RAISE EXCEPTION 'orders.total_amount must equal subtotal + shipping_fee - discount_amount';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.orders') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_orders ON orders;
        CREATE TRIGGER validate_orders
        BEFORE INSERT OR UPDATE ON orders
        FOR EACH ROW EXECUTE FUNCTION trg_validate_orders();
    END IF;
END
$$;

-- order_items
CREATE OR REPLACE FUNCTION trg_validate_order_items()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.order_id IS NULL OR NEW.order_id <= 0 THEN
        RAISE EXCEPTION 'order_items.order_id must be > 0';
    END IF;

    IF NEW.product_id IS NULL OR NEW.product_id <= 0 THEN
        RAISE EXCEPTION 'order_items.product_id must be > 0';
    END IF;

    IF NEW.variant_id IS NOT NULL AND NEW.variant_id <= 0 THEN
        RAISE EXCEPTION 'order_items.variant_id must be > 0 when provided';
    END IF;

    IF NEW.product_name IS NULL OR btrim(NEW.product_name) = '' OR length(NEW.product_name) > 255 THEN
        RAISE EXCEPTION 'order_items.product_name is required and must be <= 255';
    END IF;

    IF NEW.product_image IS NOT NULL AND length(NEW.product_image) > 500 THEN
        RAISE EXCEPTION 'order_items.product_image length must be <= 500';
    END IF;

    IF NEW.quantity < 1 OR NEW.quantity > 1000 THEN
        RAISE EXCEPTION 'order_items.quantity must be in range [1, 1000]';
    END IF;

    IF NEW.unit_price <= 0 THEN
        RAISE EXCEPTION 'order_items.unit_price must be > 0';
    END IF;

    IF NEW.total_price <= 0 THEN
        RAISE EXCEPTION 'order_items.total_price must be > 0';
    END IF;

    IF NEW.total_price <> NEW.unit_price * NEW.quantity THEN
        RAISE EXCEPTION 'order_items.total_price must equal unit_price * quantity';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.order_items') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_order_items ON order_items;
        CREATE TRIGGER validate_order_items
        BEFORE INSERT OR UPDATE ON order_items
        FOR EACH ROW EXECUTE FUNCTION trg_validate_order_items();
    END IF;
END
$$;

-- reviews
CREATE OR REPLACE FUNCTION trg_validate_reviews()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.order_id IS NULL OR NEW.order_id <= 0 THEN
        RAISE EXCEPTION 'reviews.order_id must be > 0';
    END IF;

    IF NEW.product_id IS NULL OR NEW.product_id <= 0 THEN
        RAISE EXCEPTION 'reviews.product_id must be > 0';
    END IF;

    IF NEW.reviewer_id IS NULL OR NEW.reviewer_id <= 0 THEN
        RAISE EXCEPTION 'reviews.reviewer_id must be > 0';
    END IF;

    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        RAISE EXCEPTION 'reviews.rating must be in range [1, 5]';
    END IF;

    IF NEW.comment IS NOT NULL AND length(NEW.comment) > 2000 THEN
        RAISE EXCEPTION 'reviews.comment length must be <= 2000';
    END IF;

    IF NEW.helpful_votes < 0 THEN
        RAISE EXCEPTION 'reviews.helpful_votes must be >= 0';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.reviews') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_reviews ON reviews;
        CREATE TRIGGER validate_reviews
        BEFORE INSERT OR UPDATE ON reviews
        FOR EACH ROW EXECUTE FUNCTION trg_validate_reviews();
    END IF;
END
$$;

-- vouchers
CREATE OR REPLACE FUNCTION trg_validate_vouchers()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.code IS NULL OR btrim(NEW.code) = '' OR length(NEW.code) > 50 OR NOT is_valid_voucher_code(NEW.code) THEN
        RAISE EXCEPTION 'vouchers.code is invalid';
    END IF;

    IF NEW.name IS NULL OR btrim(NEW.name) = '' OR length(NEW.name) > 255 THEN
        RAISE EXCEPTION 'vouchers.name is required and must be <= 255';
    END IF;

    IF NEW.description IS NOT NULL AND length(NEW.description) > 1000 THEN
        RAISE EXCEPTION 'vouchers.description length must be <= 1000';
    END IF;

    IF NEW.discount_value IS NULL OR NEW.discount_value <= 0 OR NEW.discount_value > 999999999 THEN
        RAISE EXCEPTION 'vouchers.discount_value must be in range (0, 999999999]';
    END IF;

    IF NEW.discount_type = 'percentage'::voucher_discount_type AND NEW.discount_value > 100 THEN
        RAISE EXCEPTION 'percentage voucher discount_value must be <= 100';
    END IF;

    IF NEW.min_order_value IS NOT NULL AND NEW.min_order_value < 0 THEN
        RAISE EXCEPTION 'vouchers.min_order_value must be >= 0';
    END IF;

    IF NEW.max_discount IS NOT NULL AND NEW.max_discount < 0 THEN
        RAISE EXCEPTION 'vouchers.max_discount must be >= 0';
    END IF;

    IF NEW.usage_limit IS NOT NULL AND NEW.usage_limit <= 0 THEN
        RAISE EXCEPTION 'vouchers.usage_limit must be > 0';
    END IF;

    IF NEW.used_count < 0 THEN
        RAISE EXCEPTION 'vouchers.used_count must be >= 0';
    END IF;

    IF NEW.usage_limit IS NOT NULL AND NEW.used_count > NEW.usage_limit THEN
        RAISE EXCEPTION 'vouchers.used_count cannot exceed usage_limit';
    END IF;

    IF NEW.start_date >= NEW.end_date THEN
        RAISE EXCEPTION 'vouchers.start_date must be earlier than end_date';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.vouchers') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_vouchers ON vouchers;
        CREATE TRIGGER validate_vouchers
        BEFORE INSERT OR UPDATE ON vouchers
        FOR EACH ROW EXECUTE FUNCTION trg_validate_vouchers();
    END IF;
END
$$;

-- payments
CREATE OR REPLACE FUNCTION trg_validate_payments()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.order_id IS NULL OR NEW.order_id <= 0 THEN
        RAISE EXCEPTION 'payments.order_id must be > 0';
    END IF;

    IF NEW.payment_method IS NULL OR btrim(NEW.payment_method) = '' OR length(NEW.payment_method) > 50 THEN
        RAISE EXCEPTION 'payments.payment_method is required and must be <= 50';
    END IF;

    IF NEW.amount IS NULL OR NEW.amount <= 0 OR NEW.amount > 999999999 THEN
        RAISE EXCEPTION 'payments.amount must be in range (0, 999999999]';
    END IF;

    IF NEW.currency IS NULL OR length(NEW.currency) < 3 OR length(NEW.currency) > 10 THEN
        RAISE EXCEPTION 'payments.currency length must be in range [3, 10]';
    END IF;

    NEW.currency := upper(NEW.currency);

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.payments') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_payments ON payments;
        CREATE TRIGGER validate_payments
        BEFORE INSERT OR UPDATE ON payments
        FOR EACH ROW EXECUTE FUNCTION trg_validate_payments();
    END IF;
END
$$;

-- shops
CREATE OR REPLACE FUNCTION trg_validate_shops()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.owner_id IS NULL OR NEW.owner_id <= 0 THEN
        RAISE EXCEPTION 'shops.owner_id must be > 0';
    END IF;

    IF NEW.name IS NULL OR btrim(NEW.name) = '' OR length(NEW.name) > 100 THEN
        RAISE EXCEPTION 'shops.name is required and must be <= 100';
    END IF;

    IF NEW.slug IS NULL OR btrim(NEW.slug) = '' OR length(NEW.slug) > 100 OR NOT is_valid_slug(NEW.slug) THEN
        RAISE EXCEPTION 'shops.slug is invalid';
    END IF;

    IF NEW.description IS NOT NULL AND length(NEW.description) > 2000 THEN
        RAISE EXCEPTION 'shops.description length must be <= 2000';
    END IF;

    IF NEW.logo_url IS NOT NULL AND length(NEW.logo_url) > 500 THEN
        RAISE EXCEPTION 'shops.logo_url length must be <= 500';
    END IF;

    IF NEW.cover_image_url IS NOT NULL AND length(NEW.cover_image_url) > 500 THEN
        RAISE EXCEPTION 'shops.cover_image_url length must be <= 500';
    END IF;

    IF NEW.address IS NOT NULL AND length(NEW.address) > 500 THEN
        RAISE EXCEPTION 'shops.address length must be <= 500';
    END IF;

    IF NEW.phone IS NOT NULL AND length(NEW.phone) > 20 THEN
        RAISE EXCEPTION 'shops.phone length must be <= 20';
    END IF;

    IF NEW.email IS NOT NULL AND (length(NEW.email) > 100 OR NOT is_valid_email(NEW.email)) THEN
        RAISE EXCEPTION 'shops.email is invalid';
    END IF;

    IF NEW.rating < 0 OR NEW.rating > 5 THEN
        RAISE EXCEPTION 'shops.rating must be in range [0, 5]';
    END IF;

    IF NEW.total_reviews < 0 THEN
        RAISE EXCEPTION 'shops.total_reviews must be >= 0';
    END IF;

    IF NEW.total_products < 0 THEN
        RAISE EXCEPTION 'shops.total_products must be >= 0';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.shops') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_shops ON shops;
        CREATE TRIGGER validate_shops
        BEFORE INSERT OR UPDATE ON shops
        FOR EACH ROW EXECUTE FUNCTION trg_validate_shops();
    END IF;
END
$$;

-- messages
CREATE OR REPLACE FUNCTION trg_validate_messages()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.sender_id IS NULL OR NEW.sender_id <= 0 THEN
        RAISE EXCEPTION 'messages.sender_id must be > 0';
    END IF;

    IF NEW.receiver_id IS NULL OR NEW.receiver_id <= 0 THEN
        RAISE EXCEPTION 'messages.receiver_id must be > 0';
    END IF;

    IF NEW.sender_id = NEW.receiver_id THEN
        RAISE EXCEPTION 'messages.sender_id cannot equal receiver_id';
    END IF;

    IF NEW.order_id IS NOT NULL AND NEW.order_id <= 0 THEN
        RAISE EXCEPTION 'messages.order_id must be > 0 when provided';
    END IF;

    IF NEW.content IS NOT NULL AND length(NEW.content) > 4000 THEN
        RAISE EXCEPTION 'messages.content length must be <= 4000';
    END IF;

    IF NEW.attachment_url IS NOT NULL AND length(NEW.attachment_url) > 500 THEN
        RAISE EXCEPTION 'messages.attachment_url length must be <= 500';
    END IF;

    IF (NEW.content IS NULL OR btrim(NEW.content) = '') AND (NEW.attachment_url IS NULL OR btrim(NEW.attachment_url) = '') THEN
        RAISE EXCEPTION 'messages must include content or attachment_url';
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
    IF to_regclass('public.messages') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS validate_messages ON messages;
        CREATE TRIGGER validate_messages
        BEFORE INSERT OR UPDATE ON messages
        FOR EACH ROW EXECUTE FUNCTION trg_validate_messages();
    END IF;
END
$$;

COMMIT;
