import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import styles from "./about.module.css";

/**
 * The about page.
 */
const About = () => (
	<>
		<Header />
		<main className="main-container">
			<div className={styles.statement}>
				<h1>Our mission</h1>
				<p>
					We don't have a mission because we're a fake company. We do not sell real products. I repeat, we do
					not sell real products. This is just a project application made by this guy named Tyler because he
					felt like it.
				</p>
			</div>

			<div className={styles.statement}>
				<h1>Who are we?</h1>
				<p>
					We are a fake company, that sells a fake product. We were started in 2023 by Tyler Arthur as a
					project designed to showcase interactive designs and 3D lighting effects.
				</p>
			</div>

			<div className={styles.statement}>
				<h1>Additional questions?</h1>
				<p>
					Reach out to us (me) at{" "}
					<Link className="link-text" to="https://findtyler.com/#contact" target="_blank">
						findtyler.com
					</Link>
					. We'll be happy to help in any way we can!
				</p>
			</div>
		</main>
		<Footer />
	</>
);

export default About;
