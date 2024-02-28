import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

// Create an Express application and listen on port 3000
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the index.html file when a user visits the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Create an API endpoint to fetch restaurants
app.get('/api/restaurants', async (req, res) => {
    try {
        const url = 'https://uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode/EC4M7RF';
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({error: 'An error occurred'});
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
