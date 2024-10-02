let Categoria_delivros = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
const livrosContainer = document.getElementById('livros');
const livrosFavoritosExibicaoContainer = document.getElementById('livros-favoritos-exibicao');
const entrada = document.getElementById('entrada');
const loadingIndicator = document.getElementById('loading');
const favoritosTela = document.getElementById('favoritos-tela');
const voltarButton = document.getElementById('voltar');
const mostrarFavoritosButton = document.getElementById('mostrarFavoritos');

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=";

function buscar_livros(query) {
    const url = `${GOOGLE_BOOKS_API}${query}`;
    loadingIndicator.style.display = 'block';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            Categoria_delivros = data.items.map(item => ({
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors || ['Desconhecido'],
                publishedDate: item.volumeInfo.publishedDate || 'Data não disponível',
                description: item.volumeInfo.description || 'Descrição não disponível',
                thumbnail: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : ''
            }));
            exibirlivros(Categoria_delivros);
        })
        .catch(error => console.error("Erro ao buscar livros:", error))
        .finally(() => {
            loadingIndicator.style.display = 'none';
        });
}

function exibirlivros(livros) {
    livrosContainer.innerHTML = '';
    livros.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('livro-item');
        itemDiv.innerHTML = `
            <h3>${item.title}</h3>
            <div class="livro-info">
                <strong>Autores:</strong> ${item.authors.join(', ')}<br>
                <strong>Ano de Publicação:</strong> ${item.publishedDate}<br>
                <strong>Descrição:</strong> ${item.description}
            </div>
            ${item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.title}" class="book-cover">` : ''}
            <span class="estrela ${favoritos.includes(item.title) ? 'favorito' : ''}" title="Favorito">⭐</span>
        `;

        itemDiv.addEventListener('click', () => {
            toggleFavorito(item.title);
        });

        livrosContainer.appendChild(itemDiv);
    });
}

function toggleFavorito(titulo) {
    const index = favoritos.indexOf(titulo);
    const mensagemContainer = document.createElement('div');
    mensagemContainer.classList.add('mensagem');

    if (index === -1) {
        favoritos.push(titulo);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        mensagemContainer.textContent = `${titulo} foi salvo nos favoritos!`;
    } else {
        favoritos.splice(index, 1);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        mensagemContainer.textContent = `${titulo} foi removido dos favoritos.`;
    }

    exibirlivros(Categoria_delivros);
    livrosContainer.prepend(mensagemContainer);
    setTimeout(() => {
        mensagemContainer.remove();
    }, 2000);
}

function mostrarFavoritos() {
    livrosFavoritosExibicaoContainer.innerHTML = '';
    if (favoritos.length === 0) {
        livrosFavoritosExibicaoContainer.innerHTML = '<p>Nenhum favorito encontrado.</p>';
    } else {
        favoritos.forEach(titulo => {
            const favoritoDiv = document.createElement('div');
            favoritoDiv.textContent = titulo;
            livrosFavoritosExibicaoContainer.appendChild(favoritoDiv);
        });
    }

    document.querySelector('.container').style.display = 'none';
    favoritosTela.style.display = 'block';
}

mostrarFavoritosButton.addEventListener('click', mostrarFavoritos);
voltarButton.addEventListener('click', () => {
    favoritosTela.style.display = 'none';
    document.querySelector('.container').style.display = 'block';
});

entrada.addEventListener('input', function () {
    const query = this.value;
    if (query.length > 2) {
        buscar_livros(query);
    } else {
        livrosContainer.innerHTML = '';
    }
});

buscar_livros('romance');
