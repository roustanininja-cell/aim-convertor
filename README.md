# SensForge — Gaming Sensitivity Converter & Aim Calibration Suite

> **"One Aim. Every Game."**

SensForge is a high-precision, client-side mouse sensitivity converter, cross-game matrix, and biomechanical aim calibration tool for PC gamers. It translates aiming sensitivity between 25 competitive multiplayer and singleplayer titles while preserving exact physical mousepad distance ($\text{cm/360}^\circ$).

---

## ⚡ Key Capabilities

1. **Mathematically Verified Yaw Engine**:
   - Built on verified game-engine yaw rotation constants (Source Engine, Unreal Engine 4/5, Frostbite, id Tech, Unity).
   - Solves non-linear sensitivity scaling, including exact cubic root inversion for Minecraft Java Edition ($\Delta x = 1.2 \cdot (0.6s + 0.2)^3$).
   - Built-in **Escape from Tarkov Gear Penalty Compensator** to offset in-raid armor and helmet turn drag (-5% to -35%).
2. **Real-Time Physical Feedback**:
   - $\text{cm/360}^\circ$ and $\text{inches/360}^\circ$ calculation.
   - Speed tier classification (Ultra Fast, Fast, Balanced, Low Arm Aiming, Ultra Low).
   - Mousepad width recommendation and space limitation warnings.
   - eDPI calculator with professional esports player benchmarks (VCT, CS2 Majors, ALGS, Overwatch Champions Series).
3. **Smart Sensitivity Recommender**:
   - Multi-factor questionnaire assessing main game, DPI, desk dimensions, mousepad size, aiming preferences, engagement ranges, and mechanical tendencies (overshooting vs undershooting).
   - Generates tailored starting sensitivity with transparent reasoning and exploration bracket.
4. **Interactive Aim Calibration Suite**:
   - **PSA Method (Perfect Sensitivity Approximation)**: 5-round guided coaching iteration algorithm used by professional FPS coaches to eliminate overshooting.
   - **In-Browser Flick & Reaction Trainer**: Interactive HTML5 canvas with popping targets to measure reaction time (ms) and click accuracy.
5. **Multi-Game Comparison Matrix**:
   - Translates current sensitivity across all 25 PC titles simultaneously with instant search, category filtering, and 1-click clipboard copy.
6. **Esports Aim & System Guides**:
   - Step-by-step guides for disabling Windows Pointer Acceleration (`main.cpl`), understanding FOV projection physics, 4:3 stretched resolution mechanics (`m_yaw 0.022`), and sensor polling rates (1000Hz vs 4000Hz vs 8000Hz).
7. **100% Client-Side & Local Persistence**:
   - Save custom presets locally in `localStorage`.
   - Export and import profile configurations as JSON files.
   - Zero login required, zero telemetry, zero external tracking.

---

## 🎮 Supported Games Database (25 Verified Titles)

| Game | Engine | Yaw / Scaling | Config Parameter | Verified Status |
| :--- | :--- | :--- | :--- | :--- |
| **Valorant** | Unreal Engine 4 (Custom) | `0.07°` | In-game / `GameUserSettings.ini` | ✅ Verified Exact |
| **Counter-Strike 2** | Source 2 | `0.022°` | `sensitivity "<value>"` | ✅ Verified Exact |
| **Counter-Strike: GO (Legacy)** | Source Engine | `0.022°` | `sensitivity "<value>"` | ✅ Verified Exact |
| **Apex Legends** | Source (Respawn Modified) | `0.022°` | `mouse_sensitivity` | ✅ Verified Exact |
| **Overwatch 2** | Proprietary Blizzard | `0.0066°` | `MouseSensitivity` | ✅ Verified Exact |
| **Fortnite** | Unreal Engine 5 | `0.00555555°` per 1% | `MouseSensitivityX / Y` | ✅ Verified Exact |
| **Rainbow Six Siege** | AnvilNext 2.0 | `0.005729578°` (0.02 base) | `MouseSensitivity` | ✅ Verified Exact |
| **Call of Duty: Warzone** | IW 9.0 | `0.0066°` | `options.3.cod24.cst` | ✅ Verified Exact |
| **Call of Duty: Black Ops (BO6 / CW)** | IW 9.0 / Treyarch | `0.0066°` | In-game sensitivity | ✅ Verified Exact |
| **Marvel Rivals** | Unreal Engine 5 | `0.0066°` | `GameUserSettings.ini` | ✅ Verified Exact |
| **PUBG: Battlegrounds** | Unreal Engine 4 | `0.022°` | `LastConvertedMouseSensitivity` | ✅ Verified Exact |
| **Team Fortress 2** | Source Engine | `0.022°` | `sensitivity "<value>"` | ✅ Verified Exact |
| **Quake (Champions / Live)** | id Tech / Saber | `0.022°` | `m_yaw 0.022; sensitivity` | ✅ Verified Exact |
| **Destiny 2** | Tiger Engine | `0.0066°` | `cvars.xml` (`mouse_look_sensitivity`) | ✅ Verified Exact |
| **Battlefield 2042 / V / 1** | Frostbite | `0.0718°` | `GstInput.MouseSensitivity` | ✅ Verified |
| **Battlefield 6 (Next-Gen Profile)** | Frostbite Next | `0.0718°` | `GstInput.MouseSensitivity` | ✅ Forward Compatible |
| **Escape from Tarkov** | Unity Engine | `0.022°` (Base) | `Control.ini` (`mouseSensitivity`) | ✅ Gear Penalty Aware |
| **Rust** | Unity Engine | `0.1125°` | `input.sensitivity <value>` | ✅ Verified Exact |
| **Minecraft (Java Edition)** | Java Proprietary | Non-linear Cubic | `options.txt` (`mouseSensitivity`) | ✅ Cubic Solved |
| **Roblox** | Roblox Proprietary | `0.39783°` | Camera Sensitivity slider | ✅ Verified |
| **Grand Theft Auto V** | RAGE | `0.055°` (Raw Input 1st) | `settings.xml` | ⚠️ Calibrated Approx. |
| **Red Dead Redemption 2** | RAGE | `0.055°` (Raw Input 1st) | `system.xml` | ⚠️ Calibrated Approx. |
| **Cyberpunk 2077** | REDengine 4 | `0.022°` | `UserSettings.json` | ✅ Verified |
| **DOOM Eternal** | id Tech 7 | `0.022°` | `doom_config.local` | ✅ Verified Exact |
| **The Finals** | Unreal Engine 5 | `0.0066°` | `AppSettings.json` | ✅ Verified Exact |

