// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${apiUrl}/notifications`;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  // Charger toutes les notifications
  loadNotifications(): void {
    this.http.get<{ notifications: Notification[] }>(this.apiUrl)
      .subscribe({
        next: (response) => {
          this.notificationsSubject.next(response.notifications);
          this.updateUnreadCount(response.notifications);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      });
  }

  // Obtenir une notification spécifique
  getNotification(id: string): Observable<{ notification: Notification }> {
    return this.http.get<{ notification: Notification }>(`${this.apiUrl}/${id}`);
  }

  // Supprimer une notification
  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour le compteur de notifications non lues
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  // Marquer une notification comme lue
  markAsRead(notification: Notification): void {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      notifications[index].read = true;
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount(notifications);
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount(notifications);
  }
}
