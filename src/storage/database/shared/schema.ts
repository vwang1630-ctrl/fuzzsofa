import { pgTable, serial, timestamp, index, foreignKey, pgPolicy, uuid, text, integer, varchar, boolean, unique, check, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// Reference to auth.users table (managed by Supabase)
export const usersInAuth = pgTable("users", {
 id: uuid().primaryKey().notNull(),
});

export const users = usersInAuth;

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const orderItems = pgTable("order_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	productSlug: text("product_slug").notNull(),
	productName: text("product_name").notNull(),
	colorName: text("color_name"),
	colorHex: text("color_hex"),
	quantity: integer().default(1).notNull(),
	unitPrice: integer("unit_price").default(0).notNull(),
	subtotal: integer().default(0).notNull(),
	imageUrl: text("image_url"),
}, (table) => [
	index("idx_order_items_order_id").using("btree", table.orderId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can insert own order items", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(order_id IN ( SELECT orders.id
   FROM orders
  WHERE (orders.user_id = auth.uid())))`  }),
	pgPolicy("Users can view own order items", { as: "permissive", for: "select", to: ["public"] }),
]);

export const cart = pgTable("cart", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_cart_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "cart_user_id_fkey"
		}).onDelete("cascade"),
	unique("cart_user_id_key").on(table.userId),
	pgPolicy("Users can delete own cart", { as: "permissive", for: "delete", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can update own cart", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert own cart", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can view own cart", { as: "permissive", for: "select", to: ["public"] }),
]);

export const cartItems = pgTable("cart_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cartId: uuid("cart_id").notNull(),
	productSlug: text("product_slug").notNull(),
	productName: text("product_name").notNull(),
	material: text(),
	colorName: text("color_name"),
	colorHex: text("color_hex"),
	quantity: integer().default(1).notNull(),
	unitPrice: integer("unit_price").default(0).notNull(),
	imageUrl: text("image_url"),
 createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_cart_items_cart_id").using("btree", table.cartId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cart.id],
			name: "cart_items_cart_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can delete own cart items", { as: "permissive", for: "delete", to: ["public"], using: sql`(cart_id IN ( SELECT cart.id
   FROM cart
  WHERE (cart.user_id = auth.uid())))` }),
	pgPolicy("Users can update own cart items", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can insert own cart items", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(cart_id IN ( SELECT cart.id
   FROM cart
  WHERE (cart.user_id = auth.uid())))` }),
	pgPolicy("Users can view own cart items", { as: "permissive", for: "select", to: ["public"] }),
]);

export const shippingEvents = pgTable("shipping_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	status: text().notNull(),
	description: text(),
	location: text(),
	happenedAt: timestamp("happened_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	eventType: varchar("event_type", { length: 50 }),
	eventTitle: varchar("event_title", { length: 255 }),
	eventDescription: text("event_description"),
	isCurrent: boolean("is_current").default(false),
	isException: boolean("is_exception").default(false),
	carrier: varchar({ length: 100 }),
	trackingNumber: varchar("tracking_number", { length: 100 }),
	flightVessel: varchar("flight_vessel", { length: 100 }),
	estimatedArrival: timestamp("estimated_arrival", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_shipping_events_order_id").using("btree", table.orderId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "shipping_events_order_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can insert own shipping events", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(order_id IN ( SELECT orders.id
   FROM orders
  WHERE (orders.user_id = auth.uid())))`  }),
	pgPolicy("Users can view own shipping events", { as: "permissive", for: "select", to: ["public"] }),
]);

export const orders = pgTable("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	orderNumber: text("order_number").notNull(),
	status: text().default('pending').notNull(),
	shippingMethod: text("shipping_method").default('standard').notNull(),
	shippingFee: integer("shipping_fee").default(0).notNull(),
	subtotal: integer().default(0).notNull(),
	total: integer().default(0).notNull(),
	currency: text().default('CNY').notNull(),
	paymentMethod: text("payment_method"),
	paymentStatus: text("payment_status").default('pending').notNull(),
	recipientName: text("recipient_name"),
	phone: text(),
	province: text(),
	city: text(),
	district: text(),
	addressLine: text("address_line"),
	zipCode: text("zip_code"),
	carrier: text(),
	trackingNumber: text("tracking_number"),
	estimatedDelivery: date("estimated_delivery"),
	deliveredAt: timestamp("delivered_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text(),
	country: text().default('US'),
	addressLine2: text("address_line2"),
	state: text(),
	latestShippingEvent: varchar("latest_shipping_event", { length: 50 }),
}, (table) => [
	index("idx_orders_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_orders_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_fkey"
		}).onDelete("cascade"),
	unique("orders_order_number_key").on(table.orderNumber),
	pgPolicy("Users can update own orders", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert own orders", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can view own orders", { as: "permissive", for: "select", to: ["public"] }),
	check("orders_shipping_method_check", sql`shipping_method = ANY (ARRAY['standard'::text, 'express'::text])`),
	check("orders_payment_status_check", sql`payment_status = ANY (ARRAY['pending'::text, 'pending_payment'::text, 'paid'::text, 'refunded'::text, 'failed'::text])`),
	check("orders_status_check", sql`status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])`),
]);

export const userAddresses = pgTable("user_addresses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	label: text().default('Home'),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text(),
	phone: text(),
	country: text().default('US').notNull(),
	addressLine1: text("address_line1").notNull(),
	addressLine2: text("address_line2"),
	city: text().notNull(),
	state: text(),
	zipCode: text("zip_code"),
	isDefault: boolean("is_default").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_addresses_user_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can delete own addresses", { as: "permissive", for: "delete", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can update own addresses", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can insert own addresses", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can view own addresses", { as: "permissive", for: "select", to: ["public"] }),
]);

export const userPreferences = pgTable("user_preferences", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	defaultPaymentMethod: text("default_payment_method").default('creditcard'),
	preferredShippingMethod: text("preferred_shipping_method").default('standard'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_preferences_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_preferences_user_id_key").on(table.userId),
	pgPolicy("Users can update own preferences", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert own preferences", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can view own preferences", { as: "permissive", for: "select", to: ["public"] }),
]);

export const favorites = pgTable("favorites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	productSlug: varchar("product_slug", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_favorites_product_slug").using("btree", table.productSlug.asc().nullsLast().op("text_ops")),
	index("idx_favorites_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "favorites_user_id_fkey"
		}).onDelete("cascade"),
	unique("favorites_user_id_product_slug_key").on(table.userId, table.productSlug),
	pgPolicy("Service role full access", { as: "permissive", for: "all", to: ["public"], using: sql`true`, withCheck: sql`true`  }),
	pgPolicy("Users can delete own favorites", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Users can insert own favorites", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can view own favorites", { as: "permissive", for: "select", to: ["public"] }),
]);
