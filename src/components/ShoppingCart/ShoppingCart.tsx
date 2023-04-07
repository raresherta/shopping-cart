import { useEffect } from 'react';

import { Offcanvas, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { CartItem } from '../CartItem/CartItem';
import { formatPrice } from '../../utils/formatPrice';

type ShoppingCartProps = {
	isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
	const { closeCart, cartItems, products, cartQuantity } = useShoppingCart();
	var shippingCost = 0;

	useEffect(() => {
		addShippingCost(cartQuantity);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cartQuantity, shippingCost]);

	function addShippingCost(num: number) {
		if (num < 20) {
			shippingCost = 7;
			return formatPrice(7);
		} else if (num < 40) {
			shippingCost = 5;
			return formatPrice(5);
		} else {
			return 'FREE';
		}
	}

	function calculateTotalPrice() {
		const totalItemsPrice = cartItems.reduce((total, cartItem) => {
			const item = products.find((i: any) => i.id === cartItem.id);
			return total + (item?.price || 0) * cartItem.quantity;
		}, 0);

		const totalPrice = totalItemsPrice + shippingCost;

		return formatPrice(totalPrice);
	}

	return (
		<Offcanvas show={isOpen} onHide={closeCart} placement='end'>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Cart</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Stack gap={3}>
					{cartItems.map(item => (
						<CartItem key={item.id} {...item} />
					))}
					<div className='d-flex justify-content-end fs-7'>
						<span style={{ paddingRight: '8px' }}>
							Shipping Cost{''}
						</span>
						<span>{addShippingCost(cartQuantity)}</span>
					</div>
					<div className='ms-auto fw-bold fs-5'>
						Total {calculateTotalPrice()}
					</div>
				</Stack>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
