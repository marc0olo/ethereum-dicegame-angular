import { Injectable } from '@angular/core';
import { Web3Service } from '../web3/web3.service';
import { PlayRound } from './playround';

const jsonInterface = require('../../../build/contracts/DiceGame.json');

@Injectable({
    providedIn: 'root'
})
export class DiceGameContractService {
    private _web3: any;
    private _contractAddress = '0xc62de65c47ec3d526b809af7610c6014529eef2e'; // varies after renewed deployment
    private _contract: any;

    constructor(private _web3Service: Web3Service) {
        this._web3 = this._web3Service.getWeb3();
        this._contract = this._web3Service.jsonInterfaceToContract(jsonInterface, this._contractAddress);
    }

    getAddress() {
        return this._contractAddress;
    }

    async getOwner() {
        let contractOwner = await this._contract.methods.owner().call();
        return contractOwner;
    }

    async getPlayRound(pastRoundId) {
        let pastPlayRound = await this._contract.pastPlayRounds.call(pastRoundId);
        let playRound = new PlayRound(
            this._web3.utils.fromWei(pastPlayRound[0], "ether"),
            pastPlayRound[1].toNumber(), pastPlayRound[2],
            pastPlayRound[3],
            pastPlayRound[4],
            pastPlayRound[5]
        );
        return playRound;
    }
}