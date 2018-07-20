import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule
} from '@angular/material';

import { DiceGameComponent } from './dicegame.component';
import { DescriptionComponent } from '../description/description.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { ChaindataComponent } from '../chaindata/chaindata.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatSnackBarModule,
        MatToolbarModule
    ],
    declarations: [
        DescriptionComponent,
        DiceGameComponent,
        StatisticsComponent,
        ChaindataComponent
    ],
    exports: [
        DescriptionComponent,
        DiceGameComponent
    ]
})
export class DiceGameModule { }