import { relations } from "drizzle-orm/relations";
import { orders, orderItems, shippingEvents, usersInAuth, userAddresses, userPreferences, favorites } from "./schema";

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	orderItems: many(orderItems),
	shippingEvents: many(shippingEvents),
	usersInAuth: one(usersInAuth, {
		fields: [orders.userId],
		references: [usersInAuth.id]
	}),
}));

export const shippingEventsRelations = relations(shippingEvents, ({one}) => ({
	order: one(orders, {
		fields: [shippingEvents.orderId],
		references: [orders.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	orders: many(orders),
	userAddresses: many(userAddresses),
	userPreferences: many(userPreferences),
	favorites: many(favorites),
}));

export const userAddressesRelations = relations(userAddresses, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userAddresses.userId],
		references: [usersInAuth.id]
	}),
}));

export const userPreferencesRelations = relations(userPreferences, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userPreferences.userId],
		references: [usersInAuth.id]
	}),
}));

export const favoritesRelations = relations(favorites, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [favorites.userId],
		references: [usersInAuth.id]
	}),
}));