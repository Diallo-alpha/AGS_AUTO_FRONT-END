import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../sidbar/sidbar.component';

@Component({
  selector: 'app-ajout-formation',
  standalone: true,
  imports: [RouterModule, SidbarComponent],
  templateUrl: './ajout-formation.component.html',
  styleUrl: './ajout-formation.component.css'
})
export class AjoutFormationComponent {

}
