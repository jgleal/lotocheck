import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numloto'
})
export class NumlotoPipe implements PipeTransform {

  transform(value: number, padding : number): string {
    let s = String(value);
    while (s.length < (padding || 2)) {s = "0" + s;}
    return s;
  }

}
