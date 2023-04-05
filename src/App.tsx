import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Home } from './components/Home/Home';
import { Store } from './components/Store/Store';

function App() {
	return (
		<Container className='mb-4'>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/store' element={<Store />} />
			</Routes>
		</Container>
	);
}

export default App;
