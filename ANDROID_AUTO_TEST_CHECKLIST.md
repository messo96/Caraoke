# 🚗 Test Android Auto - Checklist Completa

## ℹ️ Informazioni Build

**Build ID**: `9d0cd941-85a8-4e23-91b7-f8357be0f1d8`
**Logs**: https://expo.dev/accounts/gioshy96/projects/karaoke-car-mobile/builds/9d0cd941-85a8-4e23-91b7-f8357be0f1d8

**Nuove funzionalità Android Auto aggiunte in questo build:**
- ✅ Notifiche media-style con metadata
- ✅ Sincronizzazione testi in tempo reale
- ✅ Integrazione servizio AndroidAutoService
- ✅ Controlli media per Android Auto
- ✅ Permessi e Intent Filters configurati

---

## 📋 Pre-requisiti per il Test

### Sul Telefono:
- [ ] APK installato (scaricare dal link EAS dopo il build)
- [ ] Android 10 o superiore
- [ ] Permessi app concessi (Storage, Notifiche)
- [ ] Google Play Services aggiornati

### Per Android Auto:
**Opzione A - Auto Reale:**
- [ ] Auto con Android Auto supportato
- [ ] Cavo USB certificato
- [ ] Android Auto abilitato nell'auto

**Opzione B - App Android Auto sul Telefono:**
- [ ] App "Android Auto" installata dal Play Store
- [ ] Modalità sviluppatore abilitata
- [ ] "Origini sconosciute" abilitato nelle impostazioni sviluppatore

---

## 🧪 Test Sequence

### 1️⃣ Test Base App (Senza Auto)

#### Test 1.1 - Ricerca con Autocompletamento
- [ ] Apri "Input Manuale"
- [ ] Digita almeno 2 caratteri (es. "Queen")
- [ ] **Verifica**: Appaiono suggerimenti con copertina
- [ ] Clicca su una canzone
- [ ] **Verifica**: Testi caricati e riproduzione avviata

#### Test 1.2 - Auto-rilevamento
- [ ] Apri "Auto-Rilevamento"
- [ ] Concedi permesso libreria media
- [ ] Avvia rilevamento
- [ ] Riproduci musica sul telefono
- [ ] **Verifica**: App rileva la canzone

#### Test 1.3 - Modalità Landscape
- [ ] Avvia una canzone
- [ ] Ruota telefono in landscape
- [ ] **Verifica**: UI si adatta, testi grandi e leggibili

---

### 2️⃣ Test Notifiche Media (Pre-Android Auto)

#### Test 2.1 - Notifica Base
- [ ] Avvia una canzone con testi sincronizzati
- [ ] Swipe giù per aprire pannello notifiche
- [ ] **Verifica notifica mostra**:
  - Titolo canzone
  - Nome artista
  - Testo corrente
  - Icona app

#### Test 2.2 - Aggiornamento Testi in Notifica
- [ ] Tieni aperta la notifica durante riproduzione
- [ ] **Verifica**: Il testo nella notifica cambia seguendo la canzone
- [ ] Pausa/Play dalla notifica
- [ ] **Verifica**: App risponde correttamente

#### Test 2.3 - Persistenza Notifica
- [ ] Avvia canzone
- [ ] Minimizza app (Home)
- [ ] **Verifica**: Notifica rimane visibile
- [ ] Chiudi app (swipe via)
- [ ] **Verifica**: Notifica scompare

---

### 3️⃣ Test Android Auto - App sul Telefono

#### Setup Android Auto sul Telefono:
```
1. Installa "Android Auto" da Play Store
2. Apri Android Auto
3. Vai in Menu (☰) → Impostazioni
4. Scorri fino a "Versione"
5. Tap su "Versione" 10 volte → Modalità sviluppatore attiva
6. Torna indietro
7. Menu → Impostazioni → Impostazioni sviluppatore
8. Abilita "Origini sconosciute"
```

#### Test 3.1 - App Visibile in Android Auto
- [ ] Apri app "Android Auto"
- [ ] Avvia Karaoke Car in background
- [ ] Vai alla sezione "Media" in Android Auto
- [ ] **Verifica**: Karaoke Car appare nella lista

#### Test 3.2 - Metadata in Android Auto
- [ ] Apri Karaoke Car da Android Auto
- [ ] Cerca e avvia una canzone
- [ ] **Verifica in interfaccia Android Auto**:
  - Titolo canzone visibile
  - Artista visibile
  - Testo corrente visibile
  - UI ottimizzata per auto

#### Test 3.3 - Controlli Android Auto
- [ ] Pausa/Play da interfaccia Android Auto
- [ ] **Verifica**: App risponde
- [ ] Cambia canzone
- [ ] **Verifica**: Metadata si aggiornano

#### Test 3.4 - Sincronizzazione Testi
- [ ] Avvia canzone con testi LRC
- [ ] Osserva interfaccia Android Auto
- [ ] **Verifica**: Testi cambiano in tempo reale
- [ ] Confronta con app in primo piano
- [ ] **Verifica**: Testi sincronizzati perfettamente

---

### 4️⃣ Test Android Auto - Auto Reale

#### Test 4.1 - Connessione Auto
- [ ] Collega telefono all'auto via USB
- [ ] **Verifica**: Android Auto si avvia automaticamente
- [ ] Oppure avvia manualmente da display auto

#### Test 4.2 - Karaoke Car in Auto
- [ ] Tocca icona "Media" su display auto
- [ ] **Verifica**: Karaoke Car appare nella lista app
- [ ] Seleziona Karaoke Car
- [ ] **Verifica**: App si apre su display auto

