import { Component } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-video',
  standalone: true,
  imports: [SidbarComponent, RouterModule],
  templateUrl: './list-video.component.html',
  styleUrl: './list-video.component.css'
})
export class ListVideoComponent {

}
