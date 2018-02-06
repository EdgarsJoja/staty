import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Staty } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemsListPage } from '../pages/items-list/items-list';
import { StatisticsPage } from '../pages/statistics/statistics';
import { ItemAddPage } from '../pages/item-add/item-add';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { ItemProvider } from '../providers/item/item';

@NgModule({
    declarations: [
        Staty,
        HomePage,
        ItemsListPage,
        StatisticsPage,
        ItemAddPage
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
        ItemAddPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ItemProvider
    ]
})
export class AppModule { }
