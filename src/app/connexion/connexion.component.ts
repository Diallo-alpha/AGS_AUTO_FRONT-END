import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authservice.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({});
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Connexion réussie');

          // Affiche le rôle de l'utilisateur dans la console
          const userRole = response.user.role;
          console.log(`Rôle de l'utilisateur connecté : ${userRole}`);

          // Redirection basée sur le rôle
          if (userRole === 'admin') {
            this.router.navigate(['dashboard/statique']);
          } else {
            this.router.navigate(['']); // Redirection par défaut pour les utilisateurs simples
          }
        },
        error: (error) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
  }
}
