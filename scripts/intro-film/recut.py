"""RUNTIME re-cut: same cut points as the v2 film (so music + voice stay in sync), every shot at real speed,
no shot reused, fresh v1 footage in the montage, captions re-rendered, white flash cuts kept."""
import subprocess, sys, json

FF = r"C:/Users/abhin/AppData/Local/Python/pythoncore-3.14-64/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe"
D = "C:/Users/abhin/Downloads/RUNTIME_intro"
S = "C:/Users/abhin/AppData/Local/Temp/claude/77855181fa97eb6a/b37ce5ac-5d4f-4cc2-984c-8563538902a5/scratchpad"
V2 = lambda n: f"{D}/v2/clips/clip{n:02d}.mp4"
V1 = lambda n: f"{D}/assets/clip{n:02d}.mp4"
FLASH = "FLASH"

# (source, first source frame, frame count, note). Frame counts reproduce the v2 cut grid exactly.
EDL = [
    (V2(1), 0, 75, "city 02:00"),
    (V2(2), 8, 73, "chai + laptop: prod is down"),
    (V2(3), 29, 73, "the Director walks in"),
    (FLASH, 0, 1, ""),
    (V2(4), 0, 35, "the Thinker"),
    (FLASH, 0, 1, ""),
    (V2(5), 1, 35, "the Speedster"),
    (V2(6), 9, 73, "trio walk"),
    (V2(7), 10, 36, "bugs swarm"),
    (V2(8), 14, 36, "Thinker reads the grid"),
    (V2(9), 12, 36, "Speedster types"),
    (V2(10), 10, 36, "Director orchestrates"),
    (V1(1), 40, 18, "NEW alarm wall, trio at the console"),
    (V1(4), 20, 18, "NEW Thinker inside the ring of screens"),
    (V1(5), 30, 9, "NEW Speedster at the green wall"),
    (V1(2), 40, 9, "NEW Director in the smoke"),
    (V2(7), 57, 18, "bugs merge into the monster (one run)"),
    (V2(11), 0, 9, "monster rises"),
    (FLASH, 0, 1, ""),
    (V2(11), 12, 72, "monster over the trio"),
    (V1(7), 30, 18, "NEW crew at the red-button console"),
    (V1(6), 40, 18, "NEW Director leans back, crew flat out"),
    (V1(3), 50, 18, "NEW Thinker + Speedster stride out of the fire"),
    (FLASH, 0, 1, ""),
    (V2(11), 84, 17, "monster, continued"),
    (V1(8), 76, 9, "NEW hand on the glowing button"),
    (V1(10), 40, 9, "NEW the trio stands ready"),
    (V2(12), 64, 32, "Director's eyes"),
    (V2(13), 91, 25, "the key press"),
    (FLASH, 0, 1, ""),
    (V2(14), 4, 54, "DEPLOYED"),
    (V2(15), 5, 116, "trio walk away: genius / prompts"),
]
TOTAL = sum(n for _, _, n, _ in EDL)

# Captions: (png, first frame, last frame exclusive) on the output timeline.
CAPS = [("city", 10, 72), ("prod", 93, 148), ("director", 184, 221), ("thinker", 227, 257),
        ("speedster", 263, 293), ("deployed", 816, 866), ("genius", 875, 916), ("prompts", 916, TOTAL)]

def main(preview=False):
    inputs, chains, labels = [], [], []
    srcs = {}
    for src, *_ in EDL:
        if src != FLASH and src not in srcs:
            srcs[src] = len(srcs)
            inputs += ["-i", src]
    # A flash is folded into the shot after it: that shot starts one frame early and fades in from
    # pure white (its first frame is fully white), so the cut grid stays exact.
    segs, flash = [], False
    for src, a, n, _ in EDL:
        if src == FLASH:
            flash = True
            continue
        segs.append((src, max(a - 1, 0), n + 1, True) if flash else (src, a, n, False))
        flash = False
    for k, (src, a, n, fl) in enumerate(segs):
        # The earlier (v1) clips carry the generator's sparkle mark in the right-most ~205 px:
        # frame it out (1.13x, vertically centred) instead of blurring it.
        fit = ("crop=1700:956:0:60,scale=1920:1080:flags=lanczos" if "/assets/" in src
               else "scale=-2:1080:flags=lanczos,crop=1920:1080")
        f = (f"[{srcs[src]}:v]trim=start_frame={a}:end_frame={a + n},setpts=N/(24*TB),"
             f"{fit},setsar=1,format=yuv420p")
        if fl:
            f += ",fade=t=in:s=0:n=6:color=white"
        chains.append(f + f"[s{k}]")
        labels.append(f"[s{k}]")
    chains.append("".join(labels) + f"concat=n={len(segs)}:v=1:a=0,setpts=N/(24*TB)[cut]")
    base = len(srcs)
    last = "cut"
    for j, (name, f0, f1) in enumerate(CAPS):
        inputs += ["-loop", "1", "-framerate", "24", "-t", f"{(f1 - f0) / 24:.4f}", "-i", f"{S}/caps/{name}.png"]
        ci = base + j
        chains.append(f"[{ci}:v]format=rgba,fade=t=in:s=0:n=4:alpha=1,setpts=PTS-STARTPTS+{f0}/24/TB[c{j}]")
        chains.append(f"[{last}][c{j}]overlay=0:0:eof_action=pass:format=auto[o{j}]")
        last = f"o{j}"
    out = f"{S}/recut_master.mp4"
    cmd = [FF, "-v", "error", "-y", *inputs,
           "-f", "f32le", "-ar", "48000", "-ac", "2", "-i", f"{S}/out48_lim.raw",
           "-filter_complex", ";".join(chains), "-map", f"[{last}]", "-map", f"{base + len(CAPS)}:a",
           "-frames:v", str(TOTAL), "-af", "apad", "-shortest",
           "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-pix_fmt", "yuv420p",
           "-c:a", "pcm_s16le" if False else "aac", "-b:a", "256k", out]
    subprocess.run(cmd, check=True)
    print("frames", TOTAL, f"({TOTAL / 24:.3f}s) ->", out)

if __name__ == "__main__":
    main()
