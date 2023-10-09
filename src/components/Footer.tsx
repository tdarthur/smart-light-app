import { Link, To } from "react-router-dom";
import styles from "./footer.module.css";
import IconChevron from "./icons/IconChevron";

type FooterLink = {
	name: string;
	to: To;
};

type FooterSection = {
	name: string;
	links: FooterLink[];
};

const footerSections: FooterSection[] = [
	{
		name: "Support",
		links: [
			{
				name: "Contact Us",
				to: "https://findtyler.com/#contact",
			},
			{
				name: "FAQ",
				to: "/about",
			},
			{
				name: "Order Status",
				to: "",
			},
			{
				name: "Privacy Policy",
				to: "",
			},
			{
				name: "Terms of Service",
				to: "",
			},
		],
	},
	{
		name: "Products",
		links: [
			{
				name: "Smart Home Integration",
				to: "",
			},
			{
				name: "Mobile App",
				to: "",
			},
			{
				name: "What's New",
				to: "/store",
			},
		],
	},
	{
		name: "Explore",
		links: [
			{
				name: "About Us",
				to: "/about",
			},
			{
				name: "LinkedIn",
				to: "https://www.linkedin.com/in/tyler-arthur-b914b9171/",
			},
			{
				name: "Github",
				to: "https://github.com/tdarthur",
			},
			{
				name: "Tyler's Site",
				to: "https://findtyler.com",
			},
		],
	},
	{
		name: "Careers",
		links: [
			{
				name: "Our Culture",
				to: "",
			},
			{
				name: "Join Our Team",
				to: "",
			},
			{
				name: "Employee Login",
				to: "",
			},
		],
	},
];

/**
 * Application footer.
 */
const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				<div className={styles.footerSections}>
					{footerSections.map((section) => (
						<section className={styles.footerSection}>
							<h3>
								{section.name}
								<span className={styles.footerSectionCollapseIcon}>
									<IconChevron style={{ rotate: "90deg" }} />
								</span>
							</h3>
							<ul>
								{section.links.map((link) => (
									<li>
										<Link to={link.to || "#"}>{link.name}</Link>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>

				<p className={styles.copyright}>© 2023 Illuminous</p>
			</div>
		</footer>
	);
};

export default Footer;
