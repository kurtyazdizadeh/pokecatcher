class List {
  constructor(elementConfig){
    this.processPokemonFromServer = this.processPokemonFromServer.bind(this);
    this.handleFilterAndSorting = this.handleFilterAndSorting.bind(this);
    this.handlePokemonClick = this.handlePokemonClick.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleTextClick = this.handleTextClick.bind(this);

    this.domElements = {
      phone: $(elementConfig.phone),
      minPokemon: $(elementConfig.minPokemon),
      maxPokemon: $(elementConfig.maxPokemon),
      name: $(elementConfig.name),
      searchButton: $(elementConfig.searchButton),
      searchResults: $(elementConfig.searchResults),
      modalContainer: $(elementConfig.modalContainer),
      modalDialog: $(elementConfig.modalDialog),
      modal: $(elementConfig.modal)
    };

    this.pokemonList = [];
    this.battle = {};
    this.firstLoad = true;

    this.textMsg= new Text(this.domElements.phone, {send: this.handleTextClick});

  }
  authenticate(){
    this.textMsg.setUp();
  }
  addEventListeners(){
    this.domElements.minPokemon.keydown(this.checkKeydown);
    this.domElements.maxPokemon.keydown(this.checkKeydown);
    this.domElements.searchButton.click(this.handleFilterAndSorting);
    this.domElements.minPokemon.keyup(this.handleEnter);
    this.domElements.maxPokemon.keyup(this.handleEnter);
    this.domElements.name.keyup(this.handleEnter);

  }
  handleEnter(e){
    if (e.keyCode === 13){
      this.handleFilterAndSorting();
    }
  }
  getPokemonFromServer(){
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/?limit=807`,
      type: "GET",
      dataType: "JSON"
    }).done(this.processPokemonFromServer)
      .fail(this.failedPokemonFromServer);
  }
  processPokemonFromServer(response){
    this.loadPokemon(response.results);
  }
  failedPokemonFromServer(xhr){
    console.error("failedPokemonFromServer error: ", xhr);
  }
  loadPokemon(pokemonArray){
    pokemonArray.forEach(v => this.addPokemon(v));
    //logic check to render select pokemon to page on first load
    if (this.firstLoad) {
      this.initializePage()
    }
  }
  addPokemon(pokemonData){
    var pokemon = new Pokemon( pokemonData,
        { click: this.handlePokemonClick,
          modal: this.handleModal
        });
    pokemon.data.id = pokemon.data.url.slice(
        //some ID numbers don't match index+1 (ex: this.pokemonList[930])
        //this ensures it gets the right ID to get details from API later
        pokemon.data.url.lastIndexOf("n/")+2,
        pokemon.data.url.length-1
    )
    this.pokemonList.push(pokemon)
    return this.pokemonList.length;
  }
  initializePage(){
    this.firstLoad = false;
    var firstTwentyFive = this.pokemonList.slice(0, 24);
    this.render(firstTwentyFive);
  }

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
    //if all fields are empty, only display initial page (first 30 pokemon)
    if (!name && !minPokemon && !maxPokemon){
      return this.initializePage();
    }

    this.render(filteredList);
  }

  render(pokemonList) {
    var tiles = pokemonList.map(pokemon => pokemon.renderListItem());
    this.domElements.searchResults
      .empty()
      .append(tiles);
  }

  handlePokemonClick(pokemon){
    if (this.domElements.phone.val() === ""){
      alert("Please enter your phone number before selecting a pokémon!");
      return;
    }
    var randomNum = Math.floor(Math.random() *this.pokemonList.length);

    var playerPokemon = this.pokemonList.find( (v) => v.data.id == pokemon.currentTarget.id );
    var opponentPokemon = this.pokemonList[randomNum];

    if (opponentPokemon.domElements.name === null) {
      opponentPokemon.renderListItem();
    }

    // console.log("Player pokemon is: ", playerPokemon);
    // console.log("Opponent pokemon is: ", opponentPokemon);

    Promise.all([playerPokemon.getDetailsFromServer(), opponentPokemon.getDetailsFromServer()])
      .then(() => this.createBattle(playerPokemon, opponentPokemon))
      .catch((err1, err2) => console.log("Promises from Pokemon.getDetailsFromServer failed", err1, err2));

  }

  createBattle(playerPokemon, opponentPokemon){
    this.battle = new Battle(playerPokemon, opponentPokemon);
    this.renderBattleModal();
  }
  renderBattleModal(){
    this.domElements.modalDialog
      .empty()
      .append(this.battle.renderModal());
    this.domElements.modal.modal();
  }

  handleTextClick(phoneNumber) {
      console.log("proceeding to send text Ajax");
      this.textMsg
        .sendText(
          phoneNumber,
          `Congratulations! You caught ${this.battle.opponentPokemon.data.name}!`,
          this.battle.opponentPokemon.data.id
        );
  }
}
