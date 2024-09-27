import { Component } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [SidbarComponent, RouterModule],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css'
})
export class AjouterComponent {

}
