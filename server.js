import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
// Note: For `path`, and other Node built-ins, you might need the 'node:' protocol prefix in imports
// Example: import path from 'node:path';

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
