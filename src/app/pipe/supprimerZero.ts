import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'supprimer',
  standalone: true  
})
export class supprimerZeroPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return value;
    }
    // Supprime les zéros après la virgule (exemple : 1000.00 devient 1000)
    return parseFloat(value).toString();
  }
}
