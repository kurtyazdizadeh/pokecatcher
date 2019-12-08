class List {
  constructor(elementConfig){
    this.processPokemonFromServer = this.processPokemonFromServer.bind(this);

    this.pokemon = [];
    this.domElements = {
      phone: $(elementConfig.phone),
      minPokemon: $(elementConfig.minPokemon),
      maxPokemon: $(elementConfig.maxPokemon),
      searchButton: $(elementConfig.searchButton),
      searchResults: $(elementConfig.searchResults)
    };

  }
  // addEventListeners(){

  // }
  // handleSearch(){

  // }
  getPokemonFromServer(){
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/?limit=1000`,
      type: "GET",
      dataType: "JSON"
    }).done(this.processPokemonFromServer)
      .fail(this.failedPokemonFromServer);
  }
  processPokemonFromServer(response){
    this.loadPokemon(response.results)
  }
  failedPokemonFromServer(xhr){
    console.error("failedPokemonFromServer error: ", xhr);
  }

  loadPokemon(pokemonArray){
    pokemonArray.forEach(pokemon => this.addPokemon(pokemon));
  }
  addPokemon(pokemonData){
    var pokemon = new Pokemon( pokemonData, { click: this.handlePokemonClick });
    this.pokemon.push(pokemon);
    return this.pokemon.length;

  }
  handlePokemonClick(){
   //this will eventually handle the click
   //that represents the selection the user makes from list
   console.log("click goes here");
  }
}
