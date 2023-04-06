import { Offcanvas, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { CartItem } from '../CartItem/CartItem';
import { formatPrice } from '../../utils/formatPrice';

type ShoppingCartProps = {
	isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
	const { closeCart, cartItems, products } = useShoppingCart();
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
					<div className='ms-auto fw-bold fs-5'>
						Total{' '}
						{formatPrice(
							cartItems.reduce((total, cartItem) => {
								const item = products.find(
									(i: any) => i.id === cartItem.id
								);
								return (
									total +
									(item?.price || 0) * cartItem.quantity
								);
							}, 0)
						)}
					</div>
				</Stack>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
