import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PlayRound } from '../shared/models/playround.model';
import { DiceGameContractService } from '../shared/services/dicegame_contract.service';
import { Web3Service } from '../shared/services/web3.service';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  playRoundsObservable: Observable<PlayRound>;

  accountAddress: string;
  pastPlayRounds: PlayRound[] = [];

  displayedColumns: string[] = ['no', 'numberOfPips', 'ethRequired', 'winner', 'second', 'third'];
  dataSource = new MatTableDataSource<PlayRound>();

  constructor(
    private dicegameService: DiceGameContractService,
    private web3Service: Web3Service,
  ) { }

  async ngOnInit() {
    if (typeof this.web3Service.getWeb3() !== 'undefined') {
      let accountSubscription = this.web3Service.accountsObservable
        .pipe(
          filter(account => account != this.accountAddress)
        )
        .subscribe(async (account) => {
          this.accountAddress = account;
        });
      this.subscriptions.push(accountSubscription);

      let totalPlayRounds = await this.dicegameService.getPastPlayRoundCount();
      for (let i = 0; i < totalPlayRounds; i++) {
        let playRound = await this.dicegameService.getPlayRound(i);
        this.pastPlayRounds.push(playRound);
      }
      this.dataSource = new MatTableDataSource<PlayRound>(this.pastPlayRounds);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
