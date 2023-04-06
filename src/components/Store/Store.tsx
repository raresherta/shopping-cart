import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import StoreItem from '../StoreItem/StoreItem';

const Store: React.FC = () => {
	const [products, setProducts] = useState<any>([]);
	useEffect(() => {
		const fetchData = async () => {
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

		fetchData();
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
