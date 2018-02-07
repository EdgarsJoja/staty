import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import {IncrementProvider} from '../../providers/increment/increment';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {
    settingsStorageCode: string = 'settings';
    isDefaultSettings: boolean = false;
    hasNoIncrements: boolean = true;
    isSaving: boolean = false;
    isSaved: boolean = false;
    savingTimeout: number;
    savedTimeout: number;

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
        public storage: Storage,
        public alertCtrl: AlertController,
        public incrementProvider: IncrementProvider
    ) {
        this.settingsForm = this.formBuilder.group({
            statistics_period: [''],
            statistics_type: [''],
            dark_mode: [false],
        });
    }

    ngOnInit() {
        let self = this;

        self.storage.get(self.settingsStorageCode).then((settings) => {
            self.settings = settings || self.defaultSettings;

            self.settingsForm.setValue({
                statistics_period: self.settings.statistics_period,
                statistics_type: self.settings.statistics_type,
                dark_mode: self.settings.dark_mode,
            });

            self.isDefaultSettings = (self.settings.statistics_period === self.defaultSettings.statistics_period
                && self.settings.statistics_type === self.defaultSettings.statistics_type
                && self.settings.dark_mode === self.defaultSettings.dark_mode);
        });

        self.incrementProvider.hasAnyIncrements().then(function (value) {
            self.hasNoIncrements = !value;
        });
    }

    ngOnDestroy() {
        this.isSaving = this.isSaved = false;
    }

    submitSettingsForm() {
        let self = this,
            data = self.settingsForm.value;

        self.isSaved = false;
        self.isSaving = true;

        clearTimeout(self.savingTimeout);
        clearTimeout(self.savedTimeout);

        self.storage.set(self.settingsStorageCode, data).then(function () {
            self.savingTimeout = setTimeout(function () {
                self.isSaving = false;
                self.isSaved = true;

                self.savedTimeout = setTimeout(function () {
                    self.isSaved = false;
                }, 500)
            }, 500)
        });

        self.isDefaultSettings = (data.statistics_period === self.defaultSettings.statistics_period
            && data.statistics_type === self.defaultSettings.statistics_type
            && data.dark_mode === self.defaultSettings.dark_mode);
    }

    resetAllToDefault() {
        let alert = this.alertCtrl.create({
            title: 'Confirm reset',
            message: 'Are you sure you want to reset all the settings back to default?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {}
                },
                {
                    text: 'OK',
                    handler: () => {
                        this.settingsForm.setValue(this.defaultSettings);
                        this.submitSettingsForm();
                    }
                }
            ]
        });
        alert.present();
    }

    resetAllTrackItems() {
        let self = this,
            alert = self.alertCtrl.create({
                title: 'Confirm reset',
                message: 'Are you sure you want to delete all tracked data?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                        }
                    },
                    {
                        text: 'OK',
                        handler: () => {
                            self.incrementProvider.deleteAllIncrements().then(function () {
                                self.hasNoIncrements = true;
                            });
                        }
                    }
                ]
            });
        alert.present();
    }
}
