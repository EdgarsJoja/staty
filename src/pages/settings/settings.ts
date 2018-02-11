import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IncrementProvider } from '../../providers/increment/increment';
import { SettingsInterface, SelectOptionInterface, SettingsProvider } from '../../providers/settings/settings';

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
    settings: SettingsInterface;
    defaultSettings: SettingsInterface = this.settingsProvider.getDefaultSettings();

    statisticsPeriodOptions: Array<SelectOptionInterface> = this.settingsProvider.getStatisticsPeriodOptions();
    statisticsTypeOptions: Array<SelectOptionInterface> = this.settingsProvider.getStatisticsTypeOptions();
    firstDayOfWeekOptions: Array<SelectOptionInterface> = this.settingsProvider.getFirstDayOfWeekOptions();

    constructor(
        public navCtrl: NavController,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public incrementProvider: IncrementProvider,
        public settingsProvider: SettingsProvider
    ) {
        this.settingsForm = this.formBuilder.group(this.settingsProvider.getDefinedSettings([''], [''], [''], [false]));
    }

    ngOnInit() {
        this.settingsProvider.getSettings().then((settings) => {
            this.settings = settings || this.defaultSettings;

            this.settingsForm.setValue(this.settingsProvider.getDefinedSettings(
                this.settings.statistics_period,
                this.settings.statistics_type,
                this.settings.first_day_of_week,
                this.settings.dark_mode
            ));

            this.isDefaultSettings = this.settingsProvider.areEqual(this.settings, this.defaultSettings);
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

        this.settingsProvider.saveSettings(data).then(() => {
            this.savingTimeout = setTimeout(() => {
                this.isSaving = false;
                this.isSaved = true;

                this.savedTimeout = setTimeout(() => {
                    this.isSaved = false;
                }, 500)
            }, 500)
        });

        this.isDefaultSettings = this.settingsProvider.areEqual(data, this.defaultSettings);
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
