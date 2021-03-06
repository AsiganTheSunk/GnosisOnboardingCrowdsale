import React from 'react';
import Web3 from 'web3';
import { time, BN } from '@openzeppelin/test-helpers';

class BuyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isBuyButtonDisabled: false,
            isClaimButtonDisabled: false,
            isCloseCrowdsaleDisable: false,
            errorMessage: ' ',

            accounts: this.props.accounts,
            mainContract: this.props.mainContract,
            mainContractAddr: this.props.mainContractAddr,
            crowdsaleData: this.props.crowdsaleData,
            tokenContract: this.props.tokenContract,
            tokenContractAddr: this.props.tokenContractAddr,
            wethContract: this.props.wethContract,
            wethContractAddr: this.props.wethContractAddr,

            currentValue: 0, tokenBuyNumber:0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleBuyClick = this.handleBuyClick.bind(this);
        this.handleClaimClick = this.handleClaimClick.bind(this);
    }

    claimTokenTransaction = async () => {
        try {
            const { accounts, mainContract, tokenContract, mainContractAddr, tokenBuyNumber, crowdsaleData } = this.state;
            // TODO: ADD TOKEN RATE TO THE STATE VARIABLES SO IT CAN BE ACCESSED WHEN THE APPROVE OPERATION IS FORMED
            //var rate = tokenData.crowdsaleRate;

            var weiAmount = new BN(String(tokenBuyNumber * crowdsaleData.crowdsaleRate));
            await tokenContract.methods.approve(mainContractAddr, String(weiAmount)).send({'from':accounts[0]});
            await mainContract.methods.claimContribution().send({'from': accounts[0]});
        } catch(err){
            console.log(err.message);
        }
    };

    closeICO = async () => {
        try {
            const { accounts, mainContract } = this.state;
            await mainContract.methods.closeICO().send({'from': accounts[0]});
            const crowdsaleRelease = await mainContract.methods.getReleaseTime().call();

            await time.increaseTo(crowdsaleRelease);
        } catch(err){
            console.log(err.message);
        }
    };

    buySingleTokensTransaction = async (currentAmount) => {
        try {
            const { accounts, mainContract, wethContract, mainContractAddr } = this.state;

            console.log('Current Contract Data');
            console.log('--------------------------------------------------');
            console.log(this.state.mainContract, this.state.mainContractAddr);
            console.log(this.state.wethContract, this.state.wethContractAddr);
            console.log(this.state.tokenContract, this.state.tokenContractAddr);

            var weiAmount = Web3.utils.toWei(currentAmount.toString());
            console.log('+ Current Wei Amount: ' + weiAmount);

            // ADD RATE IN THE APPROVAL?
            await wethContract.methods.deposit().send({'value': weiAmount, 'from': accounts[0]});
            await wethContract.methods.approve(mainContractAddr, weiAmount).send({'from':accounts[0]});
            await mainContract.methods.buyToken().send({'from':accounts[0], 'value': String(weiAmount)});
            //await tokenContract.methods.approve(mainContractAddr, currentAmount * 2).send({from:accounts[0]});

            this.setState({tokenBuyNumber: weiAmount});
        } catch(err){
            console.log('Single Operation Buy Tokens Crashing');
            console.log(err.message);
        }
    };

    handleChange = (event) => {
        event.preventDefault();
        let eventVarName = event.target.name;
        let eventVarValue = event.target.value;
        let eventErrorMesage = ' ';
        if (eventVarName === "Amount") {
            if (eventVarValue !=='' && !Number(eventVarValue)) {
                eventErrorMesage = <strong> The cuantity must be a number </strong>;
                this.setState({isBuyButtonDisabled: true});
            }
            else if (eventVarValue  < Number(0)) {
                eventErrorMesage = <strong> The cuantity must be over 0 </strong>;
                this.setState({isBuyButtonDisabled: true});
            } else {
                console.log('else statement');
                this.setState({isBuyButtonDisabled: false, currentValue: eventVarValue});
            }
        }
        this.setState({errorMessage: eventErrorMesage});
    };

    // Handle Close ICO for Debugging
    handleCloseClick(event) {
        event.preventDefault();
        this.closeICO();
    }

    // Handle Single Click Operations
    handleBuyClick(event) {
        event.preventDefault();
        const { currentValue } = this.state;
        try {
            this.buySingleTokensTransaction(currentValue);
        } catch(err) {
            console.log(err);
        }
    }

    // Handle Claim Click Operations
    handleClaimClick(event) {
        event.preventDefault();
        this.claimTokenTransaction();
    }

    render() {
        const input_style = {
            alignSelf: 'center',
            padding: 2,
            margin: 3
        };
        return (
            <div>
                <form>
                        <center>
                            <br/>
                            <b>Enter your desired CustomToken Amount:</b>
                            <br/>
                            <input type='text' style= {input_style} name='Amount' onChange={this.handleChange}/>
                        </center>
                </form>
                <center>
                    <button style= {input_style} disabled={this.state.isBuyButtonDisabled} onClick={this.handleBuyClick}> Buy (Single-Tx) </button>
                    <button style= {input_style} disabled={this.state.isBuyButtonDisabled} onClick={this.handleClaimClick}> Claim (Single-Tx) </button>
                    <button style= {input_style} disabled={this.state.isBuyButtonDisabled} onClick={this.handleCloseClick}> Close Crowdsale (Debug) </button>
                    <br/>
                   {this.state.errorMessage}
                </center>
            </div>
        )
    }
};

export default BuyForm;
