import { createContext } from "react";
import { Product } from "../models/Product";

export type CartProductData = [product: Product, count: number];

export type CartContext = {
	products: Map<string, CartProductData>;
	addToCart: (product: Product) => void;
	removeFromCart: (product: Product) => void;
};

export const maxProductQuantity = 99;

const cartContext = createContext<CartContext>({
	products: new Map(),
	addToCart: () => {},
	removeFromCart: () => {},
});

export default cartContext;
