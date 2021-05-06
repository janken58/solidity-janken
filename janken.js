var abi;
address = "";

window.onload = async function() {
  window.web3 = new Web3(ethereum);
  userAccount = await web3.eth.getAccounts();
  contract = new web3.eth.Contract(abi, address);
}

$(document).on('click', '#create_player', async(e) => {
  contract.methods.createPlayer().send({ from: userAccount[0] });
});

$(document).on('click', '#player_detail', async(e) => {
    contract.methods.getPlayerByOwner(userAccount[0]).call()
    .then((plyaer) => {
      $("#players").empty();
      $("#players").append(`<div class="players">
        <ul>
          <li>win count: ${plyaer.winCount}</li>
          <li>loss count: ${plyaer.lossCount}</li>
          <li>draw count: ${plyaer.drawCount}</li>
          <li>withdrawal balance: ${plyaer.withdrawalBalance}</li>
        </ul>
      </div>`)
    });
});

$(document).on('click', '#button', async(e) => {
  document.getElementById("your_hand").textContent = "Your hand: " + $(e.currentTarget).text();
  contract.methods.janken($(e.currentTarget).val()).send({ from: userAccount[0], value: web3.utils.toWei("1", "ether") });
  contract.events.PlayJanken({ filter: { _to: userAccount } })
  .on("data", function(event) {
    var result = event.returnValues;
    document.getElementById("enemy_hand").textContent = "Enemy hand: " + String.fromCharCode(result[0]);
    document.getElementById("result").textContent = result[1];
  }).on("error", console.error);
});

$(document).on('click', '#withdraw', async(e) => {
  contract.methods.withdraw().send({ from: userAccount[0]});
});