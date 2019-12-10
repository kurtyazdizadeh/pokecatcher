$(document).ready(initializeApp);

var list;

function initializeApp(){
  list = new List({
    phone: "#phoneNumber",
    minPokemon: "#minPokemon",
    maxPokemon: "#maxPokemon",
    name: "#name",
    searchButton: ".btn-search",
    searchResults: "#searchResults",
    modal: "#myModal"
  })

  list.addEventListeners();
  list.getPokemonFromServer();
}
