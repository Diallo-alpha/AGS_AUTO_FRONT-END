import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ArticleService } from '../services/articleservice.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { ReduirePipe } from '../pipe/reduire';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule, NavConnectComponent, ReduirePipe],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  articles: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6; // Nombre d'articles par page
  totalItems: number = 0;
  pages: number[] = [];

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe((data) => {
      this.articles = data;
      this.totalItems = data.length;
      this.calculatePages();
    });
  }

  calculatePages(): void {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({length: pageCount}, (_, i) => i + 1);
  }

  get paginatedArticles(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.articles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
