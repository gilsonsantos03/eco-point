function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]");

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( (res) => {return res.json()})
        .then( states => {
            for (const state of states) {
               ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        });
}

populateUFs();

function getCities(event){
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");

    const ufValue = event.target.value;

    const indextOfSelectedState = event.target.selectedIndex;
    stateInput.value = event.target.options[indextOfSelectedState].text;

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

    // precisamos limpar as cidades dos options antes
    // pq ele estava acumulando qdo mudávamos o estado
    citySelect.innerHTML = "<option value>Selecione a cidade</option>";
    citySelect.disabled = true;

    fetch(url)
        .then( (res) => {return res.json()})
        .then( cities => {
            for (const city of cities) {
               citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false;
        })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities);


// itens de coleta 

// pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event){
    const itemLi = event.target;

    // adicionar ou remover uma classe com javaScript
    // tem add e remove, só que o toggle é mais dinâmico, pois ele vai ver se tem
    // ou não aquele elemento
    itemLi.classList.toggle("selected");

    const itemId = itemLi.dataset.id;

    // verificar se existem itens selecionados, se sim
    // pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( (item) => {
        const itemFound = item === itemId;
        return itemFound;
    });

    // se já estiver selecionado, tirar da seleção

    if (alreadySelected >= 0){
        const filteredItems = selectedItems.filter((item) => {
            const itemIsDifferent = item !== itemId;
            return itemIsDifferent;
        });

        selectedItems = filteredItems;
    } else {
    // se não estiver selecionado, adicionar a seleção
        selectedItems.push(itemId);
    }

    // atualizar o campo escondido com os itenss selecionados
    collectedItems.value = selectedItems;
}