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

    var $pokemon  = this.domElements.pokemon  = $("<div>", { class: "pokemon" });
    var $image    = this.domElements.image    = $("<img>", { src: this.data.sprites.front_default, alt: this.data.name });
    var $name     = this.domElements.name     = $("<div>", { class: "name", text: capitalize(this.data.name) });

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
  }
  failedDetailsFromServer(xhr){
    console.error("failedDetailsFromServer error: ", xhr);
  }
}
