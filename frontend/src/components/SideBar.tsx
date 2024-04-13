import { Heading, Link, Stack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import GenreList from './GenreList';
import useGameQueryStore from '../store';
import BrowseList from './BrowseList';
import ParentPlatformList from './ParentPlatformList';
import AuthCredential from './AuthCredential';

const SideBar = ()=> {
	const navigate = useNavigate();
	const resetGameQuery = useGameQueryStore((s) => s.resetGameQuery);

	const onClickAllGames = () => {
		navigate('/');
		resetGameQuery();
	}

	const { userId } = useParams();

	return (
		<Stack spacing={4}>
			<Link>
				<Heading marginBottom={2} cursor='pointer' onClick={onClickAllGames}>
					All Games
				</Heading>
			</Link>
			
			<AuthCredential userId={userId}/>

			<BrowseList />
			<ParentPlatformList />
			<GenreList />
		</Stack>
	);
};

export default SideBar;
