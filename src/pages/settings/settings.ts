import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {
    settingsStorageCode: string = 'settings';
    isDefaultSettings: boolean = false;

    settingsForm: FormGroup;
    settings: {statistics_period, statistics_type, dark_mode};
    defaultSettings: {statistics_period, statistics_type, dark_mode} = { statistics_period: 'd', statistics_type: 'bar', dark_mode: false };

    statisticsPeriodOptions: Array<{}> = [
        {'value': 'd', 'label': 'Day'},
        {'value': 'w', 'label': 'Week'},
        {'value': 'm', 'label': 'Month'},
        {'value': 'q', 'label': 'Quarter'},
        {'value': 'y', 'label': 'Year'}
    ];
    statisticsTypeOptions: Array<{}> = [
        {'value': 'line', 'label': 'Line'},
        {'value': 'pie', 'label': 'Pie'},
        {'value': 'bar', 'label': 'Bar'}
    ];

    constructor(
        public navCtrl: NavController,
        public formBuilder: FormBuilder,
        private storage: Storage,
        private alertCtrl: AlertController
    ) {
        this.settingsForm = this.formBuilder.group({
            statistics_period: [''],
            statistics_type: [''],
            dark_mode: [false],
        });
    }

    ngOnInit() {
        this.storage.get(this.settingsStorageCode).then((settings) => {
            this.settings = settings || this.defaultSettings;

            this.settingsForm.setValue({
                statistics_period: this.settings.statistics_period,
                statistics_type: this.settings.statistics_type,
                dark_mode: this.settings.dark_mode,
            });

            this.isDefaultSettings = (this.settings.statistics_period === this.defaultSettings.statistics_period
                && this.settings.statistics_type === this.defaultSettings.statistics_type
                && this.settings.dark_mode === this.defaultSettings.dark_mode);
        });
    }

    submitSettingsForm(data) {
        this.storage.set(this.settingsStorageCode, data);
        this.isDefaultSettings = (data.statistics_period === this.defaultSettings.statistics_period
            && data.statistics_type === this.defaultSettings.statistics_type
            && data.dark_mode === this.defaultSettings.dark_mode);
    }

    resetAllToDefault() {
        let alert = this.alertCtrl.create({
            title: 'Confirm reset',
            message: 'Do you want to reset all the settings back to defaults?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {}
                },
                {
                    text: 'OK',
                    handler: () => {
                        this.storage.set(this.settingsStorageCode, this.defaultSettings);
                        this.settingsForm.setValue(this.defaultSettings);
                        this.isDefaultSettings = true;
                    }
                }
            ]
        });
        alert.present();
    }

    resetAllTrackItems() {
        let alert = this.alertCtrl.create({
            title: 'Confirm reset',
            message: 'Do you want to reset all tracking items?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {}
                },
                {
                    text: 'OK',
                    handler: () => {
                        // TODO: Add reset f-ty
                    }
                }
            ]
        });
        alert.present();
    }
}
