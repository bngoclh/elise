import { Button, Stack, Text } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import axios from 'axios';


const CommentBox = ({ game_id, game_slug }: { game_id: number, game_slug: string }) => {
        let [value, setValue] = React.useState('')
        let [comments, setComments] = React.useState([]);

        // Get all comments when the component mounts
        useEffect(() => {
            axios.get(`http://localhost:3000/api/comments/game/${game_id}`)
            .then(res => {
                setComments(res.data);
            }).catch(err => {
                console.error(err);
            });
        }, []);

// The target of this event is the textarea element itself, and value is the current text in the textarea.
        let handleInputChange = (e: any) => {
            let inputValue = e.target.value
            setValue(inputValue)
        }

        let handleSubmitComment = () => {
            if (value.trim() !== '') {
                // Create a new comment object
                const newComment = {
                    game_id: game_id,
                    game_slug: game_slug,
                    text: value
                };

                const token = localStorage.getItem('jwtToken');
                // Send a POST request to the server to create a new comment
                axios.post('http://localhost:3000/api/comments', newComment, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    // Add the new comment to the comments array
                    // and add this new comment to the top of the comments array
                    setComments([res.data.comment, ...comments]);
                    setValue('');
                }).catch(err => {
                    alert(err.response.data.message);
                });
            }
        };
        

        return (
            <>
                <Text style={{marginTop:50, marginBottom:20, fontWeight: 'bold', fontSize: '1.2em', color: 'grey' }}>
                    Comment: 
                </Text>
                <Textarea
                    value={value}
                    onChange={handleInputChange}
                //Disabled is set to False when user is loggged in
                    isDisabled={false}
                    placeholder='Write your comment here...'
                    size='sm'
                />

                <Stack direction='row' spacing={4}>
                    <Button style={{marginTop:20, marginBottom:20}}
                        isLoading={false}
                        isDisabled={value.trim() === ''}
                        loadingText='Submitting'
                        colorScheme='white'
                        variant='outline'
                        onClick={handleSubmitComment}
                    >
                    Submit
                    </Button>
                </Stack>

                {/*La liste des commentaires d'autres utilisateurs*/}
                 <div>
                {comments.map(comment => (
                    <div key={comment._id}>
                        <p><strong>{comment.username}</strong>: {comment.text}</p>
                    </div>
                ))}
                </div>

            </>
        );
    }   
    export default CommentBox;
