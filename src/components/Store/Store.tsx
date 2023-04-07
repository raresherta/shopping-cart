import React, { useEffect } from 'react';
import { Col, Row, Dropdown, Stack } from 'react-bootstrap';
import StoreItem from '../StoreItem/StoreItem';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

const Store: React.FC = () => {
	const {
		getItems,
		products,
		sortProductsAlphabetically,
		sortProductsByPrice,
		filterByCategory
	} = useShoppingCart();
	useEffect(() => {
		getItems();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Stack direction='horizontal' gap={3}>
				<h1>Products</h1>
				<Dropdown className='ms-auto'>
					<Dropdown.Toggle
						className='bg-secondary'
						id='dropdown-basic'
					>
						Filter
					</Dropdown.Toggle>

					<DropdownMenu>
						<DropdownItem onClick={() => filterByCategory('')}>
							All
						</DropdownItem>
						<DropdownItem
							onClick={() => filterByCategory('accessory')}
						>
							Filter by Accessory
						</DropdownItem>
						<DropdownItem
							onClick={() => filterByCategory('electronic')}
						>
							Filter by Electronic
						</DropdownItem>
						<DropdownItem onClick={() => filterByCategory('audio')}>
							Filter by Audio
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<Dropdown>
					<Dropdown.Toggle
						className='bg-secondary'
						id='dropdown-basic'
					>
						Sort
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item onClick={sortProductsAlphabetically}>
							Alphabetically
						</Dropdown.Item>
						<Dropdown.Item onClick={sortProductsByPrice}>
							Prices
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Stack>
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
