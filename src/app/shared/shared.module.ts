import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule    
} from '@angular/material';

import { PlayComponent } from '../play/play.component';
import { DescriptionComponent } from '../description/description.component';
import { ResultsComponent } from '../results/results.component';
import { MetamaskComponent } from '../metamask/metamask.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatTableModule,
        MatToolbarModule
    ],
    declarations: [
        DescriptionComponent,
        PlayComponent,
        ResultsComponent,
        MetamaskComponent
    ]
})
export class SharedModule { }