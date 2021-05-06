// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Janken {
  uint handModulus = 3;
  uint betEth = 1 ether;

  struct Player {
    uint16 winCount;
    uint16 lossCount;
    uint16 drawCount;
    uint16 withdrawalBalance;
  }

  Player[] public players;

  mapping (address => uint) public playerByOwner;
  mapping (address => uint) existPlayer;

  function createPlayer() public {
    require(existPlayer[msg.sender] == 0);
    uint id = players.push(Player(0, 0, 0, 0)) - 1;
    playerByOwner[msg.sender] = id;
    existPlayer[msg.sender]++;
  }

  function getPlayerByOwner(address _owner) external view returns(Player memory) {
    return players[playerByOwner[_owner]];
  }

  event PlayJanken(string strEnemyHand, string result);

  function getEnemyHand() public view returns (uint){
    uint rand = uint(keccak256(abi.encode(block.timestamp))) % handModulus + 1;
    return rand;
  }

  function withdraw() public{
    uint returnEth = players[playerByOwner[msg.sender]].withdrawalBalance * 1000000000000000000;
    players[playerByOwner[msg.sender]].withdrawalBalance = 0;
    msg.sender.transfer(returnEth);
  }

  function janken(uint myhand) external payable{
    require(msg.value == betEth);

    Player storage player = players[playerByOwner[msg.sender]];
    uint enemyHand = getEnemyHand();
    uint myHand = myhand;

    string memory strEnemyHand;
    if(enemyHand == 1){
      strEnemyHand = "0x270A";
    }else if(enemyHand == 2){
      strEnemyHand = "0x270C";
    }else if(enemyHand == 3){
      strEnemyHand = "0x270B";
    }

    string memory result;
    if((myHand == 1 && enemyHand == 2) || (myHand == 2 && enemyHand == 3) || (myHand == 3 && enemyHand == 1)){
      player.winCount++;
      player.withdrawalBalance = player.withdrawalBalance + 2;
      result = "your win";
    }else if(myHand == enemyHand){
      player.drawCount++;
      player.withdrawalBalance++;
      result = "draw";
    }else{
      player.lossCount++;
      result = "your lose";
    }

    emit PlayJanken(strEnemyHand, result);
  }

}