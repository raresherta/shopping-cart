import { useEffect, useState } from 'react';

import { Offcanvas, Stack, Button } from 'react-bootstrap';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import { CartItem } from '../CartItem/CartItem';
import { formatPrice } from '../../utils/formatPrice';
import couponCode from '../../data/CouponCode.json';
import './ShoppingCart.css';

type ShoppingCartProps = {
	isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
	const { closeCart, cartItems, products, cartQuantity } = useShoppingCart();
	const [inputValue, setInputValue] = useState('');
	const [discountCode, setDiscountCode] = useState('');
	const [shippingCost, setShippingCost] = useState(0);

	useEffect(() => {
		if (discountCode === 'freeShipping!') {
			setShippingCost(0);
		} else {
			setShippingCost(addShippingCost(cartQuantity));
		}
	}, [discountCode, cartQuantity]);

	function addShippingCost(num: number) {
		if (num < 20) {
			return 7;
		} else if (num < 40) {
			return 5;
		} else {
			return 0;
		}
	}

	function calculateTotalPrice() {
		const totalItemsPrice = cartItems.reduce((total, cartItem) => {
			const item = products.find((i: any) => i.id === cartItem.id);
			return total + (item?.price || 0) * cartItem.quantity;
		}, 0);

		const totalPrice = totalItemsPrice + shippingCost;

		console.log('TOTAL PRICE', totalPrice);

		return formatPrice(totalPrice);
	}

	function submitDiscountCode() {
		const freeShippingCode = couponCode.find(
			item => item.Code === 'freeShipping!'
		);

		if (freeShippingCode?.Code === inputValue) {
			console.log('inputValue', inputValue);
			setDiscountCode('freeShipping!');
		} else {
			setDiscountCode('');
		}
	}

	return (
		<Offcanvas show={isOpen} onHide={closeCart} placement='end'>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Cart</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body style={{ position: 'relative' }}>
				<Stack
					gap={3}
					className={`${cartItems.length === 0 ? 'd-none' : ''}`}
				>
					{cartItems.map(item => (
						<CartItem key={item.id} {...item} />
					))}
					<div className='d-flex justify-content-end fs-7'>
						<span style={{ paddingRight: '8px' }}>
							Shipping Cost{''}
						</span>
						<span>
							{shippingCost === 0
								? 'FREE'
								: addShippingCost(cartQuantity)}
						</span>
					</div>
					<div className='ms-auto fw-bold fs-5'>
						Total {calculateTotalPrice()}
					</div>
				</Stack>
				<div className='offcanvas-footer'>
					<input
						placeholder='Apply Discount Code'
						className='coupon-code-input'
						onChange={e => setInputValue(e.target.value)}
					/>
					<div className='coupon-code'>
						<Button
							type='submit'
							className='btn-success coupon-code-btn'
							onClick={submitDiscountCode}
						>
							{'Submit Discount Code'}
						</Button>

						<Button
							type='submit'
							className='btn-success submit-button'
						>
							{'BUY'}
						</Button>
					</div>
				</div>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
