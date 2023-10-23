import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouteObject, RouterProvider, ScrollRestoration, createBrowserRouter } from "react-router-dom";

import HomePage from "./routes/Home/Home";
import StorePage from "./routes/Store/Store";
import ProductPage from "./routes/Product/Product";
import AboutPage from "./routes/About/About";
import ErrorPage from "./routes/Error/ErrorPage";
import CheckoutPage from "./routes/Checkout/Checkout";
import RandomPage from "./routes/Random/Random";
import { Product } from "./models/Product";
import CartContextProvider from "./contexts/CartContextProvider";
import { CartProductData, cartVersion } from "./contexts/cartContext";

import "./index.css";

const tenMinutes = 600_000;

const visitedInThisSession = sessionStorage.getItem("visited");
const lastVisited = localStorage.getItem("last-visit");
if (!visitedInThisSession && (!lastVisited || Date.now() - parseInt(lastVisited) > tenMinutes)) {
	localStorage.setItem("last-visit", Date.now().toString());
}
sessionStorage.setItem("visited", "true");

const shoppingCartData = localStorage.getItem("shopping-cart");
let shoppingCart: Map<string, CartProductData> | undefined = undefined;
if (shoppingCartData) {
	const parsedShoppingCartData = JSON.parse(shoppingCartData);
	if (parsedShoppingCartData?.version === cartVersion) {
		shoppingCart = parsedShoppingCartData.cart as Map<string, CartProductData>;
	}
}

type PageProps = {
	title: string;
} & React.PropsWithChildren;
const Page = ({ title, children }: PageProps) => {
	useEffect(() => {
		document.title = `Illuminous - ${title}`;
	}, [title]);

	return children;
};

const routes: RouteObject[] = [
	{
		element: (
			<>
				<ScrollRestoration />
				<CartContextProvider initialValue={shoppingCart ? new Map(shoppingCart) : new Map()}>
					<Outlet />
				</CartContextProvider>
			</>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: (
					<Page title="Home">
						<HomePage />
					</Page>
				),
				errorElement: <ErrorPage />,
			},
			{
				path: "/store",
				element: (
					<Page title="Store">
						<StorePage />
					</Page>
				),
				loader: async () => {
					const products = (await (await fetch("/products.json", { cache: "no-store" })).json()) as Product[];

					if (!products) {
						throw new Response("Products failed to load", {
							status: 500,
							statusText: "Internal Server Error",
						});
					}

					return products;
				},
			},
			{
				path: "/product/:id",
				element: (
					<Page title="Product Page">
						<ProductPage />
					</Page>
				),
				errorElement: <ErrorPage returnTo="/store" />,
				loader: async ({ params }) => {
					const products = (await (await fetch("/products.json", { cache: "no-store" })).json()) as Product[];
					const product = products.find((p) => p.id === params.id);

					if (!product) {
						throw new Response(`No product with id "${params.id}" was found`, {
							status: 404,
							statusText: "Not Found",
						});
					}

					return product;
				},
			},
			{
				path: "/about",
				element: (
					<Page title="About">
						<AboutPage />
					</Page>
				),
			},
			{
				path: "/checkout",
				element: (
					<Page title="Checkout">
						<CheckoutPage />
					</Page>
				),
			},
			{
				path: "/random",
				element: (
					<Page title="Nothing Here">
						<RandomPage />
					</Page>
				),
				loader: async () => {
					const products = (await (await fetch("/products.json", { cache: "no-store" })).json()) as Product[];

					return products || [];
				},
			},
		],
	},
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={createBrowserRouter(routes)} />
	</React.StrictMode>,
);
