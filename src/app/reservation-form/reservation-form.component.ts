import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../services/service.service';
import { service } from '../models/serviceModel';
@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {
  @Input() service: service | null = null;
  reservationForm: FormGroup;
  isVisible = false;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService
  ) {
    // Définir la date minimum à aujourd'hui
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      date_reservation: ['', Validators.required],
      message: ['', [Validators.maxLength(1000)]]
    });
  }

  show() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.reservationForm.reset();
  }

  onSubmit() {
    if (this.reservationForm.valid && this.service) {
      const formData = this.reservationForm.value;

      this.serviceService.reserverService(this.service.id, formData).subscribe({
        next: (response) => {
          alert('Votre demande de réservation a été envoyée avec succès!');
          this.close();
        },
        error: (error) => {
          console.error('Erreur lors de la réservation:', error);
          alert('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
        }
      });
    }
  }
}
