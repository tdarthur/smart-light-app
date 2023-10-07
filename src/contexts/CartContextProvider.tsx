import { Reducer, useReducer } from "react";
import cartContext, { CartContext, CartProductData, maxProductQuantity } from "./cartContext";
import { Product } from "../models/Product";

type Props = {
	initialValue: Map<string, CartProductData>;
} & Omit<React.ProviderProps<CartContext>, "value">;

type cardReducerAction = {
	product: Product;
	operation: "add" | "remove";
};

const cartReducer = (products: Map<string, CartProductData>, action: cardReducerAction) => {
	const { product, operation } = action;

	const updatedProducts = new Map(products);
	if (operation === "add") {
		if (updatedProducts.has(product.id)) {
			const productCount = (updatedProducts.get(product.id) as CartProductData)[1];
			if (productCount < maxProductQuantity && productCount < product.availableQuantity) {
				updatedProducts.set(product.id, [product, productCount + 1]);
			}
		} else {
			updatedProducts.set(product.id, [product, 1]);
		}
	} else if (operation === "remove") {
		if ((updatedProducts.get(product.id) as CartProductData)?.[1] > 1) {
			updatedProducts.set(product.id, [product, (updatedProducts.get(product.id) as CartProductData)[1] - 1]);
		} else {
			updatedProducts.delete(product.id);
		}
	}

	localStorage.setItem("shopping-cart", JSON.stringify(Array.from(updatedProducts.entries())));

	return updatedProducts;
};

const CartContextProvider = ({ initialValue, children }: Props) => {
	const [products, updateProducts] = useReducer<Reducer<Map<string, CartProductData>, cardReducerAction>>(
		cartReducer,
		initialValue,
	);

	const addToCart = (product: Product) => {
		updateProducts({ product, operation: "add" });
	};

	const removeFromCart = (product: Product) => {
		updateProducts({ product, operation: "remove" });
	};

	return (
		<cartContext.Provider
			value={{
				products,
				addToCart,
				removeFromCart,
			}}
		>
			{children}
		</cartContext.Provider>
	);
};

export default CartContextProvider;