#### Test 4.3 - Riproduzione in Auto
- [ ] Sul telefono: avvia Karaoke Car
- [ ] Sul telefono: cerca e avvia canzone
- [ ] **Verifica display auto mostra**:
  - Titolo canzone
  - Artista
  - Testo corrente
  - Controlli play/pause
  
#### Test 4.4 - Controlli da Auto
- [ ] Usa controlli sul display auto per:
  - Pausa ▶️ **Verifica**: App si pausa
  - Play ⏸️ **Verifica**: App riprende
- [ ] Usa controlli sul volante
- [ ] **Verifica**: App risponde ai comandi volante

#### Test 4.5 - Testi Sincronizzati in Auto
- [ ] Avvia canzone con testi LRC
- [ ] **Verifica su display auto**:
  - Testi cambiano automaticamente
  - Timing corretto con musica
  - Font leggibile da guidatore (passeggero!)
  - Contrasto adeguato

#### Test 4.6 - Disconnessione
- [ ] Scollega USB durante riproduzione
- [ ] **Verifica**: App continua sul telefono
- [ ] Ricollega USB
- [ ] **Verifica**: Android Auto riprende automaticamente

---

## 🐛 Troubleshooting

### Problema: App non appare in Android Auto
**Soluzioni**:
1. Verifica di usare APK standalone (non Expo Go)
2. Abilita "Origini sconosciute" in Android Auto
3. Riavvia Android Auto
4. Verifica permessi app (Notifiche, Storage)

### Problema: Notifiche non si aggiornano
**Soluzioni**:
1. Verifica permessi notifiche nelle impostazioni
2. Disabilita risparmio energetico per Karaoke Car
3. Controlla che la canzone abbia testi sincronizzati (LRC)

### Problema: Testi non sincronizzati
**Soluzioni**:
1. Verifica che la canzone abbia formato LRC
2. Controlla che i testi siano stati caricati (non solo testo raw)
3. Prova a riavviare la canzone

### Problema: Controlli non funzionano
**Soluzioni**:
1. Riavvia l'app
2. Verifica permesso `MEDIA_CONTENT_CONTROL`
3. Controlla log per errori

---

## 📊 Report Test

### Risultati Attesi:

| Feature | Test | Risultato Atteso |
|---------|------|------------------|
| Ricerca Autocomplete | 1.1 | ✅ Suggerimenti con copertina |
| Auto-rilevamento | 1.2 | ✅ Rileva musica dispositivo |
| Modalità Landscape | 1.3 | ✅ UI adattata |
| Notifica Base | 2.1 | ✅ Metadata visibili |
| Aggiornamento Testi | 2.2 | ✅ Testi cambiano in notifica |
| Persistenza | 2.3 | ✅ Notifica persiste in background |
| Visibilità Android Auto | 3.1/4.2 | ✅ App nella lista media |
| Metadata Android Auto | 3.2/4.3 | ✅ Info complete su display |
| Controlli | 3.3/4.4 | ✅ Play/Pause funzionanti |
| Sincronizzazione | 3.4/4.5 | ✅ Testi tempo reale |
| Connessione/Disconnessione | 4.6 | ✅ Transizione fluida |

### Compilare dopo il test:

**Data Test**: _______________
**Dispositivo**: _______________
**Versione Android**: _______________
**Auto/Android Auto App**: _______________

**Test Passati**: _____ / _____
**Test Falliti**: _____ / _____

**Note aggiuntive**:
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

## 🎯 Criteri di Successo

Per considerare l'implementazione Android Auto **completa e funzionante**:

### Requisiti Minimi (Must Have):
- ✅ App installabile da APK standalone
- ✅ Notifiche media con metadata (titolo, artista)
- ✅ Testi visibili in notifica
- ✅ Controlli play/pause funzionanti
- ✅ App visibile in Android Auto

### Requisiti Desiderabili (Should Have):
- ✅ Testi sincronizzati in tempo reale
- ✅ Aggiornamenti notifica fluidi
- ✅ UI ottimizzata per landscape
- ✅ Rilevamento automatico modalità auto
- ✅ Transizioni fluide connessione/disconnessione

### Requisiti Extra (Nice to Have):
- ⚠️ MediaBrowserService nativo (richiede codice Java)
- ⚠️ Voice commands (richiede Google Assistant integration)
- ⚠️ Playlist browsing in auto (richiede MediaSession API avanzate)

---

## 📞 Supporto Post-Test

### Se tutti i test passano:
🎉 **Congratulazioni!** L'implementazione Android Auto è completa e funzionante!

**Prossimi passi**:
1. Pubblicare su Play Store
2. Richiedere review Google per Android Auto
3. Documentare eventuali limitazioni per gli utenti

### Se alcuni test falliscono:
🔧 **Debug necessario**

**Passi da seguire**:
1. Controllare log EAS Build per errori di compilazione
2. Verificare versioni pacchetti in `package.json`
3. Testare su dispositivo diverso
4. Controllare permessi Android in `app.json`
5. Consultare `ANDROID_AUTO_GUIDE.md` per soluzioni comuni

### Per assistenza:
- Logs build: https://expo.dev/accounts/gioshy96/projects/karaoke-car-mobile/builds/
- Documentazione Expo: https://docs.expo.dev
- Android Auto docs: https://developer.android.com/training/cars

---

**Build completato**: ⏳ In attesa...
**Download APK**: ⏳ Link disponibile al termine build...
**Testing iniziato**: _______________
**Testing completato**: _______________
