import { Product } from "../models/Product";

/**
 *
 * @param product - The product to query the option on.
 * @param optionId - The ID of the option to find.
 *
 * @returns The specified option from the product.
 */
export const getProductOption = (product: Product, optionId: string) =>
	product.options.find(({ id }) => optionId === id);
