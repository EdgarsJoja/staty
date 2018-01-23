import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

import { ItemsListPage } from '../items-list/items-list';

@NgModule({
	declarations: [
		HomePage,
		ItemsListPage
	],
	imports: [
		IonicPageModule.forChild(HomePage)
	],
})
export class HomePageModule { }
