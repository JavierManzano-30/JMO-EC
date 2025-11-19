-- ------------------------------------------------------------
-- BubblyBot - Esquema relacional para usuarios y conversaciones
-- Compatible con MySQL/MariaDB (probado en HeidiSQL)
-- ------------------------------------------------------------
DROP DATABASE IF EXISTS `bubblybot`;
CREATE DATABASE `bubblybot`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `bubblybot`;

-- ------------------------------------------------------------
-- Tabla: users
-- ------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(120) NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('student','admin','guest') NOT NULL DEFAULT 'student',
  `status` ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla: sessions (estado de sesión local)
-- ------------------------------------------------------------
CREATE TABLE `sessions` (
  `id` CHAR(36) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `session_token` CHAR(64) NOT NULL,
  `device_label` VARCHAR(120) DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `last_seen_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sessions_token` (`session_token`),
  KEY `idx_sessions_user_id` (`user_id`),
  CONSTRAINT `fk_sessions_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla: conversations
-- ------------------------------------------------------------
CREATE TABLE `conversations` (
  `id` CHAR(26) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `summary` VARCHAR(300) DEFAULT NULL,
  `status` ENUM('active','archived','deleted') NOT NULL DEFAULT 'active',
  `source` ENUM('chat','import','pokedex') NOT NULL DEFAULT 'chat',
  `total_messages` INT UNSIGNED NOT NULL DEFAULT 0,
  `last_message_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversations_user_id` (`user_id`),
  KEY `idx_conversations_last_message_at` (`last_message_at`),
  FULLTEXT KEY `ft_conversations_title_summary` (`title`,`summary`),
  CONSTRAINT `fk_conversations_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla: messages (historial de cada conversación)
-- ------------------------------------------------------------
CREATE TABLE `messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` CHAR(26) NOT NULL,
  `sender_type` ENUM('user','assistant','system') NOT NULL,
  `sender_user_id` INT UNSIGNED DEFAULT NULL,
  `content` TEXT NOT NULL,
  `metadata` JSON DEFAULT NULL,
  `is_error` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_messages_conversation_id` (`conversation_id`),
  KEY `idx_messages_sender_user_id` (`sender_user_id`),
  FULLTEXT KEY `ft_messages_content` (`content`),
  CONSTRAINT `fk_messages_conversations` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_messages_users` FOREIGN KEY (`sender_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla: conversation_shares (para deep-linking controlado)
-- ------------------------------------------------------------
CREATE TABLE `conversation_shares` (
  `id` CHAR(36) NOT NULL,
  `conversation_id` CHAR(26) NOT NULL,
  `share_token` CHAR(36) NOT NULL,
  `created_by` INT UNSIGNED NOT NULL,
  `expires_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_conversation_shares_token` (`share_token`),
  KEY `idx_shares_conversation_id` (`conversation_id`),
  CONSTRAINT `fk_shares_conversations` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_shares_users` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Vistas de apoyo para el frontend / reportes
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW `vw_conversation_overview` AS
SELECT
  c.id,
  c.user_id,
  u.display_name AS owner_name,
  c.title,
  c.summary,
  c.total_messages,
  c.status,
  c.source,
  c.created_at,
  c.updated_at,
  c.last_message_at
FROM conversations c
JOIN users u ON u.id = c.user_id;

CREATE OR REPLACE VIEW `vw_message_feed` AS
SELECT
  m.id AS message_id,
  m.conversation_id,
  c.user_id,
  u.display_name AS owner_name,
  m.sender_type,
  m.content,
  m.created_at
FROM messages m
JOIN conversations c ON c.id = m.conversation_id
LEFT JOIN users u ON u.id = c.user_id;

-- ------------------------------------------------------------
-- Datos de ejemplo para iniciar pruebas
-- ------------------------------------------------------------
INSERT INTO `users` (`username`, `email`, `password_hash`, `display_name`, `avatar_url`, `role`)
VALUES
('javier', 'javier@example.com', '$2y$10$abcdefghijklmnopqrstuv', 'Javier Manzano', NULL, 'student'),
('mentor', 'mentor@example.com', '$2y$10$abcdefghijklmnopqrstuv', 'Mentor IA', NULL, 'admin');

INSERT INTO `conversations` (`id`, `user_id`, `title`, `summary`, `total_messages`, `last_message_at`, `source`)
VALUES
('conv_demo_001', 1, 'Ideas para el Sprint 5', 'Planificación del mapa de rutas y guards.', 4, NOW(), 'chat'),
('conv_demo_002', 1, 'Consulta Pokédex', 'Información sobre Pikachu y Bulbasaur.', 6, NOW(), 'pokedex');

INSERT INTO `messages` (`conversation_id`, `sender_type`, `sender_user_id`, `content`)
VALUES
('conv_demo_001', 'user', 1, 'Necesito definir las rutas del proyecto.'),
('conv_demo_001', 'assistant', NULL, 'Empieza con login, chat, conversaciones, Pokédex y ajustes.'),
('conv_demo_001', 'user', 1, '¿Cómo protejo las rutas privadas?'),
('conv_demo_001', 'assistant', NULL, 'Crea guards en el cliente y sincroniza con el estado de sesión.'),
('conv_demo_002', 'user', 1, 'Quiero información de Pikachu.'),
('conv_demo_002', 'assistant', NULL, 'Pikachu es de tipo eléctrico, peso 6kg y número 025.'),
('conv_demo_002', 'user', 1, 'Entonces dame datos de Bulbasaur.'),
('conv_demo_002', 'assistant', NULL, 'Bulbasaur es tipo planta/veneno con número 001.');

