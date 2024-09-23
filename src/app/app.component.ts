import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { InscriptionComponent } from './inscription/inscription.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccueilComponent, InscriptionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
