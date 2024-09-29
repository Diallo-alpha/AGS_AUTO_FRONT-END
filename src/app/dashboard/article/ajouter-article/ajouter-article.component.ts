import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { ArticleService } from '../../../services/articleservice.service';

@Component({
  selector: 'app-ajouter-article',
  standalone: true,
  imports: [CommonModule, SidbarComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './ajouter-article.component.html',
  styleUrls: ['./ajouter-article.component.css']  // Correction ici
})
export class AjouterArticleComponent {
  articleForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService
  ) {
    this.articleForm = this.formBuilder.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit() {
    if (this.articleForm.valid) {
      const formData = new FormData();
      formData.append('titre', this.articleForm.get('titre')?.value);
      formData.append('description', this.articleForm.get('description')?.value);

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
      }

      this.articleService.createArticle(formData).subscribe(
        response => {
          console.log('Article ajouté avec succès', response);
          // Rediriger vers la liste des articles ou afficher un message de succès
        },
        error => {
          console.error('Erreur lors de l\'ajout de l\'article', error);
          if (error.error && error.error.errors) {
            console.error('Détails des erreurs de validation:', error.error.errors);
          }
          // Afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }
}
