# FertiControl — Suite di test automatica

Esegue l'app reale (`index.html`, nella cartella padre) in Chromium headless e verifica motore chimico, solver, sicurezza, persistenza e UI. **Da lanciare a ogni modifica del motore**: gira in ~10 secondi, e in automatico sia in locale (hook pre-commit) sia su GitHub (Actions).

## Requisiti

- Node.js ≥ 18
- Playwright con Chromium:

```bash
npm install playwright
npx playwright install chromium
```

Se Chromium è già installato altrove, indicare il percorso con la variabile `CHROMIUM_PATH`.

## Esecuzione

```bash
node tests/run-tests.js
```

Exit code `0` = tutti i test passati; `1` = almeno un fallimento (elencati in fondo all'output); `2` = errore della suite stessa.

Variabili utili:

- `CHROMIUM_PATH` — eseguibile di Chromium se non è quello di Playwright;
- `PLAYWRIGHT_PATH` — modulo Playwright se non è risolvibile da `require('playwright')`;
- `FC_APP` — esegue la suite su un'altra copia dell'app (es. per un **test di mutazione**: introduci di proposito un bug in una copia e verifica che almeno un test fallisca).

## Esecuzione automatica

- **Hook pre-commit** (locale): ogni commit che tocca `index.html`, `sw.js` o `tests/` esegue la suite e viene bloccato se fallisce. Attivazione, una volta per clone:

  ```bash
  git config core.hooksPath tests/hooks
  ```

- **GitHub Actions** (`.github/workflows/test.yml`): stessa suite a ogni push e pull request che tocca l'app o i test.

## Cosa copre

| Sezione | Verifica |
|---|---|
| S1 | Caricamento senza errori JS, stato iniziale (22 sali, 11 ricette, 7 tab) |
| S2 | **Golden test**: bilancio ionico chiuso (cationi ≈ anioni) per ogni sale macro del catalogo — una formula salina è elettricamente neutra |
| S3 | **Golden test**: EC calcolata dai coefficienti vs range EC dichiarato da tutte le 35 fasi delle ricette builtin |
| S4 | **Invarianti** su tutte le 35 fasi: output renderizzato, niente NaN/undefined, input immutabile, risultato idempotente. **Fedeltà al profilo** dopo la correzione acqua (osmosi/media/dura): con osmosi ogni macro entro ±3%; con acqua media/dura N mai sotto −30%, P e K entro ±15%; nessuna dose negativa; NH₄ mai oltre il 10% (o la quota della ricetta) |
| S5 | Stress: acqua dura/osmosi/personalizzata × diluizioni 1:50 e 1:200 sul caso peggiore (pomodoro fruttificazione) |
| S6 | Motore serbatoi: dopo `autoRisolvi` nessuna coppia critica (gravità C) convive nello stesso tank, su tutte le fasi builtin |
| S7 | `verificaSicurezza` rileva conflitti forzati (Ca+fosfato stesso tank) e approva configurazioni corrette |
| S8 | Solver target con S libero: N/P/K/Ca/Mg entro il 10%, Fe entro ±10%, dosi mai negative |
| S9 | Regressione fix sali custom: B/Cu/Mo, stima EC (`stimaEcC` vs coefficienti tabellati), % N ammoniacale, prodotti liquidi in mL |
| S10 | Round-trip persistenza: export JSON → reset di fabbrica → import → stato identico (inclusi i campi nuovi dei sali custom) |
| S11 | Fuzzing dell'import: JSON malformato, payload ostile (tentativi di injection HTML, valori negativi/enormi/tipo sbagliato), numeri estremi → nessun crash non gestito, nessuna injection nel DOM, app funzionante |
| S12 | Cambio lingua IT/EN a runtime con calcolo completo in inglese |
| S13 | Profili acqua salvati: CRUD (crea/carica/elimina), nome sanificato, persistenza in `localStorage`, inclusione nel backup JSON e ripristino da import |
| S14 | Dose acido dimensionata sul pH target: più acido a pH più basso, tampone minimo 0.5 meq/L, zero acido se l'acqua è già acida, Henderson-Hasselbalch in sistema chiuso (CO₂ iniziale inclusa), aggiornamento della card al variare del pH |
| S15 | Temperatura dell'acqua negli indici di saturazione: Ksp fisicamente coerenti, SI CaHPO₄ che cambia con la temperatura, lettura e persistenza del campo temperatura nei profili |
| S16 | Consigli di miscelazione e gestione pH: ordine di scioglimento, separazione Ca, acido prima dei sali; deriva del pH secondo la frazione ammoniacale; advisory bassa alcalinità |
| S17 | PWA: manifest, service worker (install/activate/fetch, cache versionata), icone |
| S18 | Davies esteso per I > 0.5, P da H₃PO₄, avviso pH rebound, audit Ca₃(PO₄)₂ a pH > 6.2 |
| S19 | **NNLS Lawson-Hanson**: condizioni KKT su 40 problemi casuali, recupero esatto di dosi note, problema "trappola" su cui l'euristica precedente sbagliava |
| S20 | **Correzione acqua basata sul profilo** (regressione): pomodoro vegetativo con acqua media N ≥ 90% (prima 61%), P/K/Ca entro 5%, N dell'acido nitrico conteggiato, acqua con più Ca della ricetta, immutabilità e determinismo |
| S21 | **Ricalcolo con ingredienti disponibili** (regressione): MgSO₄ mancante non diventa MnSO₄, KH₂PO₄ mancante non azzera il P, Mix Chelati sostituito da sali singoli con Cu segnalato, Ca non coperto segnalato senza introdurre CaCl₂, card di report in UI |
| S22 | **Modalità target** (regressione): due calcoli consecutivi danno le stesse dosi, `correggiDosi` mai chiamata, tabella di fedeltà sempre presente, il pH ri-esegue il solver, una modifica manuale chiude la modalità target senza ri-sottrarre l'acqua |
| S23 | **Solver target**: S esplicito rispettato, CaCl₂ mai scelto, scorta rispettata, acido HNO₃ vs H₃PO₄ (meno N o meno P dai sali), avviso quando l'H₃PO₄ da solo eccede il P, micro sotto le soglie (B ≤ 125% del target), sali singoli senza Mix Chelati |
| S24 | **Serbatoi**: silicato senza serbatoio C non porta Ca insieme ai fosfati; con C sta da solo; sali di calcio custom separati per gruppo ionico; molibdato mai col calcio |
| S25 | **Speciazione con attività**: [HPO₄²⁻]/[H₂PO₄⁻] = 10^(pH−pKa₂)·γ₁/γ₂, bilancio di massa del P, autoconsistenza nel concentrato |
| S26 | **Correzioni minori**: costo per 1000 L indipendente dai volumi dei serbatoi, EC del concentrato senza moltiplicare l'acqua, calcite non "GESTITO" senza acido prescritto, cap NH₄NO₃ esatto, acido nel profilo finale, micro oltre 3× soglia = critico, coefficienti EC allineati, "Ripristina dosi originali" che non ri-bilancia |
| S27 | **Risultati per l'agricoltore**: dopo il calcolo le schede tecniche (apporti totali, fedeltà, verifiche chimiche, bilancio ionico, rapporti agronomici, contributo per sostanza, audit) sono nel pannello "Info tecniche" chiuso; restano visibili ricetta, costo e procedura; il pulsante apre/chiude, un nuovo calcolo richiude, i riquadri d'azione restano visibili, la stampa è identica a pannello aperto o chiuso |
| S28 | **3 soluzioni madri, pH e acido di default**: quando servono 3 soluzioni madri (silicato + Ca + fosfati) il Serbatoio C si attiva da solo, ogni sale è in un solo serbatoio con grammi = dose × volume × diluizione, l'utente può togliere/rimettere il C; pH di default 5.8 (campo e motore); acido "Automatico" di default che sceglie H₃PO₄ per una ricetta povera di N e HNO₃ per il pomodoro, anche a target, e che l'utente può forzare |
| S29 | **Regressioni motore e UI**: `acidoCalc` nei gauge SI/bilancio/rapporti (`H₃PO₄` contato nel SI `CaHPO₄`), `applicaBilanciamento` che aggiorna davvero le dosi in tabella, `checkNeedSerbC` che ignora sali a dose 0 e supporta sali di Ca custom, `assegnaSerbatoi` per sali di Ca custom, fusione senza duplicati dei micro in `sostituisciNonDisponibili`, conservazione di massa dei carbonati in `speciate` |
| S30 | **UX snella (flusso in 2 click)**: selezione automatica della prima fase al click sulla coltura, calcolo immediato al caricamento ricetta con compressione della tabella sali (riaperta automaticamente se mancano ingredienti in scorta), Serbatoi A/B/C in primo piano sopra il log degli interventi automatici, ricalcolo istantaneo al cambio dei volumi/diluizione |
| S31 | **Acido automatico più efficace**: HNO₃ e H₃PO₄ correggono il pH allo stesso modo (stessi meq, stesso HCO₃⁻ residuo); su 840 casi (35 fasi × dosi/target × 4 acque × 3 pH) l'acido scelto è sempre il più fedele alla ricetta sulla soluzione finale (riferimento indipendente, dopo `autoRisolvi`), i punteggi mostrati sono esatti, a parità vince l'HNO₃, nessuna sovrasaturazione di CaHPO₄ evitabile; ricette senza fosforo mai con H₃PO₄; in Calcola "Automatico" dà le stesse dosi dell'acido forzato |
| S32 | **Costi soluzioni madre, acido, volumi asimmetrici e sync prezzi**: formattazione sub-centesimi in `fmtEuro`, costi per serbatoio, inclusione costo acido nel totale per 1000 L, gestione volumi asimmetrici / serbatoi vuoti, prodotti liquidi €/kg + ≈ €/L, sincronizzazione prezzi da Catalogo a Calcola preserving manual override |
| S33 | **Ciclo di vita Splash Screen**: completamento di tutte le animazioni CSS prima di `.splash-hide`, transizione opacity, `prefers-reduced-motion`, traduzione EN |
| S34 | **Scorrimenti armonizzati e focus in-place**: `scroll-behavior: auto`, easing e durata controllata di `fcScrollTo`, stop su scroll utente, memoria scroll per tab, preservazione scroll/selezione in `setLang` / `renderCatalogo`, preservazione focus `#volC` |
| S35 | **Coerenza ricette e inventario**: coerenza note ↔ dosi su tutte le 35 fasi builtin IT/EN, `targets.S` in import/clone, parità 1:1 costi Ricette ↔ Calcola, validazione composizione/densità e round-trip scorta in backup |
| S36 | **Audit motori v2.3 (C1–C4, A1–A8, M1–M6, PWA, CSS, XSS stampa)**: incompatibilità sali custom via `getSale()`, escaping XSS in `stampaMiscelaDaRisultato`, banner/badge `warn` su `richiedeAzionePh`, H₃PO₄ 23.7% P + molarità dinamica + dissociazione diprotica (`pKa₂ = 7.20`), elettroneutralità ed EC dei 5 preset acqua, `verificaSolubilitaSerb` singolo e ione comune K₂SO₄, matrice KOH/K₂SiO₃/Mg/NH₄ e Serb. C per KOH, cap NH₄ esteso, `autoBilanciaSali` su conflitti concentrato e righe duplicate, `stimaPhSerbatoio` e invalidazione `ultimoAcidoChiave`, chelati Fe per pH e cap `MixCh`, UI 15 elementi + `_elCustom`, reset completo, guard tank-B in `expandElementRefs`, costo acido isolato, `validaInput`, singolo `<style>`, scrollbar attiva, `sw.js` `v2.4.0` |
| S37 | **Motore termodinamico v2.4 & benchmark PHREEQC/MINTEQ**: equilibrio gesso PHREEQC 15.3 mM a 25 °C (coppia `CaSO₄⁰` ~32%, `SI ≈ 0`, bilancio di massa esatto), miglioramento EC acque dure tramite 12 coppie ioniche Ca/Mg/SO₄/PO₄/CO₃, modello `Davies → SIT` ad alta forza ionica + `debyeHuckelA(T)` + `pKa(T)`, risolutore reale pH serbatoio per bilancio protonico (`stimaPhSerbatoio`), indici termodinamici `ACP`/`OCP`/`Brucite`, Mix automatico 2 acidi (`H₃PO₄ + HNO₃`) e `H₂SO₄ 38%` (con tampone fosfato e parità costi), ione comune esteso `KNO₃`/`KH₂PO₄` + avviso freddo notturno 10 °C, stabilità competitiva `Ca²⁺↔Fe³⁺` (`valutaStabilitaChelatoFe`) e test UI end-to-end |
| S38 | **Guide SEO, Attrezzatura Amazon, Riordino Catalogo, AdSense guard & Validazione link affiliazione**: ordine delle 7 tab (`Guide` prima di `Acqua`, `Attrezzatura` accanto a `Catalogo`), 5 guide tecniche IT/EN con `<details>` accessibili e toggle globale, 19 strumenti con filtri/ricerca e link Amazon (`rel="sponsored nofollow noopener noreferrer"`), pulsanti `Acquista`/`Riordina` in Catalogo senza SVG e esclusi da stampa, strip strumenti contestuale `.no-print` in `Calcola`, footer con disclosure e guard AdSense, validazione globale `tag=aitane93-21` su tutti i link Amazon (incluso ASIN YINMIK `B0BY7XTB5Y`) |
| S39 | **Audit GDPR completo (`S39.1–S39.10`), Google Consent Mode v2 (GA4 `G-WTB1MD5227` / AdSense), Font locali & Policy**: zero chiamate esterne Google Fonts (4 WOFF2 locali + `sw.js`), micro-server HTTP reale con sniffer rete a 0 richieste esterne prima del consenso + default Consent Mode v2 tutto `denied` + `ga-disable=true`, banner Garante Privacy non bloccante (nasconde `#pwa-install`, `✕` rifiuta con ricevuta ID 180gg persistita dopo reload), consenso granulare GA4 (`anonymize_ip`, `signals=false`) con blocco AdSense, revoca immediata + cancellazione reale cookie `_ga/_gid/_gcl_au/__gads` e riattivazione senza duplicare `<script>`, fail-closed su consenso corrotto/scaduto/versione vecchia, `<dialog>` Privacy & Cookie Policy Art. 13 IT/EN con Tabella Inventario Cookie/localStorage, doppio blocco AdSense, igiene `noopener noreferrer` su 100% link esterni, isolamento stampe e backup JSON |

## Note per chi estende la suite

- Il fallimento dei Google Fonts (`net::ERR...`) è filtrato: offline è il comportamento atteso, non un errore dell'app.
- Il `console.error` dentro il `catch` di `importaDati` è logging voluto: i "crash" veri sono solo i `pageerror`.
- Le sezioni del motore (S19+) partono da uno stato pulito con `resetMotore()` (catalogo di fabbrica, scorta piena, acqua media, 2 serbatoi): il fuzzing dell'import (S11) lascia nel catalogo sali custom ostili che falserebbero il solver.
- Le soglie di fedeltà di S4/S20 sono **limiti fisici**, non tolleranze di comodo: se l'acqua apporta già tutto il Ca, l'N del nitrato di calcio si può recuperare solo con KNO₃ (vincolato dal K) e NH₄ (≤ 10%).
- Ogni bug corretto in futuro dovrebbe diventare un test qui dentro: è la garanzia che non ritorni.
