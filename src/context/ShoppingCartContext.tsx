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
	sortProductsAlphabetically: () => void;
	sortProductsByPrice: () => void;
	filterByCategory: (category: string) => void;
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
	const [products, setProducts] = useState<any>([]);

	const openCart = () => setIsOpen(true);
	const closeCart = () => setIsOpen(false);

	const cartQuantity = cartItems.reduce(
		(quantity, item) => item.quantity + quantity,
		0
	);

	const getItems = async () => {
		try {
			const response = await fetch(
				'https://man-shopping-cart-test.azurewebsites.net/api/Products'
			);
			const data = await response.json();
			console.log('PRODUCTS', data);
			setProducts(data);
		} catch (error) {
			console.error(error);
		}
	};

	const filterByCategory = (category: string) => {
		const filteredProducts = products.filter((product: any) =>
			product.categories.includes(category)
		);
		setProducts(filteredProducts);
	};

	const sortProductsAlphabetically = () => {
		setProducts((prevProducts: Products[]) => {
			const sortedProducts = [...prevProducts].sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});
			return sortedProducts;
		});
	};

	const sortProductsByPrice = () => {
		setProducts((prevProducts: Products[]) => {
			const sortedProducts = [...prevProducts].sort((a, b) => {
				if (a.price < b.price) {
					return -1;
				}
				if (a.price > b.price) {
					return 1;
				}
				return 0;
			});
			return sortedProducts;
		});
	};

	function getItemQuantity(id: number) {
		return cartItems.find(item => item.id === id)?.quantity || 0;
	}

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
				filterByCategory
			}}
		>
			{children}
			<ShoppingCart isOpen={isOpen} />
		</ShoppingCartContext.Provider>
	);
}
