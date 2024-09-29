import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { service } from '../../../models/serviceModel';
import { SidbarComponent } from '../../sidbar/sidbar.component';

@Component({
  selector: 'app-list-service',
  standalone: true,
  imports: [SidbarComponent,CommonModule, RouterModule],
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.css']
})
export class ListServiceComponent implements OnInit {
  services: service[] = [];
  paginatedServices: service[] = [];
  currentPage = 1;
  itemsPerPage = 9; // Afficher 9 services par page (3x3 grid)
  totalPages = 0;

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getServices().subscribe(
      (data) => {
        this.services = data;
        this.totalPages = Math.ceil(this.services.length / this.itemsPerPage);
        this.updatePaginatedServices();
      },
      (error) => {
        console.error('Erreur lors du chargement des services', error);
      }
    );
  }

  updatePaginatedServices() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedServices = this.services.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedServices();
  }

  deleteService(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.serviceService.deleteService(id).subscribe(
        () => {
          this.services = this.services.filter(service => service.id !== id);
          this.updatePaginatedServices();
        },
        (error) => {
          console.error('Erreur lors de la suppression du service', error);
        }
      );
    }
  }
}
