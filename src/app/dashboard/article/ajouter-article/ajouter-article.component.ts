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
  styleUrls: ['./ajouter-article.component.css']
})
export class AjouterArticleComponent {
  articleForm: FormGroup;
  selectedFile: File | null = null;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService
  ) {
    this.articleForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      photo: [null, Validators.required]
    });
  }

  get f() {
    return this.articleForm.controls;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.articleForm.patchValue({
        photo: file
      });
      this.articleForm.get('photo')?.updateValueAndValidity();
    } else {
      this.selectedFile = null;
      this.articleForm.get('photo')?.setErrors({ invalidType: true });
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.articleForm.invalid || !this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.articleForm.get('titre')?.value);
    formData.append('description', this.articleForm.get('description')?.value);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.articleService.createArticle(formData).subscribe(
      response => {
        console.log('Article ajouté avec succès', response);
        this.articleForm.reset();
        this.submitted = false;
        this.selectedFile = null;
        // Rediriger vers la liste des articles ou afficher un message de succès
      },
      error => {
        console.error('Erreur lors de l\'ajout de l\'article', error);
        if (error.error && error.error.errors) {
          console.error('Détails des erreurs de validation:', error.error.errors);
        }
      }
    );
  }
}
