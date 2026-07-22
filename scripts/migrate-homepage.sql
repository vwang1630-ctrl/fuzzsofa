-- ============================================================
-- Migration: Create homepage management tables
-- 首页配置管理（轮播图 / 主推商品 / 设计案例 / 最新动态）
-- ============================================================

-- 首页通用配置表（header、sections 等，config_value 存 JSON 字符串）
CREATE TABLE IF NOT EXISTS homepage_config (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 首页轮播图表
CREATE TABLE IF NOT EXISTS homepage_banners (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  button_text VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort (sort_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 首页主推商品表（product_slug 关联 products.slug）
CREATE TABLE IF NOT EXISTS homepage_featured_products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_slug VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  tag VARCHAR(50),
  custom_title VARCHAR(255),
  custom_subtitle VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (product_slug),
  INDEX idx_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 首页设计案例表
CREATE TABLE IF NOT EXISTS homepage_design_cases (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 首页最新动态表（post_slug 关联 journal 文章 slug）
CREATE TABLE IF NOT EXISTS homepage_latest_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_slug VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (post_slug),
  INDEX idx_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insert default homepage config
-- ============================================================
INSERT INTO homepage_config (config_key, config_value, description) VALUES
  ('header', '{"title":"Crafted by Nature","subtitle":"Where Wild Meets Refined"}', '首页头部配置'),
  ('sections', '[{"key":"banners","enabled":true},{"key":"featured","enabled":true},{"key":"cases","enabled":true},{"key":"posts","enabled":true}]', '首页区块显隐与排序')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);
