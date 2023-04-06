import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Home } from './components/Home/Home';
import Store from './components/Store/Store';
import { Navbar } from './components/Navbar/Navbar';
import { ShoppingCartProvider } from './context/ShoppingCartContext';

function App() {
	return (
		<ShoppingCartProvider>
			<Navbar />
			<Container className='mb-4'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/store' element={<Store />} />
				</Routes>
			</Container>
		</ShoppingCartProvider>
	);
}

export default App;
