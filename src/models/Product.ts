type PurchaseOption = {
	id: string;
	caption: string;
	price: number;
	available: number;
};

export type Product = {
	id: string;
	name: string;
	image: string;
	features: string[];
	options: PurchaseOption[];
	averageRating: number;
	reviews: number;
};
