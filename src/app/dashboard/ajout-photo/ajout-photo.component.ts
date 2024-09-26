import { Component } from '@angular/core';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ajout-photo',
  standalone: true,
  imports: [SidbarComponent, RouterModule],
  templateUrl: './ajout-photo.component.html',
  styleUrl: './ajout-photo.component.css'
})
export class AjoutPhotoComponent {

}
