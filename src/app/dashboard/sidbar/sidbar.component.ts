import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidbar',
  standalone: true,
  imports: [CommonModule, NgbModalModule, RouterModule],
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.css']
})
export class SidbarComponent {
  @ViewChild('notificationsModal') notificationsModal!: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}

  openNotificationsModal() {
    this.modalService.open(this.notificationsModal, { ariaLabelledBy: 'modal-basic-title' });
  }
}