---

## 🧮 Mathematical Formulas

### Physical cm/360°
$$\text{cm/360}^\circ = \frac{360 \times 2.54}{\text{DPI} \times \text{Sensitivity} \times \text{Yaw}} = \frac{914.4}{\text{DPI} \times \text{Sensitivity} \times \text{Yaw}}$$

### Target Game Inversion
$$\text{Target Sensitivity} = \frac{914.4}{\text{Target DPI} \times \text{Source cm/360}^\circ \times \text{Target Yaw}}$$

### Minecraft Java Cubic Inversion
$$\Delta x = \frac{914.4}{\text{Target DPI} \times \text{Source cm/360}^\circ}$$
$$\text{Slider } s = \frac{\sqrt[3]{\Delta x / 1.2} - 0.2}{0.6}$$

---

## 🛠️ Project Structure

```
valo sens/
├── src/
│   ├── data/
│   │   ├── games.ts          # 25 games database with yaw, engines, configs & limitations
│   │   ├── guides.ts         # Aim optimization & Windows input guides
│   │   └── proRanges.ts      # Esports pro player benchmarks and eDPI medians
│   ├── engine/
│   │   ├── converter.ts      # Core mathematical conversion & cm/360 calculation
│   │   ├── recommendation.ts # Biomechanical questionnaire recommendation engine
│   │   └── psa.ts            # Perfect Sensitivity Approximation coaching iteration
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation, saved profiles count, theme switch
│   │   ├── Hero.tsx          # "One Aim. Every Game." hero presentation
│   │   ├── SensitivityConverter.tsx # Main converter with prominent display & copy
│   │   ├── QuickCompareTable.tsx    # 25-game comparison matrix
│   │   ├── SmartRecommender.tsx     # Biomechanical questionnaire & reasoning
│   │   ├── InteractiveCalibration.tsx # PSA iteration + Canvas aim benchmark
│   │   ├── ToolsSection.tsx  # eDPI, cm/360, DPI latency shifter
│   │   ├── GamesDatabaseGrid.tsx    # Categorized games library
│   │   ├── GameSettingsGuides.tsx   # System optimization guides
│   │   ├── FaqSection.tsx    # Science & aim FAQ
│   │   ├── Footer.tsx        # Footer & physics transparency
│   │   └── SavedProfilesModal.tsx   # LocalStorage presets & JSON export/import
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useTheme.ts
│   ├── styles/
│   │   └── main.css          # Dark esports charcoal & cyan glassmorphism design system
│   ├── test/
│   │   └── converter.test.ts # Vitest unit test suite (12 tests)
│   ├── App.tsx
│   └── main.tsx
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Unit Tests
```bash
npm test
```
All 12 mathematical verification unit tests execute using Vitest.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 4. Production Build
```bash
npm run build
```
Builds the static production bundle into the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment Instructions

SensForge is 100% static client-side and can be hosted for free on:
- **Vercel**: Import repository, build command `npm run build`, output directory `dist`.
- **Cloudflare Pages**: Framework preset `Vite`, build command `npm run build`, output directory `dist`.
- **Netlify**: Build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: Deploy the `dist/` directory using standard static deployment workflows.
