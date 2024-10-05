import { Component } from '@angular/core';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/authservice.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [NavConnectComponent, FooterComponent, NavConnectComponent, NavbarComponent],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent {

  constructor(private authService: AuthService) { }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
