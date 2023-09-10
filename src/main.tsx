import React from "react";
import ReactDOM from "react-dom/client";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home/Home";
import Products from "./routes/Products/Products";
import Product from "./routes/Products/Product";
import About from "./routes/About/About";
import Error from "./routes/Error/Error";

import "./index.css";

setTimeout(() => {
	sessionStorage.setItem("visited", "true");
}, 100);

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
