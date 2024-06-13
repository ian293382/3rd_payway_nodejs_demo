USE `3rd_payway`;

CREATE TABLE `products` (
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL DEFAULT '',
    `amount` int UNSIGNED NOT NULL DEFAULT 0,
    `description` text,
    `pre_order` int UNSIGNED NOT NULL DEFAULT 0
);


ALTER TABLE `products` ADD `price` UNSIGNED NOT NULL DEFAULT 0