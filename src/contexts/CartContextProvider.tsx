import { Reducer, useReducer } from "react";
import cartContext, { CartContext } from "./cartContext";

type Props = Omit<React.ProviderProps<CartContext>, "value">;

type CartProducts = Map<string, number>;

type cardReducerAction = {
	productId: string;
	operation: "add" | "remove";
};

const cartReducer = (products: CartProducts, action: cardReducerAction) => {
	const { productId, operation } = action;

	if (operation === "add") {
		if (products.has(productId)) {
			products.set(productId, (products.get(productId) as number) + 1);
		} else {
			products.set(productId, 1);
		}
	} else if (operation === "remove") {
		if ((products.get(productId) as number) > 1) {
			products.set(productId, (products.get(productId) as number) - 1);
		} else {
			products.delete(productId);
		}
	}

	return products;
};

const CartContextProvider = ({ children }: Props) => {
	const [products, updateProducts] = useReducer<Reducer<CartProducts, cardReducerAction>>(
		cartReducer,
		new Map<string, number>(),
	);

	const addToCart = (productId: string) => {
		updateProducts({ productId, operation: "add" });
	};

	const removeFromCart = (productId: string) => {
		updateProducts({ productId, operation: "remove" });
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
