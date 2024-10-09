import { Component } from '@angular/core';
import { SidbarComponent } from '../../dashboard/sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule],
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.css'
})
export class CommandeComponent {

}
