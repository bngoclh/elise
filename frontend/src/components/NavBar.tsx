import { HStack, Hide, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import useGameQueryStore from '../store';
import ColorModeSwitch from './ColorModeSwitch';
import MenuBar from './MenuBar';
import SearchInput from './SearchInput';

const NavBar = () => {
	const navigate = useNavigate();
	const resetGameQuery = useGameQueryStore((s) => s.resetGameQuery);

	const onClickAllGames = () => {
		navigate('/');
		resetGameQuery();
	};
	return (
		<>
			<HStack justifyContent='space-between' spacing={4} marginY={4}>
				<Image
					src={logo}
					boxSize='60px'
					cursor='pointer'
					onClick={onClickAllGames}
					borderRadius='10'
				/>
				<SearchInput />
				<ColorModeSwitch />
				<Hide above='lg'>
					<MenuBar />
				</Hide>
			</HStack>
		</>
	);
};

export default NavBar;
