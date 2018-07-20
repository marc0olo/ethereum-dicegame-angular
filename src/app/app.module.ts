import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './/app-routing.module';

import { AppComponent } from './app.component';
import { DiceGameModule } from './dicegame/dicegame.module';
import { MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,

    MatToolbarModule,

    DiceGameModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
