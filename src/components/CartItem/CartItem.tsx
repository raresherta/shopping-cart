import { Button, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { formatPrice } from '../../utils/formatPrice';

type CartItemProps = {
	id: number;
	quantity: number;
};

export function CartItem({ id, quantity }: CartItemProps) {
	const { removeFromCart, products } = useShoppingCart();
	const product = products.find(item => item.id === id);
	if (product == null) return null;

	return (
		<Stack
			direction='horizontal'
			gap={2}
			className='d-flex align-items-center'
		>
			<img
				alt='shopping-cart-small'
				src={product.imageUrl}
				style={{ width: '125px', height: '75px', objectFit: 'cover' }}
			/>
			<div className='me-auto'>
				<div>
					{product.name}{' '}
					{quantity > 1 && (
						<span
							className='text-muted'
							style={{ fontSize: '.65rem' }}
						>
							x{quantity}
						</span>
					)}
				</div>
				<div className='text-muted' style={{ fontSize: '.75rem' }}>
					{formatPrice(product.price)}
				</div>
			</div>
			<div>{formatPrice(product.price * quantity)}</div>
			<Button
				variant='outline-danger'
				size='sm'
				onClick={() => removeFromCart(product.id)}
			>
				&times;
			</Button>
		</Stack>
	);
}
