import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Header from "../../components/Header";

import styles from "./error.module.css";

const Error = () => {
	const error = useRouteError();

	let errorStatus = "Unknown Error";
	let errorMessage = "";
	if (isRouteErrorResponse(error)) {
		errorStatus = `${error.status.toString()} ${error.statusText}`;
		errorMessage = error.error?.message || "";
	}

	return (
		<>
			<Header />
			<div className={styles.errorDecoration} />
			<main className={styles.errorPage}>
				<h1>An Error Occurred</h1>
				<h2 className={styles.errorStatus}>{errorStatus}</h2>
				<p>{errorMessage}</p>
			</main>
		</>
	);
};

export default Error;
