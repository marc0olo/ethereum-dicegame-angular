import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { interval } from 'rxjs';
import { switchMap, filter, map } from 'rxjs/operators';
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: any;

  public accountsObservable;

  constructor(private router: Router) {
    this.bootstrapWeb3();
    this.accountsObservable = interval(500)
      .pipe(
        switchMap(() => this.web3.eth.getAccounts()),
        // we do not filter because we want to return undefined in case metamask is locked
        //filter(accounts => Array.isArray(accounts) && accounts.length > 0),
        map(accounts => {
          if (Array.isArray(accounts) && accounts.length > 0) {
            return accounts[0];
          }
          return undefined;
        })
      )
  }

  bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      // this.web3 = new Web3('http://localhost:9545');
      this.router.navigate(['metamask']);
    }
  }

  getWeb3() {
    if (typeof this.web3 === 'undefined') {
      this.bootstrapWeb3();
    }
    return this.web3;
  }

  /**
   * @param jsonInterface json interface for the contract to instantiate
   * @param contractAddress address of the smart contract to call
   * 
   * @returns contract instance with all its methods and events
   */
  jsonInterfaceToContract(jsonInterface, contractAddress) {
    const contractAbstraction = new this.web3.eth.Contract(jsonInterface.abi, contractAddress);
    return contractAbstraction;
  }

  /**
   * @param address {string}
   * @returns {number} the balance of the address in ETH
   */
  async getBalance(address) {
    let balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, "ether");
  }
}
