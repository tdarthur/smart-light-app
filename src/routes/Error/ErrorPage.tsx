import { Link, To, isRouteErrorResponse, useRouteError } from "react-router-dom";
import Header from "../../components/Header";

import styles from "./error.module.css";
import { useEffect } from "react";

type Props = {
	returnTo?: To;
};

/**
 * The error page. Used for the entire application.
 *
 * @param returnTo - Optional path used for navigation when the "Back" link is clicked. Defaults to the root path.
 */
const ErrorPage = ({ returnTo = "/" }: Props) => {
	const error = useRouteError();

	let errorStatus = "500 Internal Server Error";
	let errorMessage = "No details";
	let statusCode = 500;
	if (isRouteErrorResponse(error)) {
		statusCode = error.status;
		errorStatus = `${error.status.toString()} ${error.statusText}`;
		if (error.data) {
			const errorData = error.data as string;
			if (errorData.startsWith("Error: ")) {
				errorMessage = errorData.substring(7);
			} else {
				errorMessage = error.data;
			}
		}
	}

	useEffect(() => {
		document.title = `Illuminous - ${statusCode === 404 ? "Not Found" : "Unexpected Error"}`;
	});

	return (
		<>
			<Header />

			<main className={styles.errorPage}>
				<div className="main-container">
					<div className={styles.errorInformation}>
						<h1>An Error Occurred</h1>
						<h2 className={styles.errorStatus}>{errorStatus}</h2>
						<p>{errorMessage}</p>
					</div>

					<Link className={styles.backButton} to={returnTo}>
						Back
					</Link>
				</div>
			</main>
		</>
	);
};

export default ErrorPage;
