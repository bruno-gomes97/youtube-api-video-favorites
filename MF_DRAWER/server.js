const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

let favorites = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=AIzaSyDRTe9EGA5SjMlikjZti9yfyHWRKIwW_X8`);
    const data = await response.json();
    res.json(data);
});

app.post('/favorites/add', (req, res) => {
    const videoId = req.query.videoId; // Obtém o ID do vídeo a ser adicionado aos favoritos
    if (!favorites.includes(videoId)) {
        favorites.push(videoId); // Adiciona o vídeo à lista de favoritos, se ainda não estiver presente
    }
    res.sendStatus(200); // Envie uma resposta de sucesso
});

app.post('/favorites/remove', (req, res) => {
    const videoId = req.query.videoId; // Obtém o ID do vídeo a ser removido dos favoritos
    favorites = favorites.filter(id => id !== videoId); // Remove o vídeo da lista de favoritos
    res.sendStatus(200); // Envie uma resposta de sucesso
});

app.get('/favorites', (req, res) => {
    res.json(favorites);
});

app.get('/favorites/count', (req, res) => {
    res.json({ count: favorites.length });
});

app.get('/videos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'videos.html'));
});

app.get('/', (req, res) => {
    res.redirect('/videos');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
