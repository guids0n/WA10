
document.addEventListener('DOMContentLoaded', () => {

    const botaoMenu = document.getElementById('menu-hamburguer');
    const menuLateral = document.getElementById('menu-lateral');
    
    if (botaoMenu && menuLateral) {
        const todosOsLinksMobile = menuLateral.querySelectorAll('a');

   
        botaoMenu.addEventListener('click', () => {
            menuLateral.classList.toggle('ativo');
            botaoMenu.classList.toggle('ativo');
        });

        todosOsLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                menuLateral.classList.remove('ativo');
                botaoMenu.classList.remove('ativo');
            });
        });
    }

    const searchBtn = document.getElementById('botao-pesquisa');
    const searchContainer = document.getElementById('pesquisa-container');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchContainer && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchContainer.classList.toggle('ativo');
            if (searchContainer.classList.contains('ativo')) {
                searchInput.focus();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (searchContainer && !searchContainer.contains(e.target) && searchContainer.classList.contains('ativo')) {
            searchContainer.classList.remove('ativo');
        }
    });
});