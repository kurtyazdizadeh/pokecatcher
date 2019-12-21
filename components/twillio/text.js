const TWILLIO = {
  application_sid: "AC621ce7e40b77c4025db4c3a904bded4c",
  token: "b62c37dd105962e7770a130222526256"
}

class Text {
  constructor(phoneDom, callbacks){
    this.callbacks = callbacks;
    this.processAccountsFromServer = this.processAccountsFromServer.bind(this);
    this.failedAccountsFromServer = this.failedAccountsFromServer.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);

    this.sentTextMessage = this.sentTextMessage.bind(this);
    this.failedTextMessage = this.failedTextMessage.bind(this);

    this.dom = {
      phone: phoneDom
    };

  }
  doAjax(request) {
    request.url = `https://api.twilio.com/2010-04-01/${request.url}`;
    request.headers = {
      Authorization: "Basic " + btoa(`${TWILLIO.application_sid}:${TWILLIO.token}`)
    };
    return $.ajax(request);
  }
  setUp() {
    this.doAjax({
      url: "Accounts",
      method: "POST"
    })
      .done(this.processAccountsFromServer)
      .fail(this.failedAccountsFromServer);
  }
  processAccountsFromServer(response) {
    var $response = $(response);
    console.log("The status of the twillio api is: ", $response.find("Status").text());
  }

  failedAccountsFromServer(xhr) {
    console.error("Unable to verify twillio.");
  }

  sendText(phoneNumber, body, pokemonId) {
    this.doAjax({
      url: "Accounts/" + TWILLIO.application_sid + "/Messages.json",
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      data: {
        To: `+1${phoneNumber.replace(/\D/g,"")}`,
        Body: body,
        From: "+19562846502",
        MediaUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
      }
    })
      .done(this.sentTextMessage)
      .fail(this.failedTextMessage);

  }

  sentTextMessage(response) {
    console.log("text message sent!", response);
  }
  failedTextMessage(xhr) {
    console.error("unable to send text...", xhr);
  }


  handleSendClick(e) {
    var phoneNumber = this.dom.phone.val();
    this.callbacks.send(phoneNumber);
  }
}
