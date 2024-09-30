import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormationService } from '../services/formation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.css'
})
export class FormationComponent {
  formations: any[] = [];

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.formationService.getAllFormations().subscribe((data) => {
      this.formations = data;
    });
  }

}
