// sidebar.component.ts
import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/authservice.service';
import { UserModel } from '../../models/userModel';

@Component({
  selector: 'app-sidbar',
  standalone: true,
  imports: [CommonModule, NgbModalModule, RouterModule],
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.css']
})
export class SidbarComponent implements OnInit {
  @ViewChild('notificationsModal') notificationsModal!: TemplateRef<any>;
  currentUser: UserModel | null = null;
  isAdmin: boolean = false;
  isEtudiant: boolean = false;
  isClient: boolean = false;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Souscrire aux changements de l'utilisateur courant
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.isAdmin = this.authService.isAdmin();
        this.isEtudiant = this.authService.isEtudiant();
        this.isClient = this.authService.isClient();
      }
    });
  }

  openNotificationsModal() {
    this.modalService.open(this.notificationsModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  }
}
