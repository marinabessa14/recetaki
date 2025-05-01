// DOM Elementos
const formSearch = document.getElementById('formSearch');
const inputSearch = document.getElementById('inputSearch');
const receitaList = document.getElementById('receitaList');
const receitaDetail = document.getElementById('receitaDetail');
const loading = document.getElementById('loading');
const installButton = document.getElementById('installButton');



// Mostrar/ocultar a bolinha de carregamento
const toggleLoading = (show) => {
    loading.classList.toggle('d-none', !show);
};

// Fetch API (themealdb) - Receitas 
const receitasSearch = async (term) => {
    toggleLoading(true);

    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
        );
        const data = await response.json();
        displayReceitas(data.meals || []);
    } catch (error) {
        console.error('Erro ao buscar receita:', error);
        displayReceitas([]);
    }
    toggleLoading(false);
};

// Exibir receitas em grade
const displayReceitas = (receitas) => {
    receitaList.classList.remove('d-none');
    receitaDetail.classList.add('d-none');

    receitaList.innerHTML = receitas.map(receita => `
        <div class="col">
            <div class="card h-100 receita-card" style="cursor: pointer;" onclick="showReceitaDetail('${receita.idMeal}')">
                <img src="${receita.strMealThumb}" class="card-img-top" alt="${receita.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${receita.strMeal}</h5>
                    <p class="card-text text-muted">
                        ${receita.strCategory} | ${receita.strArea}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
};

// Obter e exibir detalhes da receita
const showReceitaDetail = async (id) => {
    toggleLoading(true);

    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        const receita = data.meals[0];

        receitaList.classList.add('d-none');
        receitaDetail.classList.remove('d-none');

        receitaDetail.innerHTML = `
            <div class="col-12">
                <button class="btn btn-secondary mb-4" onclick="backToList()">
                    <i class="bi bi-arrow-left"></i> Voltar para Receitas
                </button>
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${receita.strMealThumb}" alt="${receita.strMeal}" 
                                class="img-fluid rounded-start" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h2 class="card-title">${receita.strMeal}</h2>
                                <p class="text-muted">
                                    <span class="badge bg-primary">${receita.strCategory}</span>
                                    <span class="badge bg-secondary">${receita.strArea}</span>
                                </p>
                                <h4>Instruções</h4>
                                <p class="card-text">${receita.strInstructions}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao buscar detalhes da receita', error);   
    }
    toggleLoading(false);
};

// Voltar a lista de receitas
const backToList = () => {
    receitaDetail.classList.add('d-none');
    receitaList.classList.remove('d-none');
};

// Evento para busca
formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    receitasSearch(inputSearch.value);
});

// Carrega receitas iniciais
receitasSearch('');




