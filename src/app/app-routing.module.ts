import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { DescriptionComponent } from './description/description.component';
import { DiceGameComponent } from './dicegame/dicegame.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChaindataComponent } from './chaindata/chaindata.component';

const routes: Routes = [
  { path: '', redirectTo: '/description', pathMatch: 'full' },
  { path: 'description', component: DescriptionComponent },
  { path: 'play', component: DiceGameComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'chaindata', component: ChaindataComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
