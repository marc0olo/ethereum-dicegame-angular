import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Web3Service } from '../shared/services/web3.service';
import { DiceGameContractService } from '../shared/services/dicegame_contract.service';
import { PlayRound } from '../shared/models/playround.model';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  accountAddress: string;
  accountBalance: number;
  ownerAddress: string;

  currentPlayRound: PlayRound;
  reward: number;

  constructor(
    private web3Service: Web3Service,
    private dicegameService: DiceGameContractService,
    private matSnackBar: MatSnackBar
  ) {
    console.log('Web3Service: ', web3Service);
    console.log('DiceGameContractService', dicegameService);
  }

  async ngOnInit() {
    this.ownerAddress = await this.dicegameService.getOwner();
    await this.watchAccount();
  }

  async refreshData() {
    this.reward = await this.dicegameService.getRewards(this.accountAddress);
    console.log(this.reward);
    this.currentPlayRound = await this.dicegameService.getCurrentPlayRound();
    console.log(this.currentPlayRound);
  }

  watchAccount() {
    this.web3Service.accountsObservable
      .pipe(
        tap((account: string) => {
          this.accountAddress = account;
          this.setStatus('Account changed');
        }),
        switchMap(() => from(this.web3Service.getBalance(this.accountAddress)))
      )
      .subscribe(
        (balance) => this.accountBalance = balance,
        this.refreshData()
    );
  }

  async startPlacingPhase() {
    console.log(this.accountAddress);
    await this.dicegameService.startPlacingPhase(this.accountAddress, "1");
    await this.refreshData();
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

}
