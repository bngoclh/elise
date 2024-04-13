import { Button, ButtonGroup, Heading, IconButton } from '@chakra-ui/react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdRemove } from 'react-icons/io';
import { useParams } from 'react-router-dom';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [favGames, setFavGames] = useState([]);
  const token = localStorage.getItem('jwtToken');

  // Get all favorite games of the user
  useEffect (() => {
    axios.get(`http://localhost:3000/api/users/favGames/${userId}`,
    {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    }
    )
    .then(res => {
      setFavGames(res.data);
    })
    .catch(err => {
      console.error(err);
    });
  }
  , []);


  const handleGameDetails = gameSlug => {
    // Redirect to the game details page
    //window.location.href = `/game/${gameSlug}`;
    console.log('Redirecting to game details page');
  }

  const handleRemoveFromFavList = (gameSlug) => { //Added gameSlug parameter here
    // Remove the game from the favorite list
    axios.delete(`http://localhost:3000/api/users/favGames/${userId}/${gameSlug}`, {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })

    .then(res => {
      console.log('Game removed from favorite list');
      setFavGames(prevFavGames => prevFavGames.filter(game => game.gameSlug !== gameSlug));
    })
    .catch(err => {
      console.error('Error removing game from favorite list:', err.response.data);
    });
  };


  return (
    <>
      <Heading marginBottom={5}>
        Your list of favorite games
      </Heading>

      {/* Display the list of favorite games */}
      {favGames.map((game) => (
        <div key={game.gameSlug}>
          <ButtonGroup size='md' isAttached variant='outline' mb={2}>
            <Button 
              onClick={() => handleGameDetails(game.gameSlug)}
              // mr={2} // Add margin right for spacing between button and icon button
            >
              {game.gameName}
            </Button>
            <IconButton 
              aria-label='Remove from favorite list' 
              icon={<IoMdRemove />}
              onClick={() => handleRemoveFromFavList(game.gameSlug)} 
            />
          </ButtonGroup>
        </div>
      ))}

  </>
  )
}

export default UserProfilePage;