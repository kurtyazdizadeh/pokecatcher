class List {
  constructor(elementConfig){
    this.processPokemonFromServer = this.processPokemonFromServer.bind(this);
    this.handleFilterAndSorting = this.handleFilterAndSorting.bind(this);
    this.handlePokemonClick = this.handlePokemonClick.bind(this);


    this.pokemonList = [];
    this.domElements = {
      phone: $(elementConfig.phone),
      minPokemon: $(elementConfig.minPokemon),
      maxPokemon: $(elementConfig.maxPokemon),
      name: $(elementConfig.name),
      searchButton: $(elementConfig.searchButton),
      searchResults: $(elementConfig.searchResults)
    };

    this.playerPokemon = {};
    this.opponentPokemon = {};

  }
  addEventListeners(){
    this.domElements.minPokemon.keydown(this.checkKeydown);
    this.domElements.maxPokemon.keydown(this.checkKeydown);
    this.domElements.searchButton.click(this.handleFilterAndSorting);
  }

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
    pokemonArray.forEach(v => this.addPokemon(v));
  }
  addPokemon(pokemonData){
    var pokemon = new Pokemon( pokemonData, { click: this.handlePokemonClick });
    pokemon.data.id = pokemon.data.url.slice(
        //some ID numbers don't match index+1 (ex: this.pokemonList[930])
        //this ensures it gets the right ID to get details from API later
        pokemon.data.url.lastIndexOf("n/")+2,
        pokemon.data.url.length-1
    )
    this.pokemonList.push(pokemon);
    return this.pokemonList.length;
  }

  // getEverythingFromServer() {
  //   Promise.all(this.pokemonList.forEach(v => v.getDetailsFromServer))
  //     .then(() => console.log("Pokemon Details Loaded"))
  //     .catch(() => console.log("Promises failed"))
  // }

  checkKeydown(e) {
    switch (e.target.id) {
      case "minPokemon":
        if ((e.which >= 48 && e.which <= 57) ||
          (e.which == 8) || (e.which == 9)) {
          return e;
        } else {
          e.preventDefault()
        }
        break;
      case "maxPokemon":
        if ((e.which >= 48 && e.which <= 57) ||
          (e.which == 8) || (e.which == 9)) {
          return e;
        } else {
          e.preventDefault()
        }
        break;
    }
  }
  handleFilterAndSorting(e) {
    var dom = this.domElements;

    var name = dom.name.val().toLowerCase();
    var minPokemon = parseInt( dom.minPokemon.val() );
    var maxPokemon = parseInt( dom.maxPokemon.val() );

    var filteredList = this.pokemonList;

    if (name) {
      filteredList = filteredList.filter(pokemon =>
        pokemon.data.name.toLowerCase().includes(name)
      )
    }
    if (minPokemon) {
      filteredList = filteredList.filter(pokemon =>
        pokemon.data.id >= minPokemon
      )
    }
    if (maxPokemon) {
      filteredList = filteredList.filter(pokemon =>
        pokemon.data.id <= maxPokemon
      )
    }

    this.render(filteredList);
  }

  render(pokemonList) {
    pokemonList.forEach(pokemon => pokemon.getDetailsFromServer());

    var tiles = pokemonList.map(pokemon => pokemon.renderListItem());
    this.domElements.searchResults
      .empty()
      .append(tiles);
  }

  handlePokemonClick(pokemon){
    var randomNum = Math.floor(Math.random() * 800) + 1;
    console.log(randomNum);

    this.playerPokemon = this.pokemonList.find( (v) => v.data.id == pokemon.currentTarget.id )
    this.opponentPokemon = this.pokemonList.find( (v) => v.data.id == randomNum);

    if (this.opponentPokemon.data.hasOwnProperty('stats') == false){
      this.opponentPokemon.getDetailsFromServer();
    }

    console.log("Player pokemon is: ", this.playerPokemon);
    console.log("Opponent pokemon is: ", this.opponentPokemon);

  }
}
