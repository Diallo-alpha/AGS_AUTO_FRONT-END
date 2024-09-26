import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatiqueComponent } from './dashboard/statique/statique.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StatiqueComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
