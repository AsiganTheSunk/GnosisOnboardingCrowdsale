const { balance, BN, time, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

var myToken = artifacts.require("../contracts/tokens/CustomToken.sol");
var myWeth = artifacts.require("canonical-weth/contracts/WETH9.sol");
var myCustomCrowdsale = artifacts.require("../contracts/CustomCrowdsale.sol");

contract('CustomCrowdsale', (accounts) => {

    it('[ Init ]: Contract should have a Default Rate of 2', async () => {
        // Default Values
        var expected_rate = 2;
        var myCustomCrowdsaleInstance = await myCustomCrowdsale.deployed();

        // Current Rate Value
        var rate = await myCustomCrowdsaleInstance.getRate();
        assert.equal(rate.toNumber(), expected_rate, 'CustomCrowdsale Contract Should have a Rate of 2');
    });


    it('[ Init ]: Contract should have a Default Cap of 10', async () => {
        // Await Deployment
        var myCustomCrowdsaleInstance = await myCustomCrowdsale.deployed();

        // Expected Value for Contract
        var expected_cap = 10;

        // Current Cap Default Value for Contract
        var cap = await myCustomCrowdsaleInstance.getCap();
        assert.equal(cap.toNumber(), expected_cap, 'CustomCrowdsale Contract Should have a Cap of 100');

    });

    it('[ Init ]: Contract should have a Default Goal 50', async () => {
        var myCustomCrowdsaleInstance = await myCustomCrowdsale.deployed();

        // Expected Value for Contract
        var expected_goal = 50;

        // Current Goal Default Value for Contract
        var goal = await myCustomCrowdsaleInstance.getGoal();
        assert.equal(goal.toNumber(), expected_goal, 'CustomCrowdsale Contract Should have a Goal of 100');
    });


    // it('[ Init ]: Contract should have a Default currentContribution of 0', async () => {
    //     var myCustomCrowdsaleInstance = await myCustomCrowdsale.deployed();

    //     // Expected Value for Contract
    //     var expected_currentContribution = 0;

    //     var currentContribution  = await myCustomCrowdsaleInstance.getCurrentContribution();
    //     assert.equal(currentContribution.toNumber(), expected_currentContribution, 'CustomCrowdsale Contract Should have a currentContribution of 0');
    // });

    it('[ Tx ]: Contract should have a Default remainingTokens of * ', async () => {
        try {

            // Deploy the Smart Contracts, and await via Promise.all()
            var myTokenInstance = await myToken.deployed();
            var myWethInstance = await myWeth.deployed();
            var myCustomCrowdsaleInstance = await myCustomCrowdsale.deployed();
            Promise.all([myTokenInstance, myWethInstance, myCustomCrowdsaleInstance]);


            await myWethInstance.deposit({'value': ether('3')});
            var depositedWeth = new BN(await myWethInstance.totalSupply());
            // console.log('       +  Current Deposit of WETH in WETH9 Contract: ' + String(depositedWeth));
            var expectedWeth9 = new BN(ether('3'));
            assert.equal(String(depositedWeth), String(expectedWeth9), 'myWethInstance Contract Should have x ether as currentWethBalance');

            await myWethInstance.approve(myCustomCrowdsale.address, depositedWeth);
            var currentWethBalance = new BN((await myCustomCrowdsaleInstance.getWethTotalSupply()));
            assert.equal(String(currentWethBalance), String(expectedWeth9), 'myWethInstance Contract Should have x ether as currentWethBalance');

            var releaseTime = (await myCustomCrowdsaleInstance.getReleaseTime());          
            // await time.increaseTo(releaseTime);

            // Evaluating Status of Custom Crowdsale (Open)
            var isCompleted =  await myCustomCrowdsaleInstance.isCompleted();
            assert.equal(isCompleted.valueOf(), false, 'CustomCrowdsale Contract Should have a hasClosed of true');

            var currentTokenToBuy = new BN(web3.utils.toWei('3')); 
            await myCustomCrowdsaleInstance.buyToken(currentTokenToBuy);

            // Evaluating Status of Custom Crowdsale (Close)
            await myCustomCrowdsaleInstance.closeICO();
            var valueIsCompleted =  await myCustomCrowdsaleInstance.isCompleted();
            assert.equal(valueIsCompleted.valueOf(), true, 'CustomCrowdsale Contract Should have a hasClosed of false');
 
            var currentTokenInCrowdsale = await myTokenInstance.getBalance(myCustomCrowdsaleInstance.address);
            console.log('       +  Current Tokens in Crowdsale '+ String(currentTokenInCrowdsale));
            var currentRate = myCustomCrowdsaleInstance.getRate();


            //var numberOfSelledTokens = currentTokenToBuy * currentRate;
            await myTokenInstance.approve(myCustomCrowdsale.address, currentTokenToBuy);
            //await myCustomCrowdsaleInstance.claimContribution();
            
            currentTokenInCrowdsale = await myTokenInstance.getBalance(myCustomCrowdsaleInstance.address);
            console.log('       +  Current Tokens in Crowdsale '+ String(currentTokenInCrowdsale));
 
            var currentContribution  = await myCustomCrowdsaleInstance.getCurrentContribution();
            console.log('       +  CurrentContribution in Crowdsale '+ String(currentContribution));
        } catch(error) {
            console.log(error);
        }
    });
});