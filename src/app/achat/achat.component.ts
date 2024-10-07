import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achat',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NavConnectComponent, CommonModule],
  templateUrl: './achat.component.html',
  styleUrl: './achat.component.css'
})
export class AchatComponent {

  constructor(private authService: AuthService) {}

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
