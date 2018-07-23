import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { PlayRound } from '../models/playround.model';

const jsonInterface = require('../../../../build/contracts/DiceGame.json');

@Injectable({
    providedIn: 'root'
})
export class DiceGameContractService {
    private web3: any;
    private contractAddress = '0x8273e4b8ed6c78e252a9fca5563adfcc75c91b2a'; // varies after renewed deployment
    private contract: any;

    constructor(private web3Service: Web3Service) {
        this.web3 = this.web3Service.getWeb3();
        this.contract = this.web3Service.jsonInterfaceToContract(jsonInterface, this.contractAddress);
    }

    getAddress() {
        return this.contractAddress;
    }

    async getOwner() {
        let contractOwner = await this.contract.methods.owner().call();
        return contractOwner;
    }

    async startPlacingPhase(playerAddress, requiredEth) {
        let wei = this.web3.utils.toWei(requiredEth, "ether");
        await this.contract.methods.startPlacingPhase(wei).send({from: playerAddress});
    }

    async closePlacingPhase() {
        await this.contract.methods.closePlacingPhase().send();
    }

    async placeBet(playerAddress, numberOfPips, eth) {
        let wei = this.web3.utils.fromWei(eth, "ether");
        await this.contract.methods.placeBet(numberOfPips).sendTransaction({from: playerAddress, value: wei});
    }

    async getCurrentPlayRound() {
        let playRoundArray = await this.contract.methods.playRound().call();
        let playRound = new PlayRound(
            playRoundArray.numberOfPips,
            this.web3.utils.fromWei(playRoundArray.weiRequired, "ether"),
            playRoundArray.winner,
            playRoundArray.second,
            playRoundArray.third,
            playRoundArray.placingPhaseActive
        );
        return playRound;
    }

    async getPastPlayRoundCount() {
        let playRoundCount = await this.contract.methods.pastPlayRoundsCount();
        return playRoundCount.toNumber();
    }

    async getPlayRound(pastRoundId) {
        let pastPlayRound = await this.contract.methods.pastPlayRounds(pastRoundId).call();
        let playRound = new PlayRound(
            pastPlayRound.numberOfPips,
            this.web3.utils.fromWei(pastPlayRound.weiRequired, "ether"),
            pastPlayRound.winner,
            pastPlayRound.second,
            pastPlayRound.third,
            pastPlayRound.placingPhaseActive
        );
        return playRound;
    }

    async getRewards(playerAddress) {
        let reward = await this.contract.methods.rewards(playerAddress).call();
        return this.web3.utils.fromWei(reward, "ether");
    }

    async claimReward(playerAddress) {
        await this.contract.methods.claimReward().send({from: playerAddress});
    }
}