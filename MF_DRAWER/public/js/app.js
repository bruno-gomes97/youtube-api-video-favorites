document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const favoriteCount = document.getElementById('favorite-count');

    const updateFavoriteCount = () => {
        fetch('/favorites/count')
            .then(response => response.json())
            .then(data => {
                favoriteCount.textContent = `Favoritos: ${data.count}`;
            });
    };

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash === 'videos') {
            loadVideosPage();
        } else if (hash === 'favoritos') {
            loadFavoritesPage();
        }
    });

    const loadVideosPage = () => {
        fetch('/videos')
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
                updateFavoriteCount();
                initializeVideoSearch(); // Initialize video search after loading the videos page
            });
    };

    const loadFavoritesPage = () => {
        fetch('/favorites')
            .then(response => response.json())
            .then(favorites => {
                content.innerHTML = '<h2>Favoritos</h2>';
                if (favorites.length === 0) {
                    content.innerHTML += '<p>No favorites yet.</p>';
                    return;
                }
                favorites.forEach(videoId => {
                    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyDRTe9EGA5SjMlikjZti9yfyHWRKIwW_X8`)
                        .then(response => response.json())
                        .then(data => {
                            const video = data.items[0];
                            const videoItem = document.createElement('div');
                            videoItem.className = 'video-item';
                            videoItem.innerHTML = `
                                <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
                                <span>${video.snippet.title}</span>
                                <button class="favorite-btn favorited" data-video-id="${video.id}">&#9733;</button>
                            `;
                            content.appendChild(videoItem);
                        });
                });
                updateFavoriteCount();
            });
    };

    if (window.location.hash) {
        window.dispatchEvent(new Event('hashchange'));
    } else {
        window.location.hash = '#videos';
    }

    updateFavoriteCount();
});
