import { useEffect } from "react";

type PageProps = {
	title: string;
} & React.PropsWithChildren;

const Page = ({ title, children }: PageProps) => {
	useEffect(() => {
		document.title = `Illuminous - ${title}`;
	}, [title]);

	return children;
};

export default Page;
