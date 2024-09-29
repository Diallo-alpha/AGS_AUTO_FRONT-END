import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/articleservice.service';
import { Article } from '../../../models/ArticleModel';
import { SidbarComponent } from '../../sidbar/sidbar.component';

@Component({
  selector: 'app-modifier-article',
  standalone: true,
  imports: [SidbarComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './modifier-article.component.html',
  styleUrl: './modifier-article.component.css'
})
export class ModifierArticleComponent implements OnInit {
  articleForm: FormGroup;
  selectedFile: File | null = null;
  articleId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService, // Injecter le service
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.articleForm = this.formBuilder.group({
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.articleId = +this.route.snapshot.paramMap.get('id')!;
    if (this.articleId) {
      this.articleService.getArticle(this.articleId).subscribe((article: Article) => {
        this.articleForm.patchValue({
          titre: article.titre,
          description: article.description
        });
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.articleForm.valid && this.articleId) {
      const formData = new FormData();
      formData.append('titre', this.articleForm.get('titre')?.value);
      formData.append('description', this.articleForm.get('description')?.value);

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      this.articleService.updateArticle(this.articleId, formData).subscribe({
        next: () => this.router.navigate(['/dashboard/article']),
        error: (error) => console.error('Erreur lors de la mise à jour de l\'article:', error)
      });
    }
  }
}
