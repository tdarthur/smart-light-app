import React from "react";
import ReactDOM from "react-dom/client";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home/Home";
import Shop from "./routes/Shop/Shop";
import Product from "./routes/Product/Product";
import About from "./routes/About/About";
import ErrorPage from "./routes/Error/Error";

import "./index.css";

const tenMinutes = 600_000;

const visitedInThisSession = sessionStorage.getItem("visited");
const lastVisited = localStorage.getItem("last-visit");
if (!visitedInThisSession && (!lastVisited || Date.now() - parseInt(lastVisited) > tenMinutes)) {
	localStorage.setItem("last-visit", Date.now().toString());
	sessionStorage.setItem("visited", "true");
}

const routes: RouteObject[] = [
	{
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "shop",
				element: <Shop />,
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
				path: "product/:id",
				element: <Product />,
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
				path: "about",
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
