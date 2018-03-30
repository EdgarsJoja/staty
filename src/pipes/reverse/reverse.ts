import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reverse',
})
export class ReversePipe implements PipeTransform {
    /**
    * Reverses array
    */
    transform(value: Array<any>, ...args) {
        return value.reverse();
    }
}
