const Janken = artifacts.require("Janken");
const truffleAssert = require('truffle-assertions');
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Janken", function (accounts) {  
  let contract;
  beforeEach(async () => {
    contract = await Janken.new();
  });

  it("janken", async () => {
    createPlayer = await contract.createPlayer({from: accounts[0]});
    assert.equal(createPlayer.receipt.status, true);
    winCount = 0;
    drawCount = 0;
    lossCount = 0;
    beforeBalance = await web3.eth.getBalance(accounts[0]);
    for (let myHand = 1; myHand <= 3; myHand++) {
      janken = await contract.janken(myHand, {from: accounts[0], value: web3.utils.toWei("1", "ether")});
      assert.equal(janken.receipt.status, true);
      truffleAssert.eventEmitted(janken, 'PlayJanken', (event) => {
        if(event.strEnemyHand == "0x270A"){
          switch (myHand){
            case 1:
              assert.equal(event.result, 'draw');
              drawCount++;
              break;
            case 2:
              assert.equal(event.result, 'your lose');
              lossCount++;
              break;
            case 3:
              assert.equal(event.result, 'your win');
              winCount++;
              break;
          }
        }else if(event.strEnemyHand == "0x270C"){
          switch (myHand){
            case 1:
              assert.equal(event.result, 'your win');
              winCount++;
              break;
            case 2:
              assert.equal(event.result, 'draw');
              drawCount++;
              break;
            case 3:
              assert.equal(event.result, 'your lose');
              lossCount++;
              break;
          }
        }else if(event.strEnemyHand == "0x270B"){
          switch (myHand){
            case 1:
              assert.equal(event.result, 'your lose');
              lossCount++;
              break;
            case 2:
              assert.equal(event.result, 'your win');
              winCount++;
              break;
            case 3:
              assert.equal(event.result, 'draw');
              drawCount++;
              break;
          }
        }
        return event;
      });

    }
    
    playerDetail = await contract.getPlayerByOwner(accounts[0], {from: accounts[0]});
    assert.equal(playerDetail.winCount, winCount);
    assert.equal(playerDetail.lossCount, lossCount);
    assert.equal(playerDetail.drawCount, drawCount);
    assert.equal(playerDetail.withdrawalBalance, winCount * 2 + drawCount);

    afterBalance = await web3.eth.getBalance(accounts[0]);
    
    withdraw = await contract.withdraw({from: accounts[0]});
    assert.equal(withdraw.receipt.status, true);
  });
});
