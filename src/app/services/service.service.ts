import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { service } from '../models/serviceModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiEndpoint = `${apiUrl}/services`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les services
  getServices(): Observable<service[]> {
    return this.http.get<service[]>(this.apiEndpoint);
  }

  // Récupérer un service spécifique
  getService(id: number): Observable<service> {
    return this.http.get<service>(`${this.apiEndpoint}/${id}`);
  }

  // Créer un nouveau service
  createService(serviceData: FormData): Observable<any> {
    return this.http.post(this.apiEndpoint, serviceData);
  }

  // Mettre à jour un service existant
  updateService(id: number, serviceData: FormData): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/${id}`, serviceData);
  }

  // Supprimer un service
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiEndpoint}/${id}`);
  }
  //reserver un service
  reserverService(serviceId: number, reservationData: {
    date_reservation: string;
    message: string;
  }): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/${serviceId}/reserver`, reservationData);
  }
}
