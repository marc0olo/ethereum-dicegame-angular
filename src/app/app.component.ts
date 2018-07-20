import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DiceGame - Example';
  navigation = [
    { link: 'description', label: 'Description' },
    { link: 'play', label: 'Play' },
    { link: 'statistics', label: 'Statistics' },
    { link: 'chaindata', label: 'Chaindata' }
  ];
}
