import { Component, OnInit } from '@angular/core';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showLoader: boolean;

  title = 'DiceGame';
  navigation = [
    { link: 'description', label: 'Description' },
    { link: 'play', label: 'Play' },
    { link: 'results', label: 'Results' }
  ];

  constructor(
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
}
