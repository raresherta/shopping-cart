import { Card, Button } from 'react-bootstrap';
import { formatPrice } from '../../utils/formatPrice';
import { useShoppingCart } from '../../context/ShoppingCartContext';

type Product = {
	id: number;
	name: string;
	imageUrl: string;
	supplierId: number;
	wholesalePrice: number;
	price: number;
	categories: string[];
};

export default function StoreItem({ id, name, imageUrl, price }: Product) {
	const {
		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart
	} = useShoppingCart();
	const quantity = getItemQuantity(id);
	return (
		<Card className='h-100'>
			<Card.Img
				variant='top'
				src={imageUrl}
				height='200px'
				style={{ objectFit: 'cover' }}
			/>
			<Card.Body className='d-flex flex-column'>
				<Card.Title className='d-flex justify-content-between align-items-baseline mb-4'>
					<span className='fs-2'>{name}</span>
					<span className='fs-2 ms-2 text-muted'>
						{formatPrice(price)}
					</span>
				</Card.Title>
				<div className='mt-auto'>
					{quantity === 0 ? (
						<Button
							className='bg-secondary w-100'
							onClick={() => increaseCartQuantity(id)}
						>
							+ Add To Cart
						</Button>
					) : (
						<div
							className='d-flex align-items-center flex-column'
							style={{ gap: '.5rem' }}
						>
							<div
								className='d-flex align-items-center justify-content-center'
								style={{ gap: '.5rem' }}
							>
								<Button
									className='bg-secondary'
									onClick={() => decreaseCartQuantity(id)}
								>
									-
								</Button>
								<div>
									<span className='fs-3'>{quantity}</span> in
									cart
								</div>
								<Button
									className='bg-secondary'
									onClick={() => increaseCartQuantity(id)}
								>
									+
								</Button>
							</div>
							<Button
								variant='danger'
								size='sm'
								onClick={() => removeFromCart(id)}
							>
								Remove
							</Button>
						</div>
					)}
				</div>
			</Card.Body>
		</Card>
	);
}
