import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})
export class MetamaskComponent implements OnInit {

  constructor(private router: Router, private web3Service: Web3Service) {}

  ngOnInit() {
    if (typeof this.web3Service.getWeb3() !== 'undefined'){
      this.router.navigate(['play']);
    }
  }
}
