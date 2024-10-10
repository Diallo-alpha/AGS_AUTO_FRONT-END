import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Article } from '../models/ArticleModel';
import { ArticleService } from '../services/articleservice.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice.service';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { CommentaireService } from '../services/commentaire.service';
import { Commentaire } from '../models/commentaireModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-article',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule, NavConnectComponent, FormsModule],
  templateUrl: './detail-article.component.html',
  styleUrl: './detail-article.component.css'
})
export class DetailArticleComponent implements OnInit {
  article: Article | null = null;
  commentaires: Commentaire[] = [];
  newCommentaire: Commentaire = {
    nom_complet: '',
    contenu: '',
    article_id: 0
  };

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authService: AuthService,
    private commentaireService: CommentaireService
  ) {}

  ngOnInit(): void {
    const articleId = Number(this.route.snapshot.paramMap.get('id'));
    if (articleId) {
      this.loadArticleDetails(articleId);
      this.loadCommentaires(articleId);
    }
  }

  loadArticleDetails(id: number): void {
    this.articleService.getArticle(id).subscribe(
      (data: Article) => {
        this.article = data;
        this.newCommentaire.article_id = data.id || 0;
      },
      error => {
        console.error('Error fetching article details', error);
      }
    );
  }

  loadCommentaires(articleId: number): void {
    this.commentaireService.getCommentairesByArticle(articleId).subscribe(
      (commentaires: Commentaire[]) => {
        this.commentaires = commentaires;
      },
      error => {
        console.error('Error fetching commentaires', error);
      }
    );
  }

  createCommentaire(): void {
    this.commentaireService.createCommentaire(this.newCommentaire).subscribe(
      (commentaire: Commentaire) => {
        this.commentaires.push(commentaire);
        this.newCommentaire = {
          nom_complet: '',
          contenu: '',
          article_id: this.article?.id || 0
        };
      },
      error => {
        console.error('Error creating commentaire', error);
      }
    );
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}
