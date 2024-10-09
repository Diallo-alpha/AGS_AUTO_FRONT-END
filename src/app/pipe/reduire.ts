import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduire',
  standalone: true
})
export class ReduirePipe implements PipeTransform {
  transform(texte: string, limite: number = 100): string {
    if (texte.length <= limite) {
      return texte;
    }
    return texte.slice(0, limite) + '...';
  }
}
