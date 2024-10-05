import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Article } from '../models/ArticleModel';
import { ArticleService } from '../services/articleservice.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';

@Component({
  selector: 'app-detail-article',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule, NavConnectComponent],
  templateUrl: './detail-article.component.html',
  styleUrl: './detail-article.component.css'
})
export class DetailArticleComponent implements OnInit {
article: Article | null = null;

constructor(
  private route: ActivatedRoute,
  private articleService: ArticleService,
  private authService: AuthService,
){}

  ngOnInit(): void {
    const articleId = Number(this.route.snapshot.paramMap.get('id'));
    if (articleId) {
      this.loadArticleDetails(articleId);
    }
  }

  loadArticleDetails(id: number): void {
    this.articleService.getArticle(id).subscribe(
      (data: Article) => {
        this.article = data;
      },
      error => {
        console.error('Error fetching article details', error);
      }
    );
  }
  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
