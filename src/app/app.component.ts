import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidbarComponent } from './dashboard/sidbar/sidbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
