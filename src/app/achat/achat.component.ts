import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-achat',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './achat.component.html',
  styleUrl: './achat.component.css'
})
export class AchatComponent {

}
