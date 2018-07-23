import { TestBed, inject } from '@angular/core/testing';
import Web3 from 'web3';

import { Web3Service } from './web3.service';

import dicegame_jsonInterface from '../../../build/contracts/DiceGame.json';
const dicegame_address = '0xc62de65c47ec3d526b809af7610c6014529eef2e';

declare let window: any;

describe('Web3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  it('should be created', inject([Web3Service], (service: Web3Service) => {
    expect(service).toBeTruthy();
  }));
  
  it('should inject a default web3 on a contract', inject([Web3Service], (service: Web3Service) => {
    service.bootstrapWeb3();

    return service.jsonInterfaceToContract(dicegame_jsonInterface, dicegame_address).then((abstraction) => {
      expect(abstraction.currentProvider.host).toBe('http://localhost:9545');
    });
  }));

  it('should inject a the window web3 on a contract', inject([Web3Service], (service: Web3Service) => {
    window.web3 = {
      currentProvider: new Web3.providers.HttpProvider('http://localhost:1337')
    };

    service.bootstrapWeb3();

    return service.jsonInterfaceToContract(dicegame_jsonInterface, dicegame_address).then((abstraction) => {
      expect(abstraction.currentProvider.host).toBe('http://localhost:1337');
    });
  }));
});
