// Next, React
import { FC, useEffect, useState } from "react";
import pkg from "../../../package.json";

// ❌ DO NOT EDIT ANYTHING ABOVE THIS LINE

export const HomeView: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* HEADER – fake Scrolly feed tabs */}
      <header className="flex items-center justify-center border-b border-white/10 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px]">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
            Feed
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Casino
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Kids
          </button>
        </div>
      </header>

      {/* MAIN – central game area (phone frame) */}
      <main className="flex flex-1 items-center justify-center px-4 py-3">
        <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
          {/* Fake “feed card” top bar inside the phone */}
          <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide">
              Scrolly Game
            </span>
            <span className="text-[9px] opacity-70">#NoCodeJam</span>
          </div>

          {/* The game lives INSIDE this phone frame */}
          <div className="flex h-[calc(100%-26px)] flex-col items-center justify-start px-3 pb-3 pt-1">
            <GameSandbox />
          </div>
        </div>
      </main>

      {/* FOOTER – tiny version text */}
      <footer className="flex h-5 items-center justify-center border-t border-white/10 px-2 text-[9px] text-slate-500">
        <span>Scrolly · v{pkg.version}</span>
      </footer>
    </div>
  );
};

// ✅ THIS IS THE ONLY PART YOU EDIT FOR THE JAM
// Replace this entire GameSandbox component with the one AI generates.
// Keep the name `GameSandbox` and the `FC` type.

