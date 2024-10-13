import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authservice.service';
import { UserModel } from '../models/userModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  user: UserModel | null = null;
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      nom_complet: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      newPassword: ['']
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        console.log('User info loaded:', user);
        this.user = user;
        this.profileForm.patchValue({
          nom_complet: user.nom_complet,
          email: user.email,
          telephone: user.telephone
        });
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    this.loadUserInfo();
    this.navigateToHome();
  }
  navigateToHome() {
    this.router.navigate(['/']);
  }
  updateProfile() {
    if (this.profileForm.valid) {
      const updatedUser: Partial<UserModel> = {
        nom_complet: this.profileForm.get('nom_complet')?.value,
        email: this.profileForm.get('email')?.value,
        telephone: this.profileForm.get('telephone')?.value
      };

      const newPassword = this.profileForm.get('newPassword')?.value;
      if (newPassword) {
        updatedUser.password = newPassword;
      }

      this.authService.updateProfile(updatedUser).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          this.isEditing = false;
          this.loadUserInfo(); // Reload user info after update
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  updateProfilePicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.authService.updateProfilePicture(file).subscribe({
        next: (response: any) => {
          console.log('Profile picture update response:', response);
          if (response && response.user && response.user.photo) {
            this.user = { ...this.user, photo: response.user.photo } as UserModel;
            console.log('Updated user object:', this.user);
          } else {
            console.warn('Response does not contain updated photo URL');
          }
          this.loadUserInfo(); // Reload user info to ensure all data is up to date
        },
        error: (error) => {
          console.error('Error updating profile picture:', error);
        }
      });
    }
  }
}
