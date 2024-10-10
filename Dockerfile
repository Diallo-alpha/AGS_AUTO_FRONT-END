# Utiliser une image Node.js officielle comme base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer @angular/cli globalement
RUN npm install -g @angular/cli

# Copier les fichiers du projet
COPY . .

# Exposer le port utilisé par ng serve (par défaut 4200)
EXPOSE 4200

# Commande pour démarrer l'application
CMD ["ng", "serve", "--host", "0.0.0.0"]
