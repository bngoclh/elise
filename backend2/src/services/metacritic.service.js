const puppeteer = require('puppeteer');
const MetacriticComment = require('../models/metacritic.comments.model');

// Scraping comments from Metacritic
exports.scrapeComment = async (req, res, next) => {
    const { game_slug } = req.body;
    const url = `https://www.metacritic.com/game/${game_slug}/critic-reviews`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const comments = await page.evaluate(() => {
        const commentsList = [];
        const commentElements = document.querySelectorAll('.review_body');
        commentElements.forEach(commentElement => {
            commentsList.push(commentElement.innerText);
        });
        return commentsList;
    });
    await browser.close();
    res.json({ commentsList: comments });
}

exports.verifyComment = async (req, res, next) => {
    const { gameId } = req.params;
    const metacriticComment = await MetacriticComment.findOne({ game_slug : gameId });
    if (metacriticComment) {
        res.json(metacriticComment);
    } else {
        res.status(404).json({ message: "No comments found for this game" });
    }
}

// POST add new comments from Metacritic to the database as array instead of json
exports.addMetacriticComment = async (req, res, next) => {
    const { game_slug, commentsList } = req.body;
    const metacriticComment = new MetacriticComment({
        game_slug: game_slug,
        commentsList: commentsList
    });
    await metacriticComment.save();
    res.json(metacriticComment);
}



// Scrapping comments from Metacritic Thomas style

// exports.scrapeComment: async (req, res, next) => {

//     //const url = req.params.urlId;
//     try {
//         const { url } = req.body;
//         // Use the url to scrape data
//         // Implement your scraping logic here

//         const response = await axios.get(url);
//         const html = response.data;

     
//             // Use puppeteer to scrape data
//             const browser = await puppeteer.launch();
//             const page = await browser.newPage();
//             await page.goto(url);

//             // Implement your scraping logic here using puppeteer
//             const userQuotes = await page.$$eval('.c-gameReview_quote_criticQuote', quotes => quotes.map(quote => quote.textContent));
//             //const userQuotes = await page.$$eval('.c-siteReview_quote g-outer-spacing-bottom-small', quotes => quotes.map(quote => quote.textContent));


            
//              //console.log(userQuotes);

//             await browser.close();

//             res.json({ quotes: userQuotes });
//           // Return the JSON object with the extracted information
    
//         // Use the secondElement for further processing
//         // Use the response data to extract the desired information
//         // Implement your scraping logic here
        
//         //res.json({ message: "Scraping completed" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "An error occurred" });
//     }
// },

// verifyComment: async (req, res, next) => {
//     try {
//         const { gameId } = req.params;
//         const comments = await MetacriticComment.find({ game: gameId });
//         res.json({ comments });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "An error occurred" });
//     }
// },


// // Permet d'ajouter un commentaire metacritic dans le front
// addMetacriticComment: async (req, res, next) => {
//     try {
//         const {comment1, comment2, comment3, game } = req.body;
//         const commentsList = [comment1, comment2, comment3];

//         const newMetacriticComment = new MetacriticComment({ game, commentsList });
//         const savedMetacriticComment = await newMetacriticComment.save();
//         res.json({ message: "Metacritic comment added!", comment: savedMetacriticComment });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "An error occurred" });
//     }
// }
