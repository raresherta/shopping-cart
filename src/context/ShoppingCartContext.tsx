import { ReactNode, createContext, useContext, useState } from 'react';
import { ShoppingCart } from '../components/ShoppingCart/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Products = {
	id: number;
	name: string;
	imageUrl: string;
	supplierId: number;
	wholesalePrice: number;
	price: number;
	categories: string[];
};

type ShoppingCartProviderProps = {
	children: ReactNode;
};

type CartItem = {
	id: number;
	quantity: number;
};

type ShoppingCartContextInterface = {
	openCart: () => void;
	closeCart: () => void;
	cartQuantity: number;
	cartItems: CartItem[];
	getItemQuantity: (id: number) => number;
	increaseCartQuantity: (id: number) => void;
	decreaseCartQuantity: (id: number) => void;
	removeFromCart: (id: number) => void;
	getItems: () => void;
	products: Products[];
	productsCopy: Products[];
	sortProductsAlphabetically: () => void;
	sortProductsByPrice: () => void;
	filterByCategory: (category: string) => void;
	resetItems: () => void;
};

const ShoppingCartContext = createContext({} as ShoppingCartContextInterface);

export function useShoppingCart() {
	return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
		'shopping-cart',
		[]
	);
	const [products, setProducts] = useState<Products[]>([]);
	const [productsCopy, setProductsCopy] = useState<Products[]>([]);

	const openCart = () => setIsOpen(true);
	const closeCart = () => setIsOpen(false);

	const cartQuantity = cartItems.reduce(
		(quantity, item) => item.quantity + quantity,
		0
	);

	/**
		*Fetches the list of products from the API and updates the state with the retrieved data.
		@returns {Promise<void>} A promise that resolves when the API call is successful and data is set in the state,.
	 */
	const getItems = async () => {
		try {
			const response = await fetch(
				'https://man-shopping-cart-test.azurewebsites.net/api/Products'
			);
			const data = await response.json();
			setProducts(data);
			setProductsCopy(data);
		} catch (error) {
			console.error(error);
		}
	};

	function resetItems() {
		setProductsCopy(products);
	}

	/**
	 * Filters the products by category and sets the filtered products as the new state.
	 *
	 * @param {string} category The category to filter the products by.
	 */
	const filterByCategory = (category: string) => {
		const filteredProducts = products.filter((product: any) =>
			product.categories.includes(category)
		);
		setProductsCopy(filteredProducts);
	};

	/**
	 * Sorts the products alphabetically by name and sets the sorted products as the new state.
	 */
	const sortProductsAlphabetically = () => {
		const sortedArray = [...productsCopy].sort((a, b) =>
			a.name.localeCompare(b.name)
		);
		setProductsCopy(sortedArray);
	};

	/**
	 * Sorts the products by price and sets the sorted products as the new state.
	 */
	const sortProductsByPrice = () => {
		const sortedArray = [...productsCopy].sort((a, b) => a.price - b.price);
		setProductsCopy(sortedArray);
	};

	function getItemQuantity(id: number) {
		return cartItems.find(item => item.id === id)?.quantity || 0;
	}

	/**
	 * Increases the quantity of a product in the cart, or adds it to the cart if it is not already there.
	 *
	 * @param {number} id The ID of the product to increase the quantity of.
	 */
	function increaseCartQuantity(id: number) {
		setCartItems(currItems => {
			if (currItems.find(item => item.id === id) == null) {
				return [...currItems, { id, quantity: 1 }];
			} else {
				return currItems.map(item => {
					if (item.id === id) {
						return { ...item, quantity: item.quantity + 1 };
					} else {
						return item;
					}
				});
			}
		});
	}

	/**
	 * Decreases the quantity of a product in the cart, or removes it from the cart if its quantity becomes 0.
	 *
	 * @param {number} id The ID of the product to decrease the quantity of.
	 */
	function decreaseCartQuantity(id: number) {
		setCartItems(currItems => {
			if (currItems.find(item => item.id === id)?.quantity === 1) {
				return currItems.filter(item => item.id !== id);
			} else {
				return currItems.map(item => {
					if (item.id === id) {
						return { ...item, quantity: item.quantity - 1 };
					} else {
						return item;
					}
				});
			}
		});
	}

	/**
	 * Removes a product from the cart by its ID.
	 *
	 * @param {number} id The ID of the product to remove from the cart.
	 */
	function removeFromCart(id: number) {
		setCartItems(currItems => {
			return currItems.filter(item => item.id !== id);
		});
	}

	return (
		<ShoppingCartContext.Provider
			value={{
				getItemQuantity,
				increaseCartQuantity,
				decreaseCartQuantity,
				removeFromCart,
				cartItems,
				cartQuantity,
				openCart,
				closeCart,
				getItems,
				products,
				sortProductsAlphabetically,
				sortProductsByPrice,
				filterByCategory,
				productsCopy,
				resetItems
			}}
		>
			{children}
			<ShoppingCart isOpen={isOpen} />
		</ShoppingCartContext.Provider>
	);
}
