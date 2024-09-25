import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-detail-article',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './detail-article.component.html',
  styleUrl: './detail-article.component.css'
})
export class DetailArticleComponent {

}
