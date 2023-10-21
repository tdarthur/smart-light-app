type PurchaseOption = {
	id: string;
	caption: string;
	price: number;
	available: number;
};

type Review = {
	customer: string;
	review: string;
	rating: number;
};

export type Product = {
	id: string;
	name: string;
	image: string;
	features: string[];
	options: PurchaseOption[];
	averageRating: number;
	reviewCount: number;
	reviews: Review[];
};
