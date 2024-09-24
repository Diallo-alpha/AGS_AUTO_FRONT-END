import { FooterComponent } from './../footer/footer.component';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-detailformation',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './detailformation.component.html',
  styleUrl: './detailformation.component.css'
})
export class DetailformationComponent {

}
