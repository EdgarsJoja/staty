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

        this.incrementProvider.hasAnyIncrements().then(value => {
            this.hasNoIncrements = !value;
        });
    }

    ionViewWillLeave() {
        this.isSaving = this.isSaved = false;

        // TODO: Find better solution to refresh the list page
        // Refresh list item page.
        this.navCtrl.goToRoot({
            updateUrl: false,
            isNavRoot: true
        });
    }

    submitSettingsForm() {
        let data = this.settingsForm.value;

        this.isSaved = false;
        this.isSaving = true;

        clearTimeout(this.savingTimeout);
        clearTimeout(this.savedTimeout);

        this.storage.set(this.settingsStorageCode, data).then(() => {
            this.savingTimeout = setTimeout(() => {
                this.isSaving = false;
                this.isSaved = true;

                this.savedTimeout = setTimeout(() => {
                    this.isSaved = false;
                }, 500)
            }, 500)
        });

        this.isDefaultSettings = (data.statistics_period === this.defaultSettings.statistics_period
            && data.statistics_type === this.defaultSettings.statistics_type
            && data.dark_mode === this.defaultSettings.dark_mode);
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
        let alert = this.alertCtrl.create({
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
                            this.incrementProvider.deleteAllIncrements().then(() => {
                                this.hasNoIncrements = true;
                            });
                        }
                    }
                ]
            });
        alert.present();
    }
}
