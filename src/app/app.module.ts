import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Staty } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemsListPage } from '../pages/items-list/items-list';
import { StatisticsPage } from '../pages/statistics/statistics';
import { ItemAddPage } from '../pages/item-add/item-add';
import { SettingsPage } from '../pages/settings/settings';
import { AdvancedIncrementAddPage } from '../pages/advanced-increment-add/advanced-increment-add';

import { IncremementsListComponent } from '../components/incremements-list/incremements-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { PipesModule } from '../pipes/pipes.module'

import { SuperTabsModule } from 'ionic2-super-tabs';
import { ItemProvider } from '../providers/item/item';
import { IncrementProvider } from '../providers/increment/increment';
import { ResetIntervalProvider } from '../providers/reset-interval/reset-interval';
import { SettingsProvider } from '../providers/settings/settings';
import { UnitsProvider } from '../providers/units/units';
import { DateProvider } from '../providers/date/date';

@NgModule({
    declarations: [
        Staty,
        HomePage,
        ItemsListPage,
        StatisticsPage,
        ItemAddPage,
        SettingsPage,
        AdvancedIncrementAddPage,
        IncremementsListComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(Staty),
        SuperTabsModule.forRoot(),
        IonicStorageModule.forRoot(),
        PipesModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        Staty,
        HomePage,
        ItemsListPage,
        StatisticsPage,
        ItemAddPage,
        SettingsPage,
        AdvancedIncrementAddPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ItemProvider,
        IncrementProvider,
        ResetIntervalProvider,
        SettingsProvider,
        UnitsProvider,
        DateProvider
    ]
})
export class AppModule { }
