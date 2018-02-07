import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Staty } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemsListPage } from '../pages/items-list/items-list';
import { StatisticsPage } from '../pages/statistics/statistics';
import { ItemAddPage } from '../pages/item-add/item-add';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { ItemProvider } from '../providers/item/item';
import { IncrementProvider } from '../providers/increment/increment';

@NgModule({
    declarations: [
        Staty,
        HomePage,
        ItemsListPage,
        StatisticsPage,
        ItemAddPage,
        SettingsPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(Staty),
        SuperTabsModule.forRoot(),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        Staty,
        HomePage,
        ItemsListPage,
        StatisticsPage,
        ItemAddPage,
        SettingsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ItemProvider,
        IncrementProvider
    ]
})
export class AppModule { }
