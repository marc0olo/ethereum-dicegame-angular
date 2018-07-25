import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { DescriptionComponent } from './description/description.component';
import { PlayComponent } from './play/play.component';
import { ResultsComponent } from './results/results.component';
import { MetamaskComponent } from './metamask/metamask.component';

const routes: Routes = [
  { path: '', redirectTo: '/description', pathMatch: 'full' },
  { path: 'description', component: DescriptionComponent },
  { path: 'play', component: PlayComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'metamask', component: MetamaskComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
