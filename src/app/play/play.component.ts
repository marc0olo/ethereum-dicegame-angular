import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { filter } from 'rxjs/operators';

import { Web3Service } from '../shared/services/web3.service';
import { EthereumAddressValidator } from '../shared/validators/EthereumAddressValidator';
import { DiceGameContractService } from '../shared/services/dicegame_contract.service';
import { PlayRound } from '../shared/models/playround.model';
import { LoaderService } from '../shared/services/loader.service';

const CONFIRMATIONS_REQUIRED = 10;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {
  private subscriptions: Array<any> = new Array();;

  accountAddress: string;
  accountBalance: number;
  contractBalance: number;
  ownerAddress: string;
  gamemasterAddress: string;

  currentPlayRound: PlayRound;
  reward: number;
  bet: number;

  contractForm: FormGroup;
  managingForm: FormGroup;
  bettingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private matSnackBar: MatSnackBar,
    private loaderService: LoaderService,
    private web3Service: Web3Service,
    private dicegameService: DiceGameContractService
  ) {
    this.contractForm = this.fb.group({
      newGamemaster: [, [
        EthereumAddressValidator.isEthereumAddress(this.web3Service)
      ]]
    })
    this.managingForm = this.fb.group({
      requiredEth: [0, [
        Validators.required,
        Validators.min(0)
      ]]
    })
    this.bettingForm = this.fb.group({
      numberOfPips: [0, [
        Validators.required,
        Validators.min(1),
        Validators.max(6)
      ]],
      eth: 0
    });
  }

  async ngOnInit() {
    if (typeof this.web3Service.getWeb3() !== 'undefined') {
      this.ownerAddress = await this.dicegameService.getOwner();
      this.gamemasterAddress = await this.dicegameService.getGamemaster();
      await this.watchAccount();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  async refreshData() {
    this.accountBalance = await this.web3Service.getBalance(this.accountAddress);
    this.contractBalance = await this.web3Service.getBalance(this.dicegameService.getContractAddress());
    this.gamemasterAddress = await this.dicegameService.getGamemaster();
    this.reward = await this.dicegameService.getRewards(this.accountAddress);
    this.currentPlayRound = await this.dicegameService.getCurrentPlayRound();
    this.bet = await this.dicegameService.getPlayerBetForCurrentPlayRound(this.accountAddress);
    this.bettingForm.controls.eth.setValue(this.currentPlayRound.ethRequired);
    this.bettingForm.controls.eth.setValidators([Validators.required, Validators.min(this.getEthRequired())]);
  }

  async watchAccount() {
    let accountSubscription = this.web3Service.accountsObservable
      .pipe(
        filter(account => account != this.accountAddress)
      )
      .subscribe(async (account) => {
        this.accountAddress = account;
        if (typeof this.accountAddress === 'undefined') {
          this.setStatus('unlock your metamask account to play');
          this.accountBalance = undefined;
        } else {
          await this.refreshData();
        }
      });
    this.subscriptions.push(accountSubscription);
  }

  isPlacingPhaseActive() {
    return typeof this.currentPlayRound !== "undefined" && this.currentPlayRound.placingPhaseActive;
  }

  isOwner() {
    return typeof this.ownerAddress !== "undefined" && this.ownerAddress === this.accountAddress;
  }

  isGamemaster() {
    return typeof this.gamemasterAddress !== "undefined" && this.gamemasterAddress === this.accountAddress;
  }

  getEthRequired() {
    return this.isPlacingPhaseActive() ? this.currentPlayRound.ethRequired : 0;
  }

  startPlacingPhase() {
    this.loaderService.display(true);
    let requiredEth = this.managingForm.controls.requiredEth.value;
    let wei = this.web3Service.getWeb3().utils.toWei(requiredEth.toString(), "ether"); // seems like web3 utils currently can only handle strings
    let transaction = this.dicegameService.getContract().methods.startPlacingPhase(wei).send({ from: this.accountAddress });
    transaction.on('transactionHash', txHash => {
    });
    transaction.on('confirmation', async (confirmationNumber, receipt) => {
      if (confirmationNumber === CONFIRMATIONS_REQUIRED) {
        await this.refreshData();
        this.loaderService.display(false);
        this.setStatus('New playround started.');
      }
    });
    transaction.on('error', err => {
      this.handleError(err);
    });
  }

  closePlacingPhase() {
    this.loaderService.display(true);
    let transaction = this.dicegameService.getContract().methods.closePlacingPhase().send({ from: this.accountAddress });
    transaction.on('transactionHash', txHash => {
    });
    transaction.on('confirmation', async (confirmationNumber, receipt) => {
      if (confirmationNumber === CONFIRMATIONS_REQUIRED) {
        await this.refreshData();
        this.loaderService.display(false);
        this.setStatus('Playround closed.');
      }
    });
    transaction.on('error', err => {
      this.handleError(err);
    });
  }

  placeBet() {
    this.loaderService.display(true);
    let eth = this.bettingForm.controls.eth.value;
    let numberOfPips = this.bettingForm.controls.numberOfPips.value;
    let wei = this.web3Service.getWeb3().utils.toWei(eth.toString(), "ether");
    let transaction = this.dicegameService.getContract().methods.placeBet(numberOfPips).send({ from: this.accountAddress, value: wei });
    transaction.on('transactionHash', txHash => {
    });
    transaction.on('confirmation', async (confirmationNumber, receipt) => {
      if (confirmationNumber === CONFIRMATIONS_REQUIRED) {
        await this.refreshData();
        this.loaderService.display(false);
        this.setStatus('Bet placed.');
      }
    });
    transaction.on('error', err => {
      this.handleError(err);
    });
  }

  changeGamemaster() {
    this.loaderService.display(true);
    let address = this.contractForm.controls.newGamemaster.value;
    let transaction = this.dicegameService.getContract().methods.changeGamemaster(address).send({ from: this.accountAddress });
    transaction.on('transactionHash', txHash => {
    });
    transaction.on('confirmation', async (confirmationNumber, receipt) => {
      if (confirmationNumber === CONFIRMATIONS_REQUIRED) {
        await this.refreshData();
        this.loaderService.display(false);
        this.setStatus('New gamemaster: ' + address);
      }
    });
    transaction.on('error', err => {
      this.handleError(err);
    });
  }

  claimReward() {
    this.loaderService.display(true);
    let transaction = this.dicegameService.getContract().methods.claimReward().send({ from: this.accountAddress });
    transaction.on('transactionHash', txHash => {
    });
    transaction.on('confirmation', async (confirmationNumber, receipt) => {
      if (confirmationNumber === CONFIRMATIONS_REQUIRED) {
        await this.refreshData();
        this.loaderService.display(false);
        this.setStatus('Reward claimed.');
      }
    });
    transaction.on('error', err => {
      this.handleError(err);
    });
  }

  destroyContract() {
    this.loaderService.display(true);
    let transaction = this.dicegameService.getContract().methods.destroy().send({ from: this.accountAddress });
    transaction.on('transactionHash', txHash => {
    });
    transaction.on('confirmation', async (confirmationNumber, receipt) => {
      if (confirmationNumber === CONFIRMATIONS_REQUIRED) {
        await this.refreshData();
        this.loaderService.display(false);
        this.setStatus('Reward claimed.');
      }
    });
    transaction.on('error', err => {
      this.handleError(err);
    });
  }

  isUndefined(value) {
    return (typeof value === 'undefined');
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

  handleError(err) {
    let text;
    if (err.message.includes('VM Exception while processing transaction: revert')) {
      text = 'Error: transaction reverted';
    } else if (err.message.includes('VM Exception while processing transaction: out of gas')) {
      text = 'Error: out of gas (try again with a higher gas-limit)';
    } else if (err.message.includes('User denied transaction signature')) {
      text = 'transaction rejected';
    } else {
      text = 'unknown error';
    }
    this.loaderService.display(false);
    this.setStatus(text);
  }
}
