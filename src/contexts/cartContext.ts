import { createContext } from "react";

export type CartContext = {
	products: Map<string, number>;
	addToCart: (productId: string) => void;
	removeFromCart: (productId: string) => void;
};

const cartContext = createContext<CartContext>({
	products: new Map<string, number>(),
	addToCart: () => {},
	removeFromCart: () => {},
});

export default cartContext;
