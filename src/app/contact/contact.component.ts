import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup; // Utilisation du modificateur '!'
  isSubmitting = false;
  submitMessage = '';

  constructor(private fb: FormBuilder) {
    // Initialiser EmailJS avec votre clé publique
    emailjs.init("EyvPOovj1W6mbH5tT");
  }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';

      const templateParams = {
        from_name: this.contactForm.value.name,
        from_email: this.contactForm.value.email,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message
      };

      emailjs.send(
        'service_82fd31r',
        'template_2lrnrr3',
        templateParams
      ).then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        this.submitMessage = 'Votre message a été envoyé avec succès!';
        this.contactForm.reset();
      }, (err) => {
        console.log('FAILED...', err);
        this.submitMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
      }).finally(() => {
        this.isSubmitting = false;
      });
    }
  }
}
