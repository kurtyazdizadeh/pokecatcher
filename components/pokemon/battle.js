class Battle {
  constructor(playerPokemon, opponentPokemon){
   this.renderModal = this.renderModal.bind(this);
   this.displayAttack = this.displayAttack.bind(this);
   this.processAttackFromServer = this.processAttackFromServer.bind(this);
   this.processAttackEffectivenessFromServer = this.processAttackEffectivenessFromServer.bind(this);
   this.addButton = this.addButton.bind(this);

    this.playerPokemon = playerPokemon;
    this.opponentPokemon = opponentPokemon;
    this.attack = {};
    this.attackRating = "";


    this.domElements = {
      content: {},
        title: {},
        player: {},
        opponent: {},
      attack: {},
      footer: {},
      fightBtn: {},
      catchBtn: {}
    };
  }
  renderModal(){
    var capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    this.playerPokemon.data.name = capitalize(this.playerPokemon.data.name);
    this.opponentPokemon.data.name = capitalize(this.opponentPokemon.data.name);

    var $content = this.domElements.content =
      $("<div>", { class: "modal-content" });
    var $header =
      $("<div>", { class: "modal-header" });
    var $title = this.domElements.title =
      $("<h5>", {
        class: "modal-title",
        id: "battleTitle",
        text: `You chose ${this.playerPokemon.data.name}!`
      });
    var $close =
      $("<button>", {
        type: "button",
        class: "close",
        "data-dismiss":"modal",
        "aria-label":"Close" })
      .append(
        $("<span>",
          { "aria-hidden": "true",
            text: "x"
          })
      );
    var $body =
      $("<div>", { class: "modal-body" });

    var $player = this.domElements.player =
      $("<div>", {
        class: "pokemon",
        id: "player"
      });
    var $playerImage = $("<img>", {
      src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${this.playerPokemon.data.id}.png`,
      alt: this.playerPokemon.data.name,
      onerror: "this.src='./images/pokeball.png'"
    });
    var $playerName = $("<div>", { class: "name", text: this.playerPokemon.data.name });

      $player.append($playerImage, $playerName);

    var $versusText = $("<div>", {
      class: "text",
      text: "VERSUS"
    });
    var $opponent = this.domElements.opponent =
      $("<div>", {
        class: "pokemon",
        id: "opponent"
      });
    var $opponentImage = $("<img>", {
      src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.opponentPokemon.data.id}.png`,
      alt: this.opponentPokemon.data.name,
      onerror: "this.src='./images/pokeball.png'"
    });
    var $opponentName = $("<div>", {
      class: "name",
      text: this.opponentPokemon.data.name
    });
    $opponent.append($opponentImage, $opponentName);

    var $attack = this.domElements.attack =
    $("<div>", {
      class: "attack",
      text: `${this.playerPokemon.data.name} used ${this.selectAttack(this.playerPokemon.data.moves)}!`
    });
    var $footer = this.domElements.footer =
      $("<div>", { class: "modal-footer" });
    var $fightBtn = this.domElements.fightBtn =
      $("<button>", {
        class: "btn btn-primary fight",
        text: "Fight!"
      });
        $fightBtn.click(this.displayAttack);
    var $closeBtn =
      $("<button>", {
        type: "button",
        class: "btn btn-secondary",
        "data-dismiss":"modal",
        text: "Close"
      });
    var $catchBtn = this.domElements.catchBtn =
      $("<button>", {
        type: "button",
        class: "btn btn-success catch d-none",
        "data-dismiss": "modal",
        text: `Catch ${this.opponentPokemon.data.name}!`
      });

      $catchBtn.click(list.textMsg.handleSendClick);

    var $tryAgainBtn = this.domElements.tryAgainBtn =
      $("<button>", {
        type: "button",
        class: "btn btn-danger fail d-none",
        "data-dismiss": "modal",
        text: "Try Again!"
      });


    $header.append($title, $close);
    $body.append($player, $versusText, $opponent, $attack);
    $footer.append($catchBtn, $tryAgainBtn, $fightBtn, $closeBtn);
    $content.append($header, $body, $footer);

    return $content;

  }
  selectAttack(moveList){
    var attack = moveList[Math.floor(Math.random() * moveList.length)].move;
    this.attack = attack;
    this.getAttackType();
    return attack.name;
  }
  getAttackType(){
      $.ajax({
        url: this.attack.url,
        method: "GET",
        dataType: "JSON"
      })
      .done(this.processAttackFromServer)
      .fail(this.failedAttackFromServer);
  }
  processAttackFromServer(response){
    this.attack = response;
    this.getAttackEffectivenessFromServer();
  }
  failedAttackFromServer(xhr){
    console.error("failedAttackFromServer error: ", xhr);
  }

  getAttackEffectivenessFromServer(){
    $.ajax({
      url: this.attack.type.url,
      method: "GET",
      dataType: "JSON"
    })
    .done(this.processAttackEffectivenessFromServer)
    .fail(this.failedAttackEffectivenessFromServer);
  }
  processAttackEffectivenessFromServer(response){
    var superAttack = [];
    var notVery = [];
    var opponentTypes = [];

   if (response.damage_relations.double_damage_to.length > 0){
     response.damage_relations.double_damage_to.forEach(v => superAttack.push(v.name));
   }
  if (response.damage_relations.half_damage_to.length > 0){
    response.damage_relations.half_damage_to.forEach(v => notVery.push(v.name));
  }
  this.opponentPokemon.data.types.
    forEach(v => opponentTypes.push(v.type.name));

    // console.log("super", superAttack, "not very", notVery, "opponent", opponentTypes);
    if (superAttack.filter( v => -1 !== opponentTypes.indexOf(v)).length > 0 ){
      this.attackRating = " It's SUPER effective!";
    }
    if (notVery.filter(v => -1 !== opponentTypes.indexOf(v)).length > 0) {
      this.attackRating = " It's not very effective...";
    }

    console.log(this.attackRating)

  }
  failedAttackEffectivenessFromServer(xhr){
    console.error("failedAttackEffectivenessFromServer: ", xhr);
  }

  displayAttack(){
    this.domElements.attack.append(this.attackRating);
    this.domElements.attack.css({
      "display":"block",
      "flex-basis": "100%",
      "text-align":"center"
    });

    setTimeout( () => this.domElements.player.addClass("shake"), 500 );
    setTimeout( () => this.domElements.opponent.addClass("shake") , 1000 );
    setTimeout( this.addButton, 1500);
  }
  addButton() {
    switch (this.attackRating) {
      case "":
      case " It's SUPER effective!":
        this.domElements.catchBtn.removeClass("d-none");
        break;
      case " It's not very effective...":
        this.domElements.tryAgainBtn.removeClass("d-none");
        break;
    }
  }

  handleTextClick(phoneNumber) {
    if (this.domElements.phone.val()) {
      this.textMsg
        .sendText(
          phoneNumber,
          `Congratulations! You caught ${this.opponentPokemon.data.name}!`,
          this.opponentPokemon.data.id
        );
    } else {
      alert("Please enter your phone number before trying to battle pokémon!");
    }
  }
}
