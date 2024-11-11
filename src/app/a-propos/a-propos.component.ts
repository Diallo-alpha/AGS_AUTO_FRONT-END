import { Component } from '@angular/core';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-a-propos',
  standalone: true,
  imports: [CommonModule, NavConnectComponent, NavbarComponent, FooterComponent],
  templateUrl: './a-propos.component.html',
  styleUrl: './a-propos.component.css'
})
export class AProposComponent {
  videoUrl: SafeResourceUrl;
  showVideo: boolean = false;
  videoId: string = 'phPx4_Qz_i0';
  videoThumbnail: string;

  constructor(private sanitizer: DomSanitizer) {
    // URL de la vidéo pour l'embed
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.videoId}?autoplay=1`
    );

    // URL de la vignette en haute qualité
    this.videoThumbnail = `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
  }
  experts = [
    {
      name: 'Alpha Diallo',
      role: 'CEO',
      image: 'assets/images/alphaceo.jpeg',
      alt: 'Professional headshot of a confident businessman in a white shirt with a thoughtful expression'
    },
    {
      name: 'Assane Camara',
      role: 'Expert Mechanic',
      image: 'assets/images/assanacamara.jpg',
      alt: 'Professional portrait of a man in a white collarless shirt against a light background'
    },
    {
      name: 'Mari Diouf',
      role: 'Expert Mechanic',
      image: 'assets/images/mandiouf.jpg',
      alt: 'Smiling person with glasses and braids sitting at a desk with a laptop showing Apple logo'
    }
  ];

  // Données des témoignages
  testimonials = [
    {
      text: "Grâce à AutoService Global, j'ai pu accéder à des formations en ligne sur les nouvelles technologies automobiles et acheter des pièces de qualité en toute confiance. L'équipe m'a aidé à améliorer mes compétences et à offrir à mes clients des services modernes et fiables.",
      author: 'Serigne saliou niang',
      image: 'https://replicate.delivery/yhqm/oa7QXLRjFraVEt2QfYOzTK5xuOuCce2IMegEpIFGxXQisyUnA/out-0.png'
    },
    {
      text: "AutoService Global m'a permis de trouver des pièces détachées authentiques rapidement et facilement. Depuis que j'utilise leur plateforme, je peux garantir des réparations de qualité à mes clients, en toute confiance. Un vrai atout pour mon atelier !",
      author: 'Mohamadou ndong',
      image: 'https://replicate.delivery/yhqm/oa7QXLRjFraVEt2QfYOzTK5xuOuCce2IMegEpIFGxXQisyUnA/out-0.png'
    }
  ];

  // CEO data
  ceoInfo = {
    image: 'https://replicate.delivery/yhqm/Ov6ZH2CQxUaGJJ9svl05nsqghvdDEe4VFoNe8io265SfzyUnA/out-0.png',
    name: 'Alpha diallo',
    title: 'CEO',
    quote: 'AutoService Global (ASG) : votre plateforme dédiée aux mécaniciens sénégalais, proposant pièces détachées authentiques, formations spécialisées et réseau de garages certifiés pour des réparations de qualité et en toute sécurité'
  };

  // Méthode pour gérer le clic sur la vidéo
  openVideo(): void {
    this.showVideo = true;
  }

  closeVideo(): void {
    this.showVideo = false;
  }
}
