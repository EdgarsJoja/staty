import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Staty } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemsListPage } from '../pages/items-list/items-list';
import { StatisticsPage } from '../pages/statistics/statistics';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
	declarations: [
		Staty,
		HomePage,
		ItemsListPage,
		StatisticsPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(Staty),
		SuperTabsModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		Staty,
		HomePage,
		ItemsListPage,
		StatisticsPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
