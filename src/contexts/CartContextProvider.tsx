import { Reducer, useReducer } from "react";
import cartContext, { CartContext, CartProductData, cartVersion, maxProductQuantity } from "./cartContext";
import { getProductOption } from "../utils/productUtils";
import { Product } from "../models/Product";

type Props = {
	initialValue: Map<string, CartProductData>;
} & Omit<React.ProviderProps<CartContext>, "value">;

type cardReducerAction = {
	product: Product;
	optionId: string;
	operation: "add" | "remove";
	count: number;
};

/**
 * Reducer function for cartContext state mutations. Allows adding or removing items from the cart.
 *
 * @param cart - Initial cart state.
 * @param action - Action to mutate the cart state.
 *
 * @returns Modified cart state.
 */
const cartReducer = (cart: Map<string, CartProductData>, action: cardReducerAction) => {
	const { product, optionId, operation, count: actionCount } = action;
	const option = getProductOption(product, optionId);
	if (!option) return cart;

	const updatedCart = new Map(cart);
	const key = `${product.id}-${optionId}`;
	const productCount = updatedCart.has(key) ? (updatedCart.get(key) as CartProductData)[2] : 0;
	if (operation === "add") {
		if (productCount < maxProductQuantity && productCount < option.available) {
			updatedCart.set(key, [
				product,
				optionId,
				Math.min(productCount + actionCount, maxProductQuantity, option.available),
			]);
		}
	} else if (operation === "remove") {
		if (productCount > 0) {
			if ((updatedCart.get(key) as CartProductData)?.[2] > actionCount) {
				updatedCart.set(key, [product, optionId, productCount - actionCount]);
			} else {
				updatedCart.delete(key);
			}
		}
	}

	localStorage.setItem(
		"shopping-cart",
		JSON.stringify({ version: cartVersion, cart: Array.from(updatedCart.entries()) }),
	);

	return updatedCart;
};

/**
 * Custom ContextProvider used for the cartContext. Sets up initial context state and provides mutation functions.
 */
const CartContextProvider = ({ initialValue, children }: Props) => {
	const [cart, updateCart] = useReducer<Reducer<Map<string, CartProductData>, cardReducerAction>>(
		cartReducer,
		initialValue,
	);

	/**
	 * Adds a specified number of products to the cart.
	 *
	 * @param product - The product to add to the cart.
	 * @param optionId - The ID of the product option being added.
	 * @param count - The number of products to add.
	 */
	const addToCart = (product: Product, optionId: string, count: number) => {
		updateCart({ product, optionId, operation: "add", count });
	};

	/**
	 * Removes a specified number of products from the cart.
	 *
	 * @param product - The product to remove from the cart.
	 * @param optionId - The ID of the product option being removed.
	 * @param count - The number of products to remove.
	 */
	const removeFromCart = (product: Product, optionId: string, count: number) => {
		updateCart({ product, optionId, operation: "remove", count });
	};

	return (
		<cartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
			}}
		>
			{children}
		</cartContext.Provider>
	);
};

export default CartContextProvider;
