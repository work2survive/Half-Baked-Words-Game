# 🍪 Half Baked Words

<div align="center">

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-2ea44f?style=for-the-badge&logo=github)
![Mobile Friendly](https://img.shields.io/badge/Mobile-Touch%20Optimized-orange?style=for-the-badge&logo=html5)
![Dictionary](https://img.shields.io/badge/Dictionary-ENABLE1%2083K-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

<br/>

### 🥐 [Play the Live Online Demo](https://work2survive.github.io/Half-Baked-Words-Game/) 🥐

*A daily cookie-baking anagram word game where every fresh word forces you to bite, nibble, or reshape your cookie letters!*

</div>

---

## 📖 About the Game

**Half Baked Words** is an original word puzzle game inspired by the daily communal play of *Wordle* combined with the tile manipulation of *Scrabble* and an inventive, tactile twist: **bite mechanics**.

Every day at midnight, the bakery oven opens. Every player across the world receives the exact same baking tray holding **16 freshly baked cookie letters**.

Your goal: **Bake as many valid English words as possible to achieve the highest Baker Score.**

### 🦷 The Twist: Mandatory Bites & Selective Nibbles
After each valid word you bake, the twist takes effect: **You must take 3 bites from your tray!**

- **Eat Whole Cookies**: Some letters simply disappear when bitten (turning into a burst of crunchy crumbs).
- **Selective Nibbles**: Many letters can be strategically nibbled into different letters. For example, bite a piece out of an **O** and you keep a **C**!
- **Cookie Splitting**: Bite the crossbar of an **H**, and it snaps in two to give you **two I cookies**! Snap a **W** and you get **two V cookies**!
- **Free Rotations**: Letters like **M ↔ W** and **N ↔ Z** can be turned upside down anytime for free without using up any of your bites.

When no more valid English words of 4+ letters can be formed with your remaining cookies, the oven cools down and your game concludes automatically. You can also press **🏳️ Give Up** at any time to finalize your bake.

---

## 🎮 How to Play

### 1. Build a Word
- **Tap or Drag**: Tap any cookie on the baking tray to send it to the **Baking Plate**, or drag and drop to reorder letters.
- **Validation**: When the letters form a valid English word (**minimum 4 letters long**), the cookies bounce with a golden glow and the **Bake Word ✓** button appears.
- **Recipe Book**: Over 83,000 words verified instantly against the official Scrabble ENABLE1 word list.

### 2. Take Your 3 Bites
- After baking a word, the game enters the **Chomp Phase**.
- Tap any cookie on your tray:
  - If it has nibble options, choose whether to reshape it or eat it whole.
  - If it has no transformations, crunch it into crumbs!
- Each bite triggers realistic crumb animations and crunch sounds.

### 3. Endgame & Give Up
- A high-speed Trie algorithm continuously verifies whether any 4+ letter words can still be formed with the remaining letters (and any free rotations).
- As soon as no combinations remain, the game automatically finishes, displaying your final score, words baked list, and a shareable scorecard!
- **Give Up Button**: Want to call it a day? Click **🏳️ Give Up** to cool down the oven anytime with a safety confirmation prompt.

---

## ✂️ Cookie Transformation Recipe Table

| Original Cookie | Can Transform Into | Transformation Action |
|:---:|:---:|:---|
| **A** | **V** | Nibble top crossbar & rotate upside-down |
| **B** | **P, R, E, F, I** | Bite bottom loop, open legs, or trim side strokes |
| **D** | **C** | Nibble vertical backbone & rotate |
| **E** | **F, L, I** | Bite off bottom foot, middle arm, or top arms |
| **G** | **C** | Bite off inner hook |
| **H** | **I + I** | 💥 **Splits into TWO separate I cookies!** |
| **K** | **I** | Bite off diagonal arms |
| **L** | **I** | Bite off horizontal base |
| **M** | **V, N** *(or rotate to **W**)* | Nibble outer stems, or rotate 180° for free! |
| **N** | **V** *(or rotate to **Z**)* | Nibble upright stem, or rotate 90° for free! |
| **O** | **C** | Bite a chunk out of the right side curve |
| **P** | **F, I** | Nibble loop open into arms, or bite loop off |
| **Q** | **O, C** | Bite off tail, or chomp curved side |
| **R** | **F, I, P** | Bite diagonal kick, loop, or stem |
| **T** | **L, I** | Nibble one half of crossbar & rotate, or bite top off |
| **U** | **J** | Bite off left arm |
| **V** | **I** | Bite one diagonal leg |
| **W** | **V + V** *(or rotate to **M**)* | 💥 **Splits into TWO separate V cookies!** Or rotate 180° for free! |
| **X** | **Y** | Bite off bottom-left leg |
| **Z** | **N** | Free 90° rotation! |
| *Any Letter* | 🪦 *Crumbs* | Eat completely to remove clutter from the tray |

---

## 🏆 Scoring System

Points are awarded based on word length and letter rarity:

| Word Length | Base Points |
|:---:|:---:|
| **4 letters** | 40 pts + letter points |
| **5 letters** | 75 pts + letter points |
| **6 letters** | 120 pts + letter points |
| **7+ letters** | 180+ pts (+50 pts per extra letter) |

- **Letter Bonuses**: Rare consonants (Q, Z, X: +10 pts each; J, K: +8 pts; B, C, M, P, F, H, V, W, Y: +4 pts).
- **Baker Ranks**:
  - `0 - 99 pts`: **Apprentice Baker 🧁**
  - `100 - 199 pts`: **Cookie Enthusiast 🍪**
  - `200 - 319 pts`: **Artisan Baker 🥐**
  - `320 - 449 pts`: **Master Baker 👨‍🍳**
  - `450+ pts`: **Legendary Pastry Grandmaster 👑**

---

## 📱 Mobile-First Controls

- **Optimized for Phones & Tablets**: Prevents accidental zoom and page scrolling during play.
- **Tap-to-Move**: Fast one-thumb interaction to quickly move cookies between the baking tray and the plate.
- **Drag-and-Drop**: Built using unified `PointerEvents` with floating ghost followers.
- **Shuffle & Clear**: Dedicated one-tap buttons to reorganize your tray or clear the current plate.
- **Sound Toggle**: Instant Web Audio mute/unmute persisted in browser storage.

---

## 🛠️ Technical Architecture

- **Deterministic PRNG**: Seeded via `Mulberry32` using `YYYY-MM-DD` so every player gets an identical tray each day.
- **Trie Solver**: Compact prefix tree evaluates 83,000+ words in under `0.5ms` to verify remaining permutations and trigger automatic endgame.
- **Crumb Physics Engine**: 60 FPS HTML5 Canvas particle system simulating gravity, drag, angular rotation, and multi-tone dough/chocolate chip fragments.
- **Synthesized Audio**: Procedural sound generation via the **Web Audio API** (filtered noise bursts and oscillators) eliminating the need for external `.mp3` or `.wav` network downloads.
- **Zero Dependencies**: Pure Vanilla HTML5, CSS3, and modern JavaScript.

---

## 💻 Local Development

To run the game locally:

```bash
# Clone the repository
git clone https://github.com/work2survive/Half-Baked-Words-Game.git

# Enter the directory
cd Half-Baked-Words-Game

# Start any static HTTP server (Python example)
python3 -m http.server 8080
```

Open your browser at `http://localhost:8080/`.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
