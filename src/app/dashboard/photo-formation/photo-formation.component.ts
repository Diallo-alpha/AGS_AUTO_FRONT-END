import { SidbarComponent } from './../sidbar/sidbar.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-photo-formation',
  standalone: true,
  imports: [SidbarComponent,RouterModule],
  templateUrl: './photo-formation.component.html',
  styleUrl: './photo-formation.component.css'
})
export class PhotoFormationComponent {

}
