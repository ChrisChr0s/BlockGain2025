🛠 Tech Stack

- **Frontend:** Expo (SDK 54) & React Native (Router, Reanimated, Crypto)
- **Auth:** Clerk Auth (clerk-expo) für sicheres User-Management
- **Blockchain:** @mysten/sui.js (Interaction & Transaction Building)
- **Backend:** Node.js/Express (Hosted on Render)
- **Database:** Neon Database (PostgreSQL)
- **Infrastruktur:** Upstash Redis (Rate Limiting für API-Security)

🚀 Erste Schritte (Setup)
Befolge diese Schritte, um das Projekt lokal auf deinem Rechner auszuführen.

1. Voraussetzungen
Stelle sicher, dass du Node.js und npm (oder yarn) installiert hast.
Expo Go App auf dem Smartphone installieren

3. Repository klonen

  git clone https://github.com/ChrisChr0s/BlockGain2025.git
  cd BlockGain2025/frontend

4. Abhängigkeiten installieren
   
  npm install
  npm install -g expo-cli

6. Umgebungsvariablen (.env)
Erstelle eine .env Datei im frontend Ordner und füge deine Keys hinzu:

EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=dein_clerk_key_hier
EXPO_PUBLIC_API_URL=[https://blockgain2025.onrender.com](https://blockgain2025.onrender.com)
DATABASE_URL=postgresql://neondb_owner:... 

5. App starten

  npx expo start
  
Scanne den QR-Code mit der Expo Go App auf deinem Handy (iOS oder Android).



👨‍💻 Autor
Christian Germar Peter Brauer

Student B.Sc. Informatik an der FU Berlin 

GitHub: ChrisChr0s
