import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SettingsProvider } from '../providers/settings/settings';

@Component({
    templateUrl: 'app.html'
})
export class Staty {
    rootPage: any = HomePage;

    pages: Array<{ title: string, component: any }>;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        private settingsProvider: SettingsProvider
    ) {
        // Initialize default settings
        this.settingsProvider.getSettings().then(settings => {
            if (!settings) {
                this.settingsProvider.saveSettings(this.settingsProvider.getDefaultSettings());
            }
        });
    }
}
