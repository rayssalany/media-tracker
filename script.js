const API_KEY = '97e3008c636bd4be4e2480dd20dedb19';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIES_URL = BASE_URL + '/movie/popular?api_key=' + API_KEY + '&language=pt-BR';
const TVSHOWS_URL = BASE_URL + '/tv/popular?api_key=' + API_KEY + '&language=pt-BR';

let currentFilter = 'All';

async function fetchAll(filter = 'All') {
    const [movies, shows] = await Promise.all([
        fetch(MOVIES_URL).then(r => r.json()),
        fetch(TVSHOWS_URL).then(r => r.json())
    ]);
    const data = {
        'All': [...movies.results, ...shows.results],
        'Movies': movies.results,
        'TV Shows': shows.results
    }
    displayContent(data[filter]);
}

const searchInput = document.querySelector('input[type="search"]');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query.length > 2) {
        searchContent(query);
    } else if (query.length === 0) {
        fetchAll();
    }
});

async function searchContent(query) {

    const endpointMapping = {
        'All': '/search/multi',
        'Movies': '/search/movie',
        'TV Shows': '/search/tv'
    };

    const endpoint = endpointMapping[currentFilter] || '/search/multi';
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR&query=${query}`);
    const data = await response.json();

    if (data.results.length === 0) {
        const content = document.querySelector('#content');
        content.innerHTML = `<p id="not-found">Nenhum resultado encontrado para "${query}".</p>`;
        return;
    }
    
    displayContent(data.results);
}
    
document.querySelectorAll('#lower-list a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        document.querySelectorAll('#lower-list a').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.textContent.trim();

        const query = searchInput.value.trim();

        if (query.length > 2) {
            searchContent(query);
        } else {
            fetchAll(currentFilter); 
        }
    });
});

function displayContent(items) {
    const content = document.querySelector('#content');
    content.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${IMG_URL}${item.poster_path}" alt="${item.title || item.name}">
            <span class="tag">${item.title ? 'Movie' : 'TV Show'}</span>
            <h3>${item.title || item.name}</h3>
            <p> ⭐ ${item.vote_average.toFixed(1)} </p>
        `;
        content.appendChild(card);
    });
}



fetchAll();