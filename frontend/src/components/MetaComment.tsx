import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MetaCommentBox = ()=> {
    const [comments, setComments] = React.useState([]);

    useEffect(()) => {
        setTimeout(() => {
            fetchComments();
            verifyBD();
        }, 100);
    }, []);

    function

    // Check in database if there are comments from metacritic scrapped
    const verifyBD = () => {
        axios.get(`http://localhost:3000/api/metacritic/${game_slug}`)
        if (res.data.length > 0) {
            setComments(res.data);
        } else {
            fetchComments(); // If there are no comments in the database, fetch them from metacritic
