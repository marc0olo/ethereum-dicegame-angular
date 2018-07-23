import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import Web3 from 'web3';
import { switchMap, filter, map } from 'rxjs/operators';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: any;
  private account: string;

  public accountsObservable;

  constructor() {
    this.bootstrapWeb3();
    this.accountsObservable = interval(500)
      .pipe(
        switchMap(() => this.web3.eth.getAccounts()),
        filter(accounts => Array.isArray(accounts) && accounts.length > 0),
        map(accounts => accounts[0]),
        filter(account => account != this.account),
        map(account => this.account = account)
      )
  }

   bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3('http://localhost:9545');
    }
  }

  getWeb3() {
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
