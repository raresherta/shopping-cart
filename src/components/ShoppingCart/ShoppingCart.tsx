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
	const cost = addShippingCost(cartQuantity);

	useEffect(() => {
		if (discountCode === couponCode[0].Code) {
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
		return formatPrice(totalPrice);
	}

	function submitDiscountCode() {
		couponCode.forEach(code => {
			if (code.Code === inputValue) {
				setDiscountCode(inputValue);
			}
		});
	}

	const submitProducts = async () => {
		couponCode.forEach(code => {
			if (code.Code === inputValue) {
				setDiscountCode(inputValue);
			}
		});

		const updatedCartItems = cartItems.map(item => ({
			productId: item.id,
			unitQuantity: item.quantity
		}));

		const body = {
			items: updatedCartItems,
			couponCode: discountCode
		};

		try {
			const response = await fetch(
				'https://man-shopping-cart-test.azurewebsites.net/api/Cart/CalculateCost',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ data: body })
				}
			);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

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
							{shippingCost === 0 ? 'FREE' : formatPrice(cost)}
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
							onClick={submitProducts}
						>
							{'BUY'}
						</Button>
					</div>
				</div>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
