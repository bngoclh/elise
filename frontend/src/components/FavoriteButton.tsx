import { Button, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdFavorite } from "react-icons/md";
import useLogin from '../hooks/useLogin';
import axios from 'axios';

const FavoriteButton = (props)=> {
  const [isFav, setIsFav] = useState(false);
  const { isAuthenticated, user, token } = useLogin();

  useEffect(() => {
    if (user) {
    axios.get(`http://localhost:3000/api/users/${user._id}`, {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(res => {
      const gameSlug = props.slug;
      res.data.favGames.forEach((game: {gameSlug: String, gameName: String}) => {
        if (game.gameSlug === gameSlug) {
          setIsFav(true);
          return;
        }
      });
    })
  }}, [user]);

  const handleAddtoFav = () => {
    axios.post(`http://localhost:3000/api/users/favGames/${user?._id}`, {
        gameName: props.gameName,
        gameSlug: props.slug
  }, {
      headers: {
        'Authorization' : `Bearer ${token}`
    },
    
    })
  
      .then(res => {
        console.log("POST request to add to favorite list");
        setIsFav(!isFav);
      })
      .catch(err => {
        console.error(err);
      });
  }

    return (
    <Button 
      rightIcon={<MdFavorite />} 
      style={{marginTop:10, marginBottom:20}}
      colorScheme='white' variant='outline'
      onClick={handleAddtoFav}
      isDisabled={isFav || !isAuthenticated}
    >
        
      {isAuthenticated ? (isFav ? 'Added' : 'Add to Favorite List') : "Please login to add to favorite list"}
    
    </Button>
  )};

export default FavoriteButton;