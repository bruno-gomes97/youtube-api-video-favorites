const initializeVideoSearch = () => {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    const videoList = document.getElementById('video-list');

    if (!searchInput || !searchBtn || !videoList) {
        console.error('One or more elements not found: searchInput, searchBtn, videoList');
        return;
    }

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (!query) {
            return;
        }
        fetch(`/api/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                videoList.innerHTML = '';
                if (!data.items || data.items.length === 0) {
                    videoList.innerHTML = '<p>No results found.</p>';
                    return;
                }
                data.items.forEach(video => {
                    const videoItem = document.createElement('div');
                    videoItem.className = 'video-item';
                    videoItem.innerHTML = `
                        <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
                        <span>${video.snippet.title}</span>
                        <button class="favorite-btn" data-video-id="${video.id.videoId}">&#9734;</button>
                    `;
                    videoList.appendChild(videoItem);
                });
                attachFavoriteEventListeners();
            });
    });

    const attachFavoriteEventListeners = () => {
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', () => {
                const videoId = button.getAttribute('data-video-id');
                if (button.classList.contains('favorited')) {
                    // Se já estiver favoritado, remove dos favoritos
                    fetch(`/favorites/remove?videoId=${videoId}`, { method: 'POST' })
                        .then(() => {
                            button.classList.remove('favorited');
                        })
                        .catch(error => {
                            console.error('Erro ao remover vídeo dos favoritos:', error);
                        });
                } else {
                    // Se não estiver favoritado, adiciona aos favoritos
                    fetch(`/favorites/add?videoId=${videoId}`, { method: 'POST' })
                        .then(() => {
                            button.classList.add('favorited');
                        })
                        .catch(error => {
                            console.error('Erro ao adicionar vídeo aos favoritos:', error);
                        });
                }
            });
        });
    };   
};

document.addEventListener('DOMContentLoaded', initializeVideoSearch);
