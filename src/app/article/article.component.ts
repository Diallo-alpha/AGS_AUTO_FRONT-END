import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ArticleService } from '../services/articleservice.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule, NavConnectComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  articles: any[] = [];

  constructor(private articleService: ArticleService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe((data) => {
      this.articles = data;
    });
  }
  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }


}
