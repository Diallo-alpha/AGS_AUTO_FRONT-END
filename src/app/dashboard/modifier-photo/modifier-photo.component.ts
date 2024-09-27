import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../sidbar/sidbar.component';

@Component({
  selector: 'app-modifier-photo',
  standalone: true,
  imports: [RouterModule, SidbarComponent],
  templateUrl: './modifier-photo.component.html',
  styleUrl: './modifier-photo.component.css'
})
export class ModifierPhotoComponent {

}
