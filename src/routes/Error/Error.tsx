import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import Header from "../../components/Header";

import styles from "./error.module.css";

const ErrorPage = () => {
	const error = useRouteError();

	let errorStatus = "500 Internal Server Error";
	let errorMessage = "No details";
	if (isRouteErrorResponse(error)) {
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

	const returnTo = "/";

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
