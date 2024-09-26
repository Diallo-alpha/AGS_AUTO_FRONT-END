import { Component } from '@angular/core';
import { SidbarComponent } from '../sidbar/sidbar.component';

@Component({
  selector: 'app-statique',
  standalone: true,
  imports: [SidbarComponent],
  templateUrl: './statique.component.html',
  styleUrl: './statique.component.css'
})
export class StatiqueComponent {

}
