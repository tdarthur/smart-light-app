import { createContext } from "react";
import { Product } from "../models/Product";

export type CartProductData = [product: Product, optionId: string, count: number];

export type CartContext = {
	cart: Map<string, CartProductData>;
	addToCart: (product: Product, optionId: string, count: number) => void;
	removeFromCart: (product: Product, optionId: string, count: number) => void;
};

export const maxProductQuantity = 99;

export const cartVersion = "1.0";

const cartContext = createContext<CartContext>({
	cart: new Map(),
	addToCart: () => {},
	removeFromCart: () => {},
});

export default cartContext;
