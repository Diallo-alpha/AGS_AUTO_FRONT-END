import { Component, OnInit, ViewChild } from '@angular/core';
import { StatistiqueService } from '../../services/statistique.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { SidbarComponent } from './../sidbar/sidbar.component';

@Component({
  selector: 'app-statique',
  standalone: true,
  imports: [SidbarComponent, CommonModule, NgChartsModule],
  templateUrl: './statique.component.html',
  styleUrls: ['./statique.component.css']
})
export class StatiqueComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Structure des statistiques détaillées
  public contentStats = {
    formations: {
      total: 0,
      withVideosPercentage: 0,
      averageVideosPerFormation: 0
    },
    videos: {
      total: 0,
      withResourcesPercentage: 0,
      averageResourcesPerVideo: 0
    },
    resources: {
      total: 0,
      averagePerVideo: 0
    },
    lastUpdate: ''
  };

  // Configuration du Doughnut Chart
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Répartition Des Utilisateurs',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      }
    }
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Étudiants', 'Clients', 'Administrateurs'],
    datasets: [{
      data: [30, 50, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)'
      ],
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1,
      label: 'Répartition des utilisateurs'
    }]
  };

  public doughnutChartType: ChartType = 'doughnut';

  // Configuration mise à jour du Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e0e0e0',
          drawBorder: false
        },
        ticks: {
          stepSize: 10,
          font: {
            size: 12
          }
        },
        max: 100
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Statistiques Mensuelles',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false
      }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
    datasets: [{
      data: [65, 59, 80, 81, 56, 55, 0],
      backgroundColor: [
        'rgba(255, 182, 193, 0.7)',  // Rose pastel
        'rgba(255, 218, 185, 0.7)',  // Pêche
        'rgba(255, 255, 185, 0.7)',  // Jaune pastel
        'rgba(176, 224, 230, 0.7)',  // Bleu pastel
        'rgba(173, 216, 230, 0.7)',  // Bleu clair
        'rgba(221, 160, 221, 0.7)',  // Violet pastel
        'rgba(240, 240, 240, 0.7)'   // Gris très clair
      ],
      borderColor: [
        'rgba(255, 182, 193, 1)',
        'rgba(255, 218, 185, 1)',
        'rgba(255, 255, 185, 1)',
        'rgba(176, 224, 230, 1)',
        'rgba(173, 216, 230, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(240, 240, 240, 1)'
      ],
      borderWidth: 1,
      barThickness: 40
    }]
  };

  public barChartType: ChartType = 'bar';

  constructor(private statistique: StatistiqueService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadContentStats();
  }

  // Chargement des statistiques utilisateurs
  private loadStats(): void {
    this.statistique.getUserStats().subscribe({
      next: (response) => {
        if (response?.data?.chartData) {
          const chartData = response.data.chartData;
          this.doughnutChartData.labels = chartData.labels;
          this.doughnutChartData.datasets[0].data = chartData.datasets[0].data;
          this.chart?.update();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques utilisateurs:', error);
      }
    });
  }

  // Chargement des statistiques de contenu
  private loadContentStats(): void {
    this.statistique.getContentStats().subscribe({
      next: (response) => {
        if (response?.data) {
          const { statistics, chartData, lastUpdate } = response.data;

          // Mise à jour des statistiques détaillées
          this.contentStats = {
            formations: {
              total: statistics.formations.total,
              withVideosPercentage: statistics.formations.with_videos_percentage,
              averageVideosPerFormation: statistics.formations.average_videos_per_formation
            },
            videos: {
              total: statistics.videos.total,
              withResourcesPercentage: statistics.videos.with_resources_percentage,
              averageResourcesPerVideo: statistics.videos.average_resources_per_video
            },
            resources: {
              total: statistics.resources.total,
              averagePerVideo: statistics.resources.average_per_video
            },
            lastUpdate: lastUpdate
          };

          // Mise à jour du graphique en barres
          if (chartData?.content_distribution) {
            this.barChartData.datasets[0].data = chartData.content_distribution.datasets[0].data;
            this.barChartData.datasets[0].backgroundColor = chartData.content_distribution.datasets[0].backgroundColor;
            this.chart?.update();
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques de contenu:', error);
      }
    });
  }

  public getMaxTotal(): number {
    return Math.max(
      this.contentStats.formations.total,
      this.contentStats.videos.total,
      this.contentStats.resources.total
    );
  }

  // Méthode pour forcer la mise à jour des graphiques
  public updateCharts(): void {
    this.chart?.update();
  }
}
