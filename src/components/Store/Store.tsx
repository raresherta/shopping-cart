import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import StoreItem from '../StoreItem/StoreItem';
import { useShoppingCart } from '../../context/ShoppingCartContext';

const Store: React.FC = () => {
	const { getItems, products } = useShoppingCart();
	useEffect(() => {
		getItems();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<h1>Products</h1>
			<Row md={2} xs={1} lg={3} className='g-3'>
				{products.map((product: any) => (
					<Col key={product.id}>
						<StoreItem {...product} />
					</Col>
				))}
			</Row>
		</div>
	);
};

export default Store;
