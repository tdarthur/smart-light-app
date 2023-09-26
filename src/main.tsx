import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouteObject, RouterProvider, ScrollRestoration, createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home/Home";
import Store from "./routes/Store/Store";
import Product from "./routes/Product/Product";
import About from "./routes/About/About";
import ErrorPage from "./routes/Error/ErrorPage";

import "./index.css";
import CartContextProvider from "./contexts/CartContextProvider";

const tenMinutes = 600_000;

const visitedInThisSession = sessionStorage.getItem("visited");
const lastVisited = localStorage.getItem("last-visit");
if (!visitedInThisSession && (!lastVisited || Date.now() - parseInt(lastVisited) > tenMinutes)) {
	localStorage.setItem("last-visit", Date.now().toString());
	sessionStorage.setItem("visited", "true");
}

const routes: RouteObject[] = [
	{
		element: (
			<>
				<ScrollRestoration />
				<CartContextProvider>
					<Outlet />
				</CartContextProvider>
			</>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Home />,
				errorElement: <ErrorPage />,
				children: [],
			},
			{
				path: "/store",
				element: <Store />,
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
				element: <Product />,
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
				element: <About />,
			},
		],
	},
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={createBrowserRouter(routes)} />
	</React.StrictMode>,
);
