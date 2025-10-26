# 🚀 Come Creare l'APK - Guida Completa

## ✅ Metodo Raccomandato: Account Expo Gratuito

### 1. Crea Account Expo (2 minuti)
- Vai su https://expo.dev
- Clicca "Sign up" 
- Usa email + password (gratuito)

### 2. Fai Login
```bash
eas login
```

### 3. Configura il Progetto
```bash
eas build:configure
```

### 4. Crea l'APK
```bash
eas build --platform android --profile preview
```

### 5. Scarica l'APK
- Riceverai un link per scaricare l'APK
- Potrai condividerlo via email/WhatsApp

## 🔧 Configurazione Pre-Build

Prima di creare l'APK, aggiorna la tua chiave API Gemini in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiKey": "AIzaSyC-LA_TUA_CHIAVE_REALE_QUI"
    }
  }
}
```

## 📱 Installazione APK su Android

1. **Scarica l'APK** dal link che riceverai
2. **Abilita installazioni da origini sconosciute**:
   - Impostazioni > Sicurezza > Origini sconosciute ✓
3. **Installa l'APK** toccandolo nel download
4. **Apri l'app** e inserisci artista/titolo per testare

## 💡 Vantaggi Account Expo Gratuito

- ✅ Build nel cloud (non serve Android Studio)
- ✅ 100% gratuito per progetti personali
- ✅ APK pronti in 10-15 minuti
- ✅ Condivisione facile via link
- ✅ Build per Android e iOS

## 🔄 Flusso Completo

1. Configura API Key → 2. `eas login` → 3. `eas build:configure` → 4. `eas build --platform android --profile preview` → 5. Scarica APK → 6. Installa e testa!

## 📋 Cosa Ti Serve

- Account Expo (gratuito)
- Chiave API Google Gemini
- Dispositivo Android per test

**Tempo stimato**: 15-20 minuti totali (inclusa registrazione)