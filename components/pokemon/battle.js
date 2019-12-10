class Battle {
  constructor(playerPokemon, opponentPokemon){
   // this.renderModal = this.renderModal.bind(this);

   // this.callbacks = callbacks;
    this.playerPokemon = playerPokemon;
    this.opponentPokemon = opponentPokemon;

    this.domElements = {
      modal: {},
      title: {},
      player: {},
      opponent: {},
      attack: {},
      footer: {},
      fightBtn: {},
    };
  }
  renderModal(){
    var capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    this.playerPokemon.data.name = capitalize(this.playerPokemon.data.name);
    this.opponentPokemon.data.name = capitalize(this.opponentPokemon.data.name);

    var $modal = this.domElements.modal =
      $("<div>", {
        class: "modal fade",
        id: "battleModal",
        tabindex: "-1",
        role: "dialog",
        "aria-labelledby":"battleModal",
        "aria-hidden":"true"
      });
    var $dialog =   $("<div>", { class: "modal-dialog modal-dialog-centered", role: "document" });
    var $content =  $("<div>", { class: "modal-content" });
    var $header =   $("<div>", { class: "modal-header" });
    var $title = this.domElements.title =
                    $("<h5>", { class: "modal-title", id: "battleTitle", text: `You chose ${this.playerPokemon.data.name}!`});
    var $close =    $("<button>", { type: "button", class: "close", "data-dismiss":"modal", "aria-label":"Close" })
                    .append(
                      $("<span>", { "aria-hidden": "true", text: "x" })
                    );
    var $body =     $("<div>", { class: "modal-body" });

    this.playerPokemon.domElements.image[0].src =
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${this.playerPokemon.data.id}.png`

    var $player = this.domElements.player = this.playerPokemon.domElements.pokemon;
    $player.attr("id", "player");

    var $versusText = $("<div>", {class: "text", text: "VERSUS" });

    var $opponent = this.domElements.opponent = this.opponentPokemon.domElements.pokemon;
    $opponent.attr("id", "opponent");


    var $attack = this.domElements.attack =
                    $("<div>", { class: "attack", text: `${this.playerPokemon.data.name} used ${this.selectAttack(this.playerPokemon.data.moves)}!` });
    var $footer = this.domElements.footer =
                    $("<div>", { class: "modal-footer" });
    var $fightBtn = this.domElements.fightBtn =
                    $("<button>", { class: "btn btn-primary fight", text: "Fight!" })
        //don't forget this:  onclick='$(".attack").css("display", "block");$("#opponent").addClass("shake");'
    var $closeBtn = $("<button>", { type: "button", class: "btn btn-secondary", "data-dismiss":"modal", text: "Close" });


    $header.append($title, $close);
    $body.append($player, $versusText, $opponent, $attack);
    $footer.append($fightBtn, $closeBtn);
    $content.append($header);
    $dialog.append($content, $body, $footer);
    $modal.append($dialog);

    return $modal;

  }
  selectAttack(moveList){
    return moveList[Math.floor(Math.random()*moveList.length)].move.name;
  }
}
