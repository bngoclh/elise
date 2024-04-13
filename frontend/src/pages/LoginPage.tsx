import { Heading} from '@chakra-ui/react';
import {
    Button,
    InputGroup,
    InputRightElement,
  } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';

function PasswordInput(props: {password: string, setPassword: (password: string) => void}){
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)
  
    return (
      <InputGroup size='md'>
        <Input
          pr='4.5rem'
          type={show ? 'text' : 'password'}
          placeholder='Enter password'
          onChange={(event) => props.setPassword(event.target.value)} value={props.password}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
    )
  }

const LoginPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [newUsername, setNewUsername] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [newName, setNewName] = React.useState('');

    const handleLogin = () => {
        // Get the email and password from the form
        axios.post('http://localhost:3000/api/auth', {
            username: username,
            password: password
        })
            .then(res => {
                // Save the token in localStorage
                localStorage.setItem('jwtToken', res.data.token);
    
                // Redirect to the home page
                window.location.href = '/';
            })
            .catch(err => {
                // Print the error message from the server
                alert(err.response.data.message);
            });
        };

    const handleCreateAccount = () => {
        // Get the email and password from the form
        axios.post('http://localhost:3000/api/users', {
            username: newUsername,
            password: newPassword,
            name: newName
        })
            .then(res => {
                alert(res.data.message);
            })
            .catch(err => {
                // Print the error message from the server
                alert(err.response.data.message);
            });
    };

    return (
        <>
            <Heading fontSize='7xl'>Login</Heading>
        
            <Grid templateColumns='repeat(5, 1fr)' gap={30}>
            <GridItem w='100%' colSpan={2}>
                <Stack spacing={3} style={{marginTop: 10}}>
                    <Input variant='outline' size='md' placeholder='name' onChange={(event) => setNewName(event.target.value)} value={newName}/>
                    <Input variant='outline' size='md' placeholder='username' onChange={(event) => setNewUsername(event.target.value)} value={newUsername}/>
                    <PasswordInput password={newPassword} setPassword={setNewPassword}/>
                    <Button h='1.75rem' size='sm' onClick={handleCreateAccount}>
                        Create account
                    </Button>
                </Stack>
            </GridItem>
        
            <GridItem w='100%' colStart={4} colEnd={6}>
                <Stack spacing={3} style={{marginTop: 10}}>
                    <Input variant='outline' size='md' placeholder='username' onChange={(event) => setUsername(event.target.value)} value={username}/>
                    <PasswordInput password={password} setPassword={setPassword}/>
                    <Button h='1.75rem' size='sm' onClick={handleLogin}>
                        Login
                    </Button>
                </Stack>
            </GridItem>
            </Grid>
        
        </>
    );
}

export default LoginPage;