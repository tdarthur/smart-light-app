import { useContext } from "react";
import cartContext from "../contexts/cartContext";

/**
 * useContext hook wrapper for cartContext.
 */
export default () => useContext(cartContext);
