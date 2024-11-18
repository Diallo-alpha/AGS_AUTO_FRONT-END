import { Component, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/authservice.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { UserModel } from '../../models/userModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidbar',
  standalone: true,
  imports: [CommonModule, NgbModalModule, RouterModule],
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.css']
})
export class SidbarComponent implements OnInit, OnDestroy {
  @ViewChild('notificationsModal') notificationsModal!: TemplateRef<any>;
  currentUser: UserModel | null = null;
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isAdmin: boolean = false;
  isEtudiant: boolean = false;
  isClient: boolean = false;
  profilePictureUrl: string = 'assets/images/default-profile-pic.jpg';
  private subscriptions: Subscription[] = [];

  // Constante pour l'image par défaut

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  // Méthode utilitaire pour obtenir l'URL de la photo de profil
  getProfilePhotoUrl(): string {
    return this.currentUser?.photo || this.profilePictureUrl;
  }

  ngOnInit() {
    // Souscrire aux changements de l'utilisateur courant
    this.subscriptions.push(
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.isAdmin = this.authService.isAdmin();
          this.isEtudiant = this.authService.isEtudiant();
          this.isClient = this.authService.isClient();

          // Si c'est un admin, charger les informations utilisateur à jour
          if (this.isAdmin) {
            this.loadUserInfo();
          }
        }
      })
    );

    // Souscrire aux notifications
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe(
        notifications => this.notifications = notifications
      ),
      this.notificationService.unreadCount$.subscribe(
        count => this.unreadCount = count
      )
    );
  }

  private loadUserInfo() {
    this.subscriptions.push(
      this.authService.getUserInfo().subscribe({
        next: (userInfo) => {
          this.currentUser = userInfo;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      })
    );
  }

  openNotificationsModal() {
    const modalRef = this.modalService.open(this.notificationsModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });
    modalRef.result.then(
      (result) => {
        this.notificationService.markAllAsRead();
      },
      (reason) => {
        // Modal fermé sans action
      }
    );
  }

  deleteNotification(id: string) {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notificationService.loadNotifications();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la notification:', error);
      }
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

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
