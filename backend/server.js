const express = require('express');
const cheerio = require('cheerio'); // Parses and extracts content from the HTML.
// const stopword = require('stopword');
const cors = require('cors'); // useful for frontend-backend communication.




const app = express();
const PORT = 3000;

// apply middlewares
app.use(cors());
app.use(express.json());

// POST endpoint to analyze URL
app.post('/analyze', async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    // console.log(url);


    try {
        // const { default: fetch } = await import('node-fetch');
        const response = await fetch(url);
        // console.log(response);

        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch the page content' });
        }

        const html = await response.text();

        // Use a cheerio to extract the content
        const $ = cheerio.load(html);
        // Loads the HTML response into Cheerio and extracts all text within the <body> tag, ignoring HTML elements.
        const text = $('body').text();


        // Split by spaces and commas, then filter for words with at least 2 characters
        const words = text
        .split(/[\s,;.!?(){}\[\]<>:"'|\/\\+=*%&#@~`$^_—–]+/)  // Split by all listed separators
        .filter(word => /^[a-zA-Z]{2,}$/.test(word));  

        // console.log(words); // Output the words from the body section
        // words is a array of string we want the word frequency count 
        // Using the reduce method to count the frequency of each word

        const mymap = {};

// Count occurrences of each word
const normalizedWords = words.map(word => word.toLowerCase());
normalizedWords.forEach((word) => {
    mymap[word] = (mymap[word] || 0) + 1;
});


const sortedWords = Object.entries(mymap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word, frequency]) => ({ word, frequency }));

        res.json({ data: sortedWords });

    } catch (error) {
        // Handle any errors during fetch or processing
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch or process the page content' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
