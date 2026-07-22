-- ============================================================
-- Migration: Create site_settings and site_logs tables
-- Date: 2024-12-20
-- ============================================================

-- 站点设置表
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 网站日志表
CREATE TABLE IF NOT EXISTS site_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  level ENUM('info', 'warn', 'error', 'debug') DEFAULT 'info',
  module VARCHAR(50),
  action VARCHAR(100),
  message TEXT,
  metadata JSON,
  user_id VARCHAR(36),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_level (level),
  INDEX idx_module (module),
  INDEX idx_created (created_at),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insert default site settings
-- ============================================================
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('site_name', 'FUZZ SOFA', 'string', '站点名称'),
  ('site_description', 'Animal-Inspired Luxury Furniture', 'string', '站点描述'),
  ('banner_image', '', 'string', 'Banner 图片 URL'),
  ('banner_title', 'Crafted by Nature', 'string', 'Banner 标题'),
  ('banner_subtitle', 'Where Wild Meets Refined', 'string', 'Banner 副标题'),
  ('contact_email', 'hello@fuzzsofa.com', 'string', '联系邮箱'),
  ('currency', 'USD', 'string', '默认货币'),
  ('language', 'en', 'string', '默认语言')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
