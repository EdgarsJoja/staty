import { Injectable } from '@angular/core';

export const DEFAULT_UNITS = [
    {'value': '', 'label': 'None'},
    {'value': 'kg', 'label': 'Kg'},
    {'value': 'lbs', 'label': 'Lbs'},
    {'value': 'km', 'label': 'Km'},
    {'value': 'miles', 'label': 'Miles'},
    {'value': 'other', 'label': 'Other'},
]

@Injectable()
export class UnitsProvider {

    constructor() {

    }

}