const GameSandbox: FC = () => {
  const notes = ["C", "D", "E", "F", "G", "A", "B"] as const;
  type Note = (typeof notes)[number];

  const [screen, setScreen] = useState<"menu" | "play" | "win" | "over">(
    "menu"
  );
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [sequence, setSequence] = useState<Note[]>([]);
  const [progress, setProgress] = useState(0);
  const [falling, setFalling] = useState<
    { id: number; note: Note; y: number; speed: number; x: number }[]
  >([]);
  const [paused, setPaused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [feedback, setFeedback] = useState<{
    id: number;
    type: "correct" | "wrong";
    x: number;
    y: number;
  } | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [bgMusic, setBgMusic] = useState<{
    chords: OscillatorNode[];
    melody: OscillatorNode;
    context: AudioContext;
  } | null>(null);
  const [spawnSide, setSpawnSide] = useState<"left" | "right">("left");

  // NEW: Adventure music that plays from menu to end
  useEffect(() => {
    if (audioEnabled && !bgMusic && screen !== "over" && screen !== "win") {
      try {
        const ctx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Chord pad oscillators
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const osc4 = ctx.createOscillator();
        const bassOsc = ctx.createOscillator();

        // Melody oscillator
        const melodyOsc = ctx.createOscillator();

        const gainNode = ctx.createGain();
        const bassGain = ctx.createGain();
        const melodyGain = ctx.createGain();

        // Chord pad setup
        osc1.type = "sine";
        osc2.type = "sine";
        osc3.type = "sine";
        osc4.type = "triangle";
        bassOsc.type = "sine";
        melodyOsc.type = "square";

        // C major 7 chord
        osc1.frequency.value = 130.81;
        osc2.frequency.value = 164.81;
        osc3.frequency.value = 196.0;
        osc4.frequency.value = 246.94;
        bassOsc.frequency.value = 65.41;
        melodyOsc.frequency.value = 523.25;

        // Connect
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc3.connect(gainNode);
        osc4.connect(gainNode);
        bassOsc.connect(bassGain);
        melodyOsc.connect(melodyGain);

        gainNode.connect(ctx.destination);
        bassGain.connect(ctx.destination);
        melodyGain.connect(ctx.destination);

        // Volume levels
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        bassGain.gain.setValueAtTime(0.012, ctx.currentTime);
        melodyGain.gain.setValueAtTime(0.04, ctx.currentTime);

        // Start all
        osc1.start();
        osc2.start();
        osc3.start();
        osc4.start();
        bassOsc.start();
        melodyOsc.start();

        // Chord progression
        let chordIndex = 0;
        const chordProgressions = [
          [130.81, 164.81, 196.0, 246.94, 65.41],
          [110.0, 130.81, 164.81, 196.0, 55.0],
          [174.61, 220.0, 261.63, 329.63, 87.31],
          [196.0, 246.94, 293.66, 369.99, 98.0],
        ];

        const chordInterval = setInterval(() => {
          chordIndex = (chordIndex + 1) % chordProgressions.length;
          const [f1, f2, f3, f4, bass] = chordProgressions[chordIndex];

          const now = ctx.currentTime;
          osc1.frequency.exponentialRampToValueAtTime(f1, now + 0.5);
          osc2.frequency.exponentialRampToValueAtTime(f2, now + 0.5);
          osc3.frequency.exponentialRampToValueAtTime(f3, now + 0.5);
          osc4.frequency.exponentialRampToValueAtTime(f4, now + 0.5);
          bassOsc.frequency.exponentialRampToValueAtTime(bass, now + 0.5);
        }, 4000);

        // Adventure melody
        const melodyNotes = [
          523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 659.25, 523.25,
        ];
        let melodyIndex = 0;

        const melodyInterval = setInterval(() => {
          melodyIndex = (melodyIndex + 1) % melodyNotes.length;
          const melodyFreq = melodyNotes[melodyIndex];

          const now = ctx.currentTime;
          melodyOsc.frequency.exponentialRampToValueAtTime(
            melodyFreq,
            now + 0.05
          );

          melodyGain.gain.cancelScheduledValues(now);
          melodyGain.gain.setValueAtTime(0.04, now);
          melodyGain.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
          melodyGain.gain.exponentialRampToValueAtTime(0.03, now + 0.45);
        }, 500);

        setBgMusic({
          chords: [osc1, osc2, osc3, osc4, bassOsc],
          melody: melodyOsc,
          context: ctx,
        });

        return () => {
          clearInterval(chordInterval);
          clearInterval(melodyInterval);
          osc1.stop();
          osc2.stop();
          osc3.stop();
          osc4.stop();
          bassOsc.stop();
          melodyOsc.stop();
          ctx.close();
        };
      } catch (e) {
        console.log("Background music failed");
      }
    } else if (
      (!audioEnabled || screen === "over" || screen === "win") &&
      bgMusic
    ) {
      bgMusic.chords.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {}
      });
      try {
        bgMusic.melody.stop();
      } catch (e) {}
      bgMusic.context.close();
      setBgMusic(null);
    }
  }, [screen, audioEnabled, bgMusic]);

  const playSound = (frequency: number, duration: number = 0.15) => {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const noteFrequencies: Record<Note, number> = {
    C: 261.63,
    D: 293.66,
    E: 329.63,
    F: 349.23,
    G: 392.0,
    A: 440.0,
    B: 493.88,
  };

  const genSequence = (lvl: number): Note[] => {
    const len = Math.min(2 + lvl, 12);
    return Array.from(
      { length: len },
      () => notes[Math.floor(Math.random() * notes.length)]
    );
  };

  const startGame = () => {
    const seq = genSequence(1);
    setLevel(1);
    setScore(0);
    setLives(3);
    setSequence(seq);
    setProgress(0);
    setFalling([]);
    setPaused(false);
    setCombo(0);
    setMaxCombo(0);
    setSpawnSide("left");
    setScreen("play");
  };

  const restart = () => {
    setScreen("menu");
  };

  const tapNote = (
    n: Note,
    id: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (paused) return;

    setFalling((f) => f.filter((x) => x.id !== id));

    if (n === sequence[progress]) {
      playSound(noteFrequencies[n]);
      setFeedback({
        id: Date.now(),
        type: "correct",
        x: event.clientX,
        y: event.clientY,
      });
      setTimeout(() => setFeedback(null), 500);

      const np = progress + 1;
      setProgress(np);

      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      const comboMultiplier = Math.floor(newCombo / 5) + 1;
      const basePoints = level * 10;
      setScore((s) => s + basePoints * comboMultiplier);

      if (np === sequence.length) {
        sequence.forEach((note, idx) => {
          setTimeout(() => playSound(noteFrequencies[note], 0.2), idx * 150);
        });

        const levelBonus = level * 50 + newCombo * 5;
        setScore((s) => {
          const newScore = s + levelBonus;
          setHighScore((hs) => Math.max(hs, newScore));
          return newScore;
        });

        if (level === 9) {
          setScreen("win");
        } else {
          setTimeout(() => {
            const nl = level + 1;
            setLevel(nl);

            if (nl % 4 === 0) {
              setLives(3);
              playSound(523.25, 0.3);
            }

            setSequence(genSequence(nl));
            setProgress(0);
          }, sequence.length * 150 + 300);
        }
      }
    } else {
      playSound(100, 0.3);
      setFeedback({
        id: Date.now(),
        type: "wrong",
        x: event.clientX,
        y: event.clientY,
      });
      setTimeout(() => setFeedback(null), 500);

      setCombo(0);

      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) {
          setHighScore((hs) => Math.max(hs, score));
          setScreen("over");
        }
        return nl;
      });
    }
  };

  useEffect(() => {
    if (screen !== "play" || paused) return;

    const moveInterval = setInterval(() => {
      setFalling((f) =>
        f
          .map((n) => ({ ...n, y: n.y + n.speed }))
          .filter((n) => {
            if (n.y > 100) {
              if (n.note === sequence[progress]) {
                setCombo(0);
                playSound(100, 0.3);

                setLives((l) => {
                  const nl = l - 1;
                  if (nl <= 0) {
                    setHighScore((hs) => Math.max(hs, score));
                    setScreen("over");
                  }
                  return nl;
                });
              }
              return false;
            }
            return true;
          })
      );
    }, 50);

    const spawnInterval = setInterval(() => {
      const isCorrectNote = Math.random() < 0.45;
      const noteToSpawn = isCorrectNote
        ? sequence[progress]
        : notes[Math.floor(Math.random() * notes.length)];

      const xPosition = spawnSide === "left" ? 25 : 75;
      setSpawnSide((prev) => (prev === "left" ? "right" : "left"));

      setFalling((f) => [
        ...f,
        {
          id: Date.now() + Math.random(),
          note: noteToSpawn,
          y: -5,
          speed: 1.2 + level * 0.45,
          x: xPosition,
        },
      ]);
    }, Math.max(1200 - level * 130, 500));

    return () => {
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [screen, paused, level, progress, sequence, combo, score, spawnSide]);

  if (screen === "menu") {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-950 px-6 py-8">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            🎵 Melody Quest
          </h1>
          <p className="text-sm text-cyan-300/80 font-medium">
            Tap falling notes in rhythm!
          </p>
        </div>

        {highScore > 0 && (
          <div className="rounded-full bg-white/10 backdrop-blur-sm px-5 py-2 border border-cyan-400/30">
            <p className="text-xs text-cyan-300">
              🏆 High Score:{" "}
              <span className="font-bold text-amber-300">{highScore}</span>
            </p>
          </div>
        )}

        <button
          onClick={startGame}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-8 py-4 text-lg font-black text-white shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all active:scale-95 hover:shadow-[0_0_50px_rgba(34,211,238,0.7)]"
        >
          <span className="relative z-10">Start Quest</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-xs border border-white/20 active:scale-90 transition-transform"
        >
          {audioEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>

        <div className="mt-4 text-center space-y-2 text-xs text-cyan-300/60">
          <p>• Tap notes in the correct sequence</p>
          <p>• Build combos for bonus points! 🔥</p>
          <p>• Every 5 combo = 2x points multiplier</p>
          <p>• Missed correct note = lose heart</p>
          <p>• Every 4th level = lives restored! ❤️</p>
        </div>
      </div>
    );
  }

  if (screen === "win") {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-950 px-6 py-8">
        <div className="text-center">
          <h2 className="mb-2 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-pulse">
            🎉 Victory!
          </h2>
          <p className="text-sm text-emerald-300/80">
            You completed all levels!
          </p>
        </div>

        <div className="space-y-3 w-full max-w-[200px]">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-3 border border-emerald-400/30 text-center">
            <p className="text-xs text-emerald-300 mb-1">Final Score</p>
            <p className="text-3xl font-black text-amber-300">{score}</p>
          </div>

          {maxCombo > 0 && (
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-3 border border-orange-400/30 text-center">
              <p className="text-xs text-orange-300 mb-1">Max Combo</p>
              <p className="text-2xl font-black text-orange-300">
                🔥 {maxCombo}
              </p>
            </div>
          )}

          {score > highScore && (
            <div className="rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-2 border border-amber-400/50 text-center">
              <p className="text-xs text-amber-300 font-bold">
                🌟 New High Score!
              </p>
            </div>
          )}
        </div>

        <button
          onClick={restart}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3 text-base font-bold text-white shadow-lg active:scale-95 hover:shadow-xl transition-all"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (screen === "over") {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-br from-rose-900 via-pink-900 to-fuchsia-950 px-6 py-8">
        <div className="text-center">
          <h2 className="mb-2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400">
            💔 Game Over
          </h2>
          <p className="text-sm text-rose-300/80">Better luck next time!</p>
        </div>

        <div className="space-y-3 w-full max-w-[200px]">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-3 border border-rose-400/30 text-center">
            <p className="text-xs text-rose-300 mb-1">Your Score</p>
            <p className="text-3xl font-black text-white">{score}</p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-3 border border-amber-400/30 text-center">
            <p className="text-xs text-amber-300 mb-1">Reached Level</p>
            <p className="text-2xl font-black text-amber-300">{level}</p>
          </div>

          {maxCombo > 0 && (
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-3 border border-orange-400/30 text-center">
              <p className="text-xs text-orange-300 mb-1">Max Combo</p>
              <p className="text-xl font-black text-orange-300">
                🔥 {maxCombo}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={restart}
          className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-base font-bold text-white shadow-lg active:scale-95 hover:shadow-xl transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (screen === "play") {
    const comboMultiplier = Math.floor(combo / 5) + 1;

    return (
      <div className="relative flex w-full flex-1 flex-col rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-950 overflow-hidden">
        {/* HUD */}
        <div className="flex items-center justify-between px-3 py-2 bg-black/20 backdrop-blur-sm rounded-t-2xl border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-500/30 backdrop-blur-sm px-3 py-1 text-xs font-bold text-cyan-200 border border-cyan-400/30">
              Lvl {level}
            </span>
            <span className="rounded-full bg-teal-500/30 backdrop-blur-sm px-3 py-1 text-xs font-bold text-teal-200 border border-teal-400/30">
              {score}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base">
              {Array.from({ length: lives }).map((_, i) => (
                <span key={i} className="inline-block animate-pulse">
                  ❤️
                </span>
              ))}
            </span>

            <button
              onClick={() => setPaused(!paused)}
              className="rounded-full bg-white/10 backdrop-blur-sm p-1.5 text-xs border border-white/20 active:scale-90 transition-transform"
            >
              {paused ? "▶️" : "⏸️"}
            </button>

            <button
              onClick={restart}
              className="rounded-full bg-white/10 backdrop-blur-sm p-1.5 text-xs border border-white/20 active:scale-90 transition-transform"
            >
              ↩️
            </button>
          </div>
        </div>

        {/* Combo Display */}
        {combo > 0 && (
          <div className="flex justify-center py-1 bg-black/10">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black transition-all ${
                combo >= 10
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse scale-110"
                  : combo >= 5
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-black animate-pulse"
                  : "bg-gradient-to-r from-cyan-400 to-teal-400 text-black"
              }`}
            >
              🔥 {combo} COMBO{" "}
              {comboMultiplier > 1 ? `x${comboMultiplier}` : ""}
            </span>
          </div>
        )}

        {/* Sequence Preview */}
        <div className="flex justify-center gap-1 px-3 py-2 bg-black/10">
          {sequence.map((n, i) => (
            <span
              key={i}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                i < progress
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)] scale-110"
                  : i === progress
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse scale-110"
                  : "bg-white/10 text-white/50 backdrop-blur-sm"
              }`}
            >
              {n}
            </span>
          ))}
        </div>

        {/* Game Area */}
        <div className="relative flex-1">
          {falling.map((n) => (
            <button
              key={n.id}
              onClick={(e) => tapNote(n.note, n.id, e)}
              className={`absolute -translate-x-1/2 rounded-full px-5 py-2.5 text-base font-black shadow-[0_0_20px_rgba(34,211,238,0.6)] active:scale-75 transition-all ${
                n.note === sequence[progress]
                  ? "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-black animate-pulse shadow-[0_0_30px_rgba(251,191,36,0.8)]"
                  : "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 text-white"
              }`}
              style={{ top: `${n.y}%`, left: `${n.x}%` }}
            >
              {n.note}
            </button>
          ))}

          {paused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md px-8 py-6 border border-white/20">
                <p className="text-2xl font-black text-white text-center">
                  ⏸️ Paused
                </p>
                <p className="text-xs text-white/70 text-center mt-2">
                  Tap pause to continue
                </p>
              </div>
            </div>
          )}

          {feedback && (
            <div
              className="fixed pointer-events-none z-50"
              style={{ left: feedback.x, top: feedback.y }}
            >
              {feedback.type === "correct" ? (
                <span className="text-3xl animate-ping">✨</span>
              ) : (
                <span className="text-3xl animate-ping">❌</span>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="px-3 py-2 text-center bg-black/20 backdrop-blur-sm rounded-b-2xl border-t border-white/10">
          <p className="text-[10px] text-cyan-300/70">
            Build combos for bonus • Don't miss correct notes! • Level{" "}
            {Math.ceil((level + 1) / 4) * 4}: Lives restore
          </p>
        </div>
      </div>
    );
  }

  return null;
};
