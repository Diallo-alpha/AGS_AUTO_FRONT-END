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
    password: '',
    password_confirmation: ''
  };
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.validateForm()) {
      this.authService.register(this.user).subscribe({
        next: () => {
          console.log('Inscription réussie');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur d\'inscription', error);
          if (error.error && typeof error.error === 'object') {
            // Gestion des erreurs de validation du backend
            const errorMessages = Object.values(error.error).flat();
            this.errorMessage = errorMessages.join('\n');
          } else {
            this.errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription.';
          }
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.user.nom_complet || this.user.nom_complet.trim() === '') {
      this.errorMessage = 'Le nom complet est requis.';
      return false;
    }
    if (!this.user.email || !this.isValidEmail(this.user.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide.';
      return false;
    }
    if (!this.user.telephone || !this.isValidPhone(this.user.telephone)) {
      this.errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
      return false;
    }
    if (!this.user.password || this.user.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return false;
    }
    if (!this.user.password_confirmation) {
      this.errorMessage = 'La confirmation du mot de passe est requise.';
      return false;
    }
    if (this.user.password !== this.user.password_confirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{9}$/;
    return phoneRegex.test(phone);
  }
  togglePasswordVisibility(field: 'password' | 'confirmation') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
