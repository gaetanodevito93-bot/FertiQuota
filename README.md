<div align="center">

# 🌿 FertiQuota

**Calcolatore professionale per la fertirrigazione in coco coir**

*Dalla ricetta nutritiva alle soluzioni madri concentrate — con motore chimico-termodinamico quantitativo (Davies/SIT, speciazione accoppiata), compatibilità serbatoi A/B/C e scheda operativa stampabile.*

[![Version](https://img.shields.io/badge/versione-v1.0-2d5a3d)](index.html)
[![License: Proprietaria](https://img.shields.io/badge/licenza-proprietaria%20%C2%B7%20tutti%20i%20diritti%20riservati-b03a2e)](LICENSE)
[![Made with](https://img.shields.io/badge/stack-HTML%20%C2%B7%20CSS%20%C2%B7%20Vanilla%20JS-f8f6f1)](index.html)
[![No backend](https://img.shields.io/badge/backend-nessuno-4a8c5e)](#-privacy-e-sicurezza)
[![Tests](https://img.shields.io/badge/test-Playwright%20%C2%B7%20S1%E2%80%93S40-2471a3)](tests)
[![i18n](https://img.shields.io/badge/lingue-IT%20%C2%B7%20EN-d4660a)](#-internazionalizzazione)

[Funzionalità](#-funzionalità) · [Come si usa](#-come-si-usa) · [Struttura](#-struttura-del-progetto) · [Test](#-test) · [Documentazione](MANUALE_TECNICO.md)

</div>

---

## Che cos'è

**FertiQuota** trasforma una ricetta nutritiva — espressa come dosi di sali o come target di elementi in mg/L — nelle **soluzioni madri concentrate** da preparare nei serbatoi A, B ed eventualmente C. A differenza dei semplici calcolatori di dosi, integra un **motore chimico-termodinamico quantitativo** (speciazione accoppiata con 12 coppie ioniche bivalenti, attività dipendente da temperatura `Davies` → `SIT`, indici di saturazione `CaSO₄`, `CaHPO₄`, `CaCO₃`, struvite, `ACP`, `OCP` e brucite `Mg(OH)₂`, bilancio protonico nei serbatoi, solubilità a ione comune e stabilità competitiva `Ca²⁺↔Fe³⁺` sui chelati) e un **sistema di auto-risoluzione** che sposta i sali tra serbatoi, gestisce acido automatico, **mix a due acidi (`H₃PO₄ + HNO₃`)** e **`H₂SO₄ 38%`**, e ribilancia le dosi per riportare la soluzione in zona sicura.

Il tutto in **un unico file HTML** — nessuna installazione, nessun backend, nessun account, nessun tracciamento senza consenso (GDPR Consent Mode v2). Si apre con un doppio clic in qualsiasi browser moderno, su desktop e mobile.

Il calcolo tiene conto di:

- 💧 l'**acqua di partenza** — i minerali già presenti vengono sottratti dai target;
- ⚗️ la **compatibilità chimica** tra i sali — cosa può convivere nello stesso serbatoio senza precipitare;
- 🧪 il **fattore di diluizione** — quanto è concentrata la madre rispetto alla soluzione finale;
- 📉 il **pH della soluzione finale** — che governa la solubilità dei fosfati di calcio;
- 📦 la **disponibilità reale in magazzino** degli ingredienti.

---

## ✨ Funzionalità

| Area | Cosa fa |
|---|---|
| **Motore chimico** | Speciazione accoppiata (`speciateFull`) con 12 coppie ioniche Ca/Mg/SO₄/PO₄/CO₃, indici di saturazione termodinamici (`CaSO₄`, `CaHPO₄`, `CaCO₃`, struvite, `ACP`, `OCP`, brucite `Mg(OH)₂`), modello ibrido `Davies` → `SIT` dipendente da T (`debyeHuckelA(T)`), `pKa(T)`, stima EC e bilancio in meq/L. |
| **Solver a target (NNLS)** | Raggiunge i target di elementi in mg/L con minimi quadrati non negativi (Lawson-Hanson), pesi per elemento, vincolo NH₄ ≤ 10%, stabilità competitiva Ca²⁺↔Fe³⁺ sui chelati e solo ingredienti in scorta. Lo stesso solver ribilancia le ricette in grammi per l'acqua di partenza e sostituisce gli ingredienti mancanti preservando il profilo. |
| **Compatibilità serbatoi** | Matrice di incompatibilità tra gruppi ionici, assegnazione automatica ai serbatoi A/B/C, risolutore di pH per bilancio protonico nei serbatoi, solubilità estesa (ione comune K₂SO₄/KNO₃/KH₂PO₄ + check freddo notturno 10 °C). Quando servono **3 soluzioni madri** il Serbatoio C si attiva da solo. |
| **Auto-risoluzione** | Sposta i sali, sceglie da solo l'acido migliore (`Automatico`), gestisce il **Mix 2 acidi** (`H₃PO₄ + HNO₃`) e **H₂SO₄ 38%**, e ribilancia le dosi quando la soluzione esce dalla zona sicura. |
| **Verifica di sicurezza** | Controlla precipitazioni, rapporti antagonisti, soglie NH₄/Na/Cl e segnala rischi agronomici. |
| **Catalogo ingredienti** | 22 sali predefiniti + fertilizzanti custom, con composizione, prezzo, note e gestione della **scorta** reale in magazzino. |
| **Ricette** | 11 colture builtin (pomodoro, lattuga, cetriolo, fragola…) con fasi di crescita; editor per ricette e target personalizzati. |
| **Output operativo** | Scheda miscela stampabile con dosi in grammi per serbatoio, EC/costi attesi, ordine di scioglimento e checklist di preparazione. |
| **Backup dati** | Export/import JSON di catalogo, scorta, ricette e profili acqua; reset di fabbrica con doppia conferma. |
| **Bilingue** | Interfaccia completa italiano/inglese, commutabile a runtime senza ricaricare. |
| **App installabile (PWA)** | Quando è servita online, si installa sul dispositivo (desktop/mobile) e funziona **offline** grazie al service worker. |

---

## 🚀 Come si usa

Nessuna build, nessuna dipendenza per l'uso quotidiano.

1. Scarica o clona il repository.
2. Apri **[`index.html`](index.html)** con un doppio clic nel tuo browser.
3. Segui il flusso lineare dell'interfaccia (da sinistra a destra):

```
① 💧 ACQUA  →  ② 🌿 RICETTE  →  ③ ⚗️ CALCOLA  →  (④ 📦 CATALOGO · ⑤ 💾 DATI a supporto)
```

- **Acqua** — inserisci l'analisi dell'acqua di partenza o scegli un preset.
- **Ricette** — scegli coltura e fase, oppure crea/clona una ricetta tua, poi premi *→ Calcola*.
- **Calcola** — imposta volumi serbatoi, diluizione, pH finale (default 5.8) e acido (automatico o a scelta); premi *Calcola Dosaggi* e ottieni la scheda completa con dosi, verifiche e stampa.
- **Catalogo** — gestisci fertilizzanti, prezzi e scorta.
- **Dati** — esporta/importa il backup JSON o ripristina i valori di fabbrica.

> 💡 Il file funziona anche **offline**: l'unica risorsa esterna sono i font Google, in loro assenza si usano i font di sistema.

### 📲 Installazione come app (PWA)

FertiQuota è anche una **Progressive Web App**. Quando è **servita via HTTPS** (es. GitHub Pages o qualsiasi hosting statico), il browser propone di **installarla** come app: icona sul dispositivo, avvio a tutto schermo e **funzionamento offline** (l'app viene messa in cache da un service worker).

- I service worker richiedono un contesto sicuro (`https://` o `localhost`): aperta con doppio clic da `file://` l'app resta pienamente funzionante, ma **non** installabile.
- File a supporto della PWA (accanto all'app): [`manifest.webmanifest`](manifest.webmanifest), [`sw.js`](sw.js), [`icons/`](icons). Sono opzionali: non influiscono sull'uso da `file://`.
- Percorsi relativi → la PWA funziona anche servita da una sottocartella. Dopo un aggiornamento dell'app, incrementa `CACHE_VERSION` in `sw.js` per propagare la nuova versione.

---

## 🗂 Struttura del progetto

```
├── index.html              # L'applicazione completa (CSS + markup + JS in un solo file)
├── MANUALE_TECNICO.md      # Manuale tecnico: architettura, motore chimico, solver, sicurezza
└── tests/
    ├── run-tests.js        # Suite Playwright (S1–S40) sull'app reale in Chromium headless
    ├── hooks/pre-commit    # Esegue la suite a ogni commit che tocca app o test
    └── README.md           # Cosa copre ogni sezione di test
.github/workflows/test.yml  # Stessa suite su GitHub Actions a ogni push/PR
```

---

## 🔒 Privacy e sicurezza

- **Zero backend, privacy by default (GDPR)**: nessun server e nessun account; i dati di calcolo restano nel `localStorage` del browser. Font ospitati in locale (zero Google Fonts). Statistiche aggregate (GA4) ed eventuali annunci sono bloccati preventivamente tramite Google Consent Mode v2 finché l'utente non presta consenso esplicito.
- **Codice difensivo**: ogni lettura da `localStorage` passa per `safeParse` (un dato corrotto degrada ai default invece di bloccare l'app); ogni testo salvato o importato è sanificato (`stripTags`, `esc`, validazione di nomi e ID) contro l'injection HTML.
- **Input immutabili**: la pipeline di calcolo lavora sempre su copie — premere *Calcola* N volte non altera mai i dati inseriti.

---

## 🌍 Internazionalizzazione

Interfaccia completa **italiano / inglese** con architettura a tre livelli: markup statico (`data-i18n`), stringhe generate da JS (`t()`, `TT()`) e traduzioni dei dati **solo in visualizzazione** (i dati salvati dall'utente restano in italiano e non vengono migrati). La lingua persiste tra le sessioni.

---

## 🧪 Test

La suite esegue l'**app reale** in Chromium headless (Playwright) e verifica motore chimico, solver, sicurezza, persistenza, GDPR/SEO e UI — 40 sezioni (S1–S40) che includono benchmark termodinamici PHREEQC/Visual MINTEQ, golden test sul bilancio ionico e sull'EC, invarianti e **fedeltà al profilo** su tutte le fasi builtin, condizioni KKT del solver NNLS, regressioni per ogni bug del motore corretto, stress test, round-trip di persistenza e fuzzing dell'import. Gira in ~10 secondi, a ogni commit (hook) e a ogni push (GitHub Actions).

```bash
# Requisiti: Node.js ≥ 18
npm install playwright
npx playwright install chromium

# Esecuzione
node tests/run-tests.js
```

Exit code `0` = tutti i test passati · `1` = almeno un fallimento · `2` = errore della suite.

Per eseguirla automaticamente a ogni commit che tocca l'app: `git config core.hooksPath tests/hooks`.
Dettagli in **[`tests/README.md`](tests/README.md)**.

---

## 📖 Documentazione

Il **[Manuale Tecnico](MANUALE_TECNICO.md)** (17 capitoli) documenta in dettaglio filosofia di progetto, organizzazione del file, motore chimico, solver NNLS, sistema di compatibilità, verifica di sicurezza, persistenza, i18n, limiti/assunzioni e un glossario dei termini agronomici e chimici.

---

## ⚠️ Avvertenze

- Le soglie e le ricette sono calibrate per la coltivazione in **coco coir**; per NFT, lana di roccia o suolo i profili vanno adattati.
- L'EC è **stimata**: va sempre verificata col conduttimetro. Il motore verifica la chimica della soluzione, **non** sostituisce il giudizio agronomico.
- Acidi e basi (HNO₃, H₃PO₄, H₂SO₄, KOH) sono pericolosi: le prescrizioni presuppongono DPI e procedura corretta.

---

## 🛠️ Sviluppo

Progetto proprietario: non si accettano contributi esterni, fork o redistribuzioni senza autorizzazione scritta. Le linee guida di sviluppo interne (test, convenzioni) sono in **[CONTRIBUTING.md](CONTRIBUTING.md)**.

---

## 📄 Licenza

© 2026 Gaetano De Vito — **Tutti i diritti riservati.** Il codice è visibile solo a scopo di consultazione: copia, modifica, redistribuzione e uso commerciale sono vietati senza autorizzazione scritta. Vedi [LICENSE](LICENSE). Le versioni precedenti erano rilasciate con licenza MIT.

---

<div align="center">

<sub>Un progetto per chi prepara soluzioni nutritive con precisione. 🌱</sub>

</div>

---

<details>
<summary>🇬🇧 <b>English summary</b></summary>

<br>

**FertiQuota** is a professional fertigation calculator for **coco coir** growing. It turns a nutrient recipe — expressed as salt doses or as element targets in mg/L — into the concentrated **stock solutions** to prepare in tanks A, B and optionally C.

Beyond simple dose calculators, it includes a **quantitative thermodynamic chemistry engine** (coupled ionic speciation with 12 ion pairs, temperature-dependent Davies → SIT activity model, saturation indices for `CaSO₄`, `CaHPO₄`, `CaCO₃`, struvite, `ACP`, `OCP` and brucite, proton-balance tank pH, common-ion & 10 °C cold-night solubility checks, competitive `Ca²⁺↔Fe³⁺` chelate stability, EC estimation, meq/L ion balance), an **NNLS target solver**, automatic **tank-compatibility** handling (tank C switches on by itself when 3 stock solutions are needed) and an **auto-resolution** system that moves salts between tanks, picks the best acid (automatic, 2-acid `H₃PO₄ + HNO₃` mix, `H₂SO₄ 38%`, or manual override) and rebalances doses to keep the solution safe.

Everything lives in **a single HTML file** — no install, no backend, no account, strict opt-in analytics only (GDPR Consent Mode v2, local self-hosted fonts). All user data stays in the browser's `localStorage`. The full UI is available in **Italian and English**, switchable at runtime.

**Usage:** open [`index.html`](index.html) in any modern browser and follow the tabs: **Guides → Water → Recipes → Calculate** (with **Catalog**, **Gear & Tools** and **Data** as support).

**Tests:** a Playwright suite (S1–S40) runs the real app in headless Chromium, on every commit (pre-commit hook) and every push (GitHub Actions):

```bash
npm install playwright && npx playwright install chromium
node tests/run-tests.js
```

See the [Technical Manual](MANUALE_TECNICO.md) (Italian) for full documentation. Proprietary software — © 2026 Gaetano De Vito, all rights reserved. See [LICENSE](LICENSE).

</details>
