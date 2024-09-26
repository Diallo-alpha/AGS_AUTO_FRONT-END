import { Component } from '@angular/core';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-formation',
  standalone: true,
  imports: [SidbarComponent, RouterModule],
  templateUrl: './list-formation.component.html',
  styleUrl: './list-formation.component.css'
})
export class ListFormationComponent {

}
