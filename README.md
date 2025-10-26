# Karaoke Car Mobile

Un'app karaoke mobile per Android e iOS che aiuta a cantare in auto recuperando e sincronizzando i testi delle canzoni.

## Funzionalità

- Ricerca testi tramite artista e titolo
- Sincronizzazione automatica dei testi (formato LRC)  
- Modalità Auto ottimizzata per uso in veicolo
- Controlli di riproduzione touch-friendly
- Design nativo per dispositivi mobili
- Supporto cross-platform (Android & iOS)

## Tecnologie

- React Native con Expo
- TypeScript
- API Google Gemini per il recupero testi
- Expo Vector Icons
- React Native Community Slider

## Setup

### Prerequisiti

1. Installa Node.js (versione 16 o superiore)
2. Installa l'app Expo Go sul tuo dispositivo mobile:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

**Nota**: Non è necessario installare Expo CLI globalmente, utilizziamo `npx` per eseguire i comandi.

### Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Configura la chiave API Gemini in `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "apiKey": "LA_TUA_CHIAVE_GEMINI_QUI"
       }
     }
   }
   ```
4. Avvia l'app in modalità sviluppo:
   ```bash
   npm start
   ```

### Testare l'app

1. Apri l'app Expo Go sul tuo dispositivo
2. Scansiona il QR code mostrato nel terminale
3. L'app si aprirà automaticamente sul dispositivo

## Uso

1. **Ricerca**: Inserisci artista e titolo della canzone nel form
2. **Visualizzazione**: I testi verranno mostrati con sincronizzazione automatica  
3. **Controlli**: Usa play/pausa per controllare la sincronizzazione
4. **Modalità Auto**: Attiva per un'interfaccia con testo più grande e contrasto elevato

## Build per Produzione

### Android (APK)

```bash
npm run build:android
```

### iOS (solo su macOS)

```bash
npm run build:ios
```

**Nota**: Per i build di produzione è necessario configurare EAS Build. Segui la [documentazione EAS](https://docs.expo.dev/build/introduction/).

### Distribuzione tramite App Stores

Per pubblicare sugli store ufficiali, segui la [documentazione Expo](https://docs.expo.dev/distribution/app-stores/).

## Struttura del Progetto

```
├── App.tsx                 # Componente principale
├── app.json               # Configurazione Expo
├── package.json           # Dipendenze e script
├── babel.config.js        # Configurazione Babel
├── tsconfig.json         # Configurazione TypeScript
├── components/           # Componenti UI
│   ├── Icon.tsx         # Icone vettoriali
│   ├── SongInputForm.tsx # Form di ricerca
│   ├── LyricsDisplay.tsx # Visualizzazione testi
│   └── PlayerControls.tsx # Controlli riproduzione
├── hooks/               # Custom hooks
│   └── useLyricSync.ts  # Hook sincronizzazione
├── services/           # Servizi esterni
│   └── geminiService.ts # Integrazione API Gemini
└── types.ts           # Definizioni TypeScript
```

## Configurazione API Gemini

1. Vai su [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nuova chiave API
3. Aggiungi la chiave in `app.json` sotto `expo.extra.apiKey`

## Troubleshooting

### Problemi Comuni

1. **"expo: command not found"**: Usa `npm start` invece di `expo start` (utilizziamo npx automaticamente)
2. **Metro bundler non si avvia**: Pulisci la cache con `npm start -- --clear`
3. **Errori di dipendenze**: Elimina `node_modules` e `package-lock.json`, poi `npm install`
4. **API Gemini non funziona**: Verifica che la chiave API sia configurata correttamente in `app.json`
5. **"EMFILE: too many open files"**: Questo errore di solito non impedisce l'avvio dell'app, puoi ignorarlo

### Log e Debug

Per vedere i log dell'app:
```bash
expo logs --type=device
```

## Note

- L'app non può rilevare automaticamente la musica in riproduzione da altre app
- I testi devono essere inseriti manualmente tramite il form di ricerca
- La modalità Auto è ottimizzata per l'uso durante la guida (testi grandi, contrasto elevato)

## Licenza

MIT License
