import React from "react";
import ReactDOM from "react-dom/client";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home/Home";
import Products from "./routes/Products/Products";
import Product from "./routes/Products/Product";
import About from "./routes/About/About";
import Error from "./routes/Error/Error";

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
		errorElement: <Error />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{ path: "products/:id", element: <Product /> },
			{
				path: "products",
				element: <Products />,
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
