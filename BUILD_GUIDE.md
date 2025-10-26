# 🎤 Karaoke Car - Guida alla Creazione APK

## Metodo 1: Expo Prebuild + Gradle (In corso...)

Il build è attualmente in esecuzione. L'APK sarà disponibile in:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Metodo 2: EAS Build (Quando avrai un account)

1. Crea un account gratuito su https://expo.dev
2. Esegui: `eas login`
3. Configura il progetto: `eas build:configure`
4. Builda l'APK: `eas build --platform android --profile preview`

## Metodo 3: Expo Go (Per test rapidi)

1. Installa Expo Go sul telefono
2. Avvia: `npm start`
3. Scansiona il QR code
4. Testa l'app senza installare

## Configurazione API Gemini

Prima di creare l'APK finale, aggiorna la tua chiave API in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiKey": "LA_TUA_CHIAVE_GEMINI_REALE_QUI"
    }
  }
}
```

## Installazione APK

1. Abilita "Origini sconosciute" su Android
2. Trasferisci l'APK sul dispositivo
3. Installa toccando il file APK
4. Apri l'app Karaoke Car

## Risoluzione Problemi

- **Build fallisce**: Verifica che Java JDK 17+ sia installato
- **APK non si installa**: Controlla le impostazioni di sicurezza Android
- **App crasha**: Verifica che la chiave API Gemini sia configurata

## Dimensioni APK

- APK Debug: ~50-80 MB
- APK Release (ottimizzato): ~30-50 MB

## Note Importanti

- L'APK debug è solo per test, non per distribuzione
- Per produzione usa sempre build release firmati
- L'app richiede connessione internet per funzionare