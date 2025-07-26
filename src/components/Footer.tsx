import { Link, To } from "react-router-dom";
import styles from "./footer.module.css";
import IconChevron from "./icons/IconChevron";
import { useState } from "react";
import clsx from "clsx";

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
				to: "https://tyler-arthur.com/#contact",
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
				to: "https://tyler-arthur.com",
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
const Footer = ({ className, ...props }: React.ComponentPropsWithoutRef<"footer">) => {
	const [expandedSection, setExpandedSection] = useState<string>();

	return (
		<footer className={clsx(styles.footer, className)} {...props}>
			<div className={styles.footerContent}>
				<div className={styles.footerSections}>
					{footerSections.map((section) => {
						const expanded = expandedSection === section.name;
						return (
							<section
								className={styles.footerSection}
								data-expanded={expanded || undefined}
								style={expanded ? { height: `${48 + 24 * section.links.length}px` } : undefined}
								key={section.name}
							>
								<h3 className={styles.footerSectionHeader}>{section.name}</h3>
								<button
									className={styles.footerSectionButton}
									onClick={() => {
										setExpandedSection(expanded ? undefined : section.name);
									}}
								>
									{section.name}
									<span className={styles.footerSectionCollapseIcon}>
										<IconChevron
											style={{
												transition: "rotate 150ms linear",
												rotate: expanded ? "-90deg" : "90deg",
												strokeWidth: "2px",
											}}
											key={section.name}
										/>
									</span>
								</button>
								<ul>
									{section.links.map((link) => (
										<li
											// className={styles.}
											style={expanded ? { display: "block", height: "16px" } : undefined}
											key={link.name}
										>
											<Link to={link.to || "/random"}>{link.name}</Link>
										</li>
									))}
								</ul>
							</section>
						);
					})}
				</div>

				<p className={styles.copyright}>© 2024 Illuminous</p>
			</div>
		</footer>
	);
};

export default Footer;
