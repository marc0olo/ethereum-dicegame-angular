import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Web3Service } from '../web3/web3.service';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DiceGameContractService } from './dicegame.service';

@Component({
  selector: 'app-dicegame',
  templateUrl: './dicegame.component.html',
  styleUrls: ['./dicegame.component.css']
})
export class DiceGameComponent implements OnInit {
  _accountAddress: string;
  _accountBalance: number;
  _ownerAddress: string;

  constructor(
    private _web3Service: Web3Service,
    private _dicegameService: DiceGameContractService,
    private _matSnackBar: MatSnackBar
  ) {
    console.log('Web3Service: ', _web3Service);
    console.log('DiceGameContractService', _dicegameService);
  }

  async ngOnInit() {
    this.watchAccount();
    this._ownerAddress = await this._dicegameService.getOwner();
  }

  watchAccount() {
    this._web3Service.accountsObservable
      .pipe(
        tap((account: string) => {
          this._accountAddress = account;
          this.setStatus('Account changed');
        }),
        switchMap(() => from(this._web3Service.getBalance(this._accountAddress)))
      )
      .subscribe(
        (balance) => this._accountBalance = balance,
    );
  }

  setStatus(status) {
    this._matSnackBar.open(status, null, { duration: 3000 });
  }
}
