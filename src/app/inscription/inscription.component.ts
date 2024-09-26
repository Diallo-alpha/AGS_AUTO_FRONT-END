import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice.service';
import { UserModel } from '../models/userModel';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  user: UserModel = {
    nom_complet: '',
    email: '',
    telephone: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: () => {
        console.log('Inscription réussie');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erreur d\'inscription', error);
        this.errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription.';
      }
    });
  }
}
