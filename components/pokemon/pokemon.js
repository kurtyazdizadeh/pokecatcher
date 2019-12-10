class Pokemon {
  constructor (data, callbacks){
    this.getDetailsFromServer = this.getDetailsFromServer.bind(this);
    this.processDetailsFromServer = this.processDetailsFromServer.bind(this);
    this.failedDetailsFromServer = this.failedDetailsFromServer.bind(this);

    this.callbacks = callbacks;
    this.data = data;
    this.domElements = {
      pokemon: null,
      image: null,
      name: null
    };

  }
  renderListItem(){
    var capitalize = (str) => str.charAt(0).toUpperCase()+str.slice(1);

    var $pokemon = this.domElements.pokemon = $("<div>", { class: "pokemon", id: this.data.id });
    var $image   = this.domElements.image   = $("<img>", { src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.data.id}.png`, alt: this.data.name });
    var $name    = this.domElements.name    = $("<div>", { class: "name", text: capitalize(this.data.name) });

    $pokemon.click(this.callbacks.click);
    $pokemon.append($image, $name);

    return $pokemon;
  }
  getDetailsFromServer(){
    var ajaxOptions = {
      url: this.data.url,
      method: "GET",
      dataType: "JSON"
    };

    $.ajax(ajaxOptions)
      .done(this.processDetailsFromServer)
      .fail(this.failedDetailsFromServer)
  }
  processDetailsFromServer(response){
    this.data.sprites = response.sprites;
    this.data.stats = {};
    this.data.stats.hp = response.stats[5].stat;
    this.data.stats.hp.baseStat = response.stats[5].base_stat;
    this.data.stats.attack = response.stats[4].stat;
    this.data.stats.attack.baseStat = response.stats[4].base_stat;
    this.data.stats.defense = response.stats[3].stat;
    this.data.stats.defense.baseStat = response.stats[3].base_stat;
    this.data.stats.baseXP = response.base_experience;
    this.data.types = response.types;
  }
  failedDetailsFromServer(xhr){
    console.error("failedDetailsFromServer error: ", xhr);
  }
}
