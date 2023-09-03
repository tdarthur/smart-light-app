import React from "react";
import ReactDOM from "react-dom/client";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home/Home";
import Error from "./routes/Error/Error";

import "./index.css";

const routes: RouteObject[] = [
	{
		path: "/",
		element: <Home />,
		errorElement: <Error />,
	},
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={createBrowserRouter(routes)} />
	</React.StrictMode>,
);
