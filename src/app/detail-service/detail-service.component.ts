import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-detail-service',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './detail-service.component.html',
  styleUrl: './detail-service.component.css'
})
export class DetailServiceComponent {

}
