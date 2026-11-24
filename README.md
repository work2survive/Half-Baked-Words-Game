# 🍪 Half Baked Words

> A delicious daily word puzzle game where every baked word forces you to bite, nibble, or reshape your cookie letters!

🎮 **Play Live Demo:** [https://work2survive.github.io/Half-Baked-Words-Game/](https://work2survive.github.io/Half-Baked-Words-Game/)

---

## 🥐 How It Works

1. **Daily Cookie Tray (Wordle-style)**:
   Every day, all players worldwide receive the **exact same 16 fresh cookie letters**, deterministically seeded by date.
2. **Bake Words**:
   Drag & drop or tap cookie letters to arrange them on your baking plate. Form valid English words (3+ letters) from the Scrabble dictionary.
3. **The Twist — 3 Mandatory Bites**:
   Every time you bake a word, you are forced to take **3 bites** from your tray!
   - **Eat Whole**: Crunch a cookie into crumbs to remove it.
   - **Selective Nibbling**: Reshape a cookie into a brand-new letter!
4. **Free Rotations**:
   Letters with rotation symmetry (**M ↔ W** and **N ↔ Z**) can be rotated anytime for free using their `🔄` badge!
5. **Automatic Endgame**:
   When no more valid English words can be formed from your remaining cookies, the oven cools down and your final score, rank, and Wordle-style shareable scorecard are revealed.

---

## ✂️ Cookie Nibble Recipe Guide

| Original Cookie | Transforms Into | Action |
|:---:|:---:|:---|
| **A** | **V** | Nibble crossbar & rotate upside-down |
| **B** | **P, R, E, F, I** | Selectively bite loops or stems |
| **E** | **F, L, I** | Bite off bottom foot or arms |
| **H** | **I + I** | Splits into **TWO** cookies! |
| **O, D, G** | **C** | Chomp side curve |
| **W** | **V + V** | Splits into **TWO** cookies! |
| **M, N** | **V** | Nibble upright legs |
| **M ↔ W** | **W / M** | Free rotation! |
| **N ↔ Z** | **Z / N** | Free rotation! |
| **P, R** | **F, I, P** | Bite loop or diagonal leg |
| **Q** | **O, C** | Bite tail |
| **T** | **L, I** | Nibble & rotate or bite crossbar |
| **U** | **J** | Bite left arm |
| **X** | **Y** | Bite bottom-left leg |
| **K, L, V** | **I** | Nibble stems |

---

## 🛠️ Built With

- **HTML5 Canvas**: 60 FPS particle physics for crunchy crumbs, flour dust, and chocolate chip morsels.
- **Web Audio API**: Synthesized bite crunches, nibble chomps, and oven chimes (no external audio files required).
- **PointerEvents**: Silky smooth drag-and-drop & tap-to-move tailored for mobile touchscreens.
- **ENABLE1 Scrabble Dictionary**: 83,000+ words with a fast Trie solver for instant endgame detection.
