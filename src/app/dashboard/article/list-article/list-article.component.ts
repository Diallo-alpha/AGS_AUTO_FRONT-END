import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { ArticleService } from '../../../services/articleservice.service';
import { Article } from '../../../models/ArticleModel';

@Component({
  selector: 'app-list-article',
  standalone: true,
  imports: [CommonModule, SidbarComponent, RouterModule],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.css'
})
export class ListArticleComponent implements OnInit {
  articles: Article[] = [];
  paginatedArticles: Article[] = [];
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  selectedFile: File | null = null; // Add this line

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.articleService.getArticles().subscribe(
      articles => {
        this.articles = articles;
        this.totalPages = Math.ceil(this.articles.length / this.itemsPerPage);
        this.updatePaginatedArticles();
      },
      error => console.error('Error loading articles:', error)
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
    } else {
      console.error('Veuillez sélectionner un fichier image valide.');
    }
  }

  updatePaginatedArticles() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedArticles = this.articles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedArticles();
  }

  deleteArticle(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articleService.deleteArticle(id).subscribe(
        () => {
          this.articles = this.articles.filter(article => article.id !== id);
          this.updatePaginatedArticles();
        },
        error => console.error('Error deleting article:', error)
      );
    }
  }
}
