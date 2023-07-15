# bookNotes
### Grundidee:
App erlaubt die Verwaltung aller Kindle Notizen und die Interaktion und Auseinandersetzung mit diesen.
### Umgesetzte Teile:
Backend mit NodeJS
- MongoDB als Datenbank: Templates für alle DatenObjekte implementiert
- Express als Server-Datenbank: komplettes Set an Routen umgesetzt für User, Login, Buch und Notiz
- Testing mit den Frameworks Jest und Supertest: Beispieldatensätze werden zum Testen in die Datenbank gespeichert und alle Routen werden getestet
- User-Authentifizierung mittels Token, Integration mit Middleware
- Middleware für Fehlermanagement
Frontend mit React:
- Login und Token-Authentifizierung
- Übersichtseite für Bücher
- Erster Entwurf für die Interaktion mit den Buchnotizen

### Umsetzung ausstehend:
- Frontend-Formulare für die Bearbeitung aller Datenobjekte
- Ansprechenderes Design
- Upload und Abgleich mit Notizen-Textdatei aus Kindle
