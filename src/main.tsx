import React from "react";
import ReactDOM from "react-dom/client";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home/Home";
import Error from "./routes/Error/Error";

import "./index.css";
import Products from "./routes/Products/Products";

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
			{
				path: "products",
				element: <Products />,
			},
		],
	},
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={createBrowserRouter(routes)} />
	</React.StrictMode>,
);
