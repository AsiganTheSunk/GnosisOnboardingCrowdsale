//const { balance, BN, constants, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

var myToken = artifacts.require("../contracts/tokens/CustomToken.sol");
var mySafeWeth = artifacts.require("../contracts/tokens/SafeWETH9.sol");
var myWeth = artifacts.require("canonical-weth/contracts/WETH9.sol");
var myConvertLib = artifacts.require("../contracts/lib/ConvertLib.sol");


contract('CustomCrowdsale', (accounts) => {


    it('[Init]: Contract should have a Default Rate of 10', async () => {
        // Default Values
        var accountOne = accounts[0];
        var expected_rate = 10;

        var myCustomCrowdsaleInstance = await myCrowdsale.deployed();

        // Transfer token ownership to crowdsale
        await myCustomCrowdsaleInstance.token.transferOwnership(myCustomCrowdsaleInstance.crowdsale.address);
//
//        // Track refund vault
//        this.vaultAddress = await this.crowdsale.vault();
//        this.vault = RefundVault.at(this.vaultAddress);
//
//        // Advance time to crowdsale start
//        await increaseTimeTo(this.openingTime + 1);
//
//        var rate = await this.crowdsale.rate();
//        rate.should.be.bignumber.equal(this.rate);
      });
    });

    it('[Init]: Contract should have a Default Cap of 100', async () => {
        // Default Values
        var accountOne = accounts[0];
        var expected_rate = 10;

        //var myCustomTokenInstance = await myToken.deployed();
        //var myCustomCrowdsaleInstance = await myCrowdsale.deployed();

    });
    it('[Init]: Contract should have a Default Goal 50', async () => {
        // Default Values
        var accountOne = accounts[0];
        var expected_rate = 10;

        //var myCustomTokenInstance = await myToken.deployed();
        //var myCustomCrowdsaleInstance = await myCrowdsale.deployed();

    });
    it('[Init]: Contract should have a Default Release Time of 2 min', async () => {
        // Default Values
        var accountOne = accounts[0];
        var expected_rate = 10;

        //var myCustomTokenInstance = await myToken.deployed();
        //var myCustomCrowdsaleInstance = await myCrowdsale.deployed();

    });
});