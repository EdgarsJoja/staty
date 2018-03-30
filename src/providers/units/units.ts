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

    /**
    *   Check if unit is in default units array
    */
    public isDefaultUnit(unit: string): boolean {
        return (DEFAULT_UNITS.findIndex(item => item.value === unit) !== -1);
    }
}
