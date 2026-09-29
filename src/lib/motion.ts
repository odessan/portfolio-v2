import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { disciplines } from "./disciplines";

gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, Draggable, InertiaPlugin);

const $ = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  const cleanups: (() => void)[] = [];

  const title = document.querySelector<HTMLElement>(".hero-title");
  if (title) {
    const [line1, line2] = title.querySelectorAll<HTMLElement>(".hero-line");
    const cycle: [string, string, string][] = [
      ["Websites.", disciplines.web.color, '.sticker[data-d="web"]'],
      ["Apps.", disciplines.mobile.color, '.sticker[data-d="mobile"]'],
      ["Everything.", "#0ae448", ".sticker"],
    ];
    const temp = cycle.map(([text, color]) => {
      const s = document.createElement("span");
      s.textContent = text;
      s.setAttribute("aria-hidden", "true");
      s.style.cssText = `position:absolute;left:0;top:0;white-space:nowrap;color:${color}`;
      line2.append(s);
      if (s.offsetWidth > line2.offsetWidth) s.style.fontSize = `${line2.offsetWidth / s.offsetWidth}em`;
      return s;
    });
    cleanups.push(() => temp.forEach((s) => s.remove()));

    const chars = (el: Element) => SplitText.create(el, { type: "chars", aria: "none" }).chars;
    const build = chars(line1);
    const final = chars(line2.querySelector(".hero-word")!);
    const words = temp.map(chars);
    gsap.set([...words.flat(), ...final], { yPercent: 125 });

    const pulse = (tags: string) =>
      gsap
        .timeline()
        .to(tags, { scale: 1.2, duration: 0.3, ease: "power2.out" })
        .to(tags, { scale: 1, duration: 0.9, ease: "expo.out" });

    const tl = gsap.timeline({ delay: 0.1, defaults: { ease: "expo.out", stagger: 0.02 } });
    tl.from(build, { yPercent: 125, duration: 0.9 }, 0);
    let t = 0.35;
    words.forEach((w, i) => {
      tl.to(w, { yPercent: 0, duration: 0.6 }, t)
        .add(pulse(cycle[i][2]), t)
        .to(w, { yPercent: -125, duration: 0.35, ease: "power3.in", stagger: 0.012 }, t + 0.6);
      t += 0.85;
    });
    tl.to(final, { yPercent: 0, duration: 0.9 }, t);
  }

  $(".split-lines").forEach((el) =>
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
      autoSplit: true,
      onSplit: (s) =>
        gsap.from(s.lines, {
          yPercent: 120,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
    }),
  );

  $<SVGSVGElement>("[data-blob='float']").forEach((svg, i) => {
    const path = svg.querySelector<SVGPathElement>("path[data-morph]");
    if (!path) return;
    const [a, b] = path.dataset.morph!.split("|");
    const base = path.getAttribute("d")!;
    const dur = gsap.utils.random(6, 9);

    gsap.from(svg, { scale: 0.6, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.25 + i * 0.12 });
    const loop = gsap
      .timeline({ repeat: -1, defaults: { duration: dur / 3, ease: "sine.inOut" } })
      .to(path, { morphSVG: a })
      .to(path, { morphSVG: b })
      .to(path, { morphSVG: base });
    const float = gsap.to(svg, { y: gsap.utils.random(-12, 12), duration: dur / 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    ScrollTrigger.create({
      trigger: svg,
      start: "top bottom",
      end: "bottom top",
      onToggle: ({ isActive }) => [loop, float].forEach((t) => (isActive ? t.resume() : t.pause())),
    });
  });

  const stickers = $(".sticker");
  if (stickers.length) {
    gsap.from(stickers, { yPercent: -80, opacity: 0, duration: 0.9, ease: "expo.out", delay: 0.2, stagger: { each: 0.06, from: "random" } });
    const drags = Draggable.create(stickers, {
      type: "x,y",
      bounds: ".hero",
      inertia: true,
      edgeResistance: 0.85,
      zIndexBoost: true,
      onPress() {
        gsap.to(this.target, { scale: 1.1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
      },
    });
    cleanups.push(() => drags.forEach((d) => d.kill()));
  }

  gsap.set("[data-reveal]", { opacity: 0, y: 12 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 92%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }),
  });

  gsap.set(".cards > *", { opacity: 0, y: 24 });
  ScrollTrigger.batch(".cards > *", {
    start: "top 90%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08 }),
  });

  const onFilter = () => {
    gsap.set(".cards > *", { opacity: 1, y: 0 });
    ScrollTrigger.refresh();
  };
  addEventListener("work:filter", onFilter);
  cleanups.push(() => removeEventListener("work:filter", onFilter));

  return () => cleanups.forEach((fn) => fn());
});

mm.add(
  { motion: "(prefers-reduced-motion: no-preference)", roomy: "(min-width: 768px) and (min-height: 700px)" },
  (ctx) => {
    const { motion, roomy } = ctx.conditions!;
    const section = document.querySelector<HTMLElement>(".services");
    if (!motion || !section) return;
    const rows = gsap.utils.toArray<HTMLElement>(".service", section);
    const texts = rows.map((r) => [...r.querySelector(".service-text")!.children]);
    const blobs = rows.map((r) => r.querySelector<SVGSVGElement>(".service-blob")!);

    if (!roomy) {
      rows.forEach((row, i) =>
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } })
          .from(blobs[i], { scale: 0.85, rotation: -8, opacity: 0, duration: 1.2, ease: "expo.out" })
          .from(texts[i], { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 0.1),
      );
      return;
    }

    section.classList.add("services-pinned");
    const paths = blobs.map((b) => b.querySelector<SVGPathElement>("path[data-morph]")!);
    const shapes = paths.map((p) => p.getAttribute("d")!);
    const last = rows.length - 1;
    const setActive = (active: number) => rows.forEach((r, i) => (r.style.pointerEvents = i === active ? "" : "none"));
    setActive(0);

    gsap.set(texts.slice(1).flat(), { opacity: 0, y: 40 });
    gsap.set(blobs.slice(1), { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section.querySelector(".services-track"),
        pin: true,
        start: "center center",
        end: `+=${last * 100}%`,
        scrub: 0.6,
        refreshPriority: 1,
        snap: { snapTo: 1 / last, inertia: false, duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut" },
        onUpdate: (self) => setActive(Math.round(self.progress * last)),
      },
    });
    for (let i = 0; i < last; i++) {
      const w = i + 0.1;
      tl.to(texts[i], { opacity: 0, y: -40, duration: 0.25, stagger: 0.03, ease: "power2.in" }, w)
        .to(paths[i], { morphSVG: shapes[i + 1], duration: 0.8, ease: "power1.inOut" }, w)
        .fromTo(paths[i + 1], { morphSVG: shapes[i] }, { morphSVG: shapes[i + 1], duration: 0.8, ease: "power1.inOut" }, w)
        .to(blobs[i], { autoAlpha: 0, duration: 0.4 }, w + 0.2)
        .to(blobs[i + 1], { autoAlpha: 1, duration: 0.4 }, w + 0.2)
        .to(texts[i + 1], { opacity: 1, y: 0, duration: 0.28, stagger: 0.03, ease: "power2.out" }, w + 0.4);
    }
    tl.set({}, {}, last);

    gsap.from(blobs[0], {
      scale: 0.85,
      rotation: -8,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: section, start: "top 60%", once: true },
    });

    const onFocus = (e: FocusEvent) => {
      const i = rows.findIndex((r) => r.contains(e.target as Node));
      const st = tl.scrollTrigger;
      if (i < 0 || !st) return;
      const y = st.start + (st.end - st.start) * (i / last);
      if (Math.abs(scrollY - y) > 4) scrollTo({ top: y });
    };
    section.addEventListener("focusin", onFocus);

    return () => {
      section.classList.remove("services-pinned");
      section.removeEventListener("focusin", onFocus);
      setActive(-1);
      rows.forEach((r) => (r.style.pointerEvents = ""));
    };
  },
);

mm.add({ motion: "(prefers-reduced-motion: no-preference)", travel: "(min-width: 768px)" }, (ctx) => {
  const { motion, travel } = ctx.conditions!;
  const slots = $("[data-slot]").sort((a, b) => +a.dataset.slot! - +b.dataset.slot!);
  const layer = document.querySelector<HTMLElement>(".traveler");
  if (!motion || !slots.length) return;

  $(".chara-icon").forEach((icon) =>
    gsap.to(icon, { y: gsap.utils.random(-14, -8), rotation: gsap.utils.random(-6, 6), duration: gsap.utils.random(2, 3), ease: "sine.inOut", yoyo: true, repeat: -1 }),
  );

  if (!travel || !layer) {
    slots.forEach((slot) => {
      gsap.from(slot, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: slot, start: "top 90%", once: true } });
      gsap.to(slot.querySelector(".chara-img"), { y: -6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
    return;
  }

  const body = layer.querySelector<HTMLElement>(".traveler-body")!;
  const poses = gsap.utils.toArray<HTMLElement>(".pose", layer);
  const W = layer.offsetWidth || 400;
  layer.style.display = "block";
  const H = layer.offsetHeight;
  gsap.set(slots, { autoAlpha: 0 });
  gsap.set(poses, { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });
  gsap.from(layer, { autoAlpha: 0, duration: 1, delay: 0.15 });
  gsap.to(body, { y: -6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

  const legs = slots.slice(1).map((slot) =>
    ScrollTrigger.create({
      trigger: slot,
      start: "top 95%",
      end: "center 55%",
    }),
  );
  const smooth = legs.map(() => 0);
  const ease = gsap.parseEase("power2.inOut");
  const set = {
    x: gsap.quickSetter(layer, "x", "px"),
    y: gsap.quickSetter(layer, "y", "px"),
    sx: gsap.quickSetter(layer, "scaleX"),
    sy: gsap.quickSetter(layer, "scaleY"),
    r: gsap.quickSetter(layer, "rotation", "deg"),
  };
  const lean = gsap.quickTo(body, "rotation", { duration: 0.8, ease: "power3.out" });
  const onMove = (e: PointerEvent) => lean((e.clientX / innerWidth - 0.5) * 6);
  addEventListener("pointermove", onMove);

  let shown = 0;
  let parked = true;
  const tick = () => {
    let i = 0;
    legs.forEach((st, k) => {
      smooth[k] += (st.progress - smooth[k]) * 0.16;
      if (smooth[k] > 0.001) i = k;
    });
    const p = smooth[i];
    const e = ease(p);
    const a = slots[i].getBoundingClientRect();
    const b = slots[i + 1].getBoundingClientRect();
    const arc = Math.sin(Math.PI * e);
    const lerp = (from: number, to: number) => from + (to - from) * e;
    const s = lerp(a.width, b.width) / W;
    set.x(lerp(a.x + a.width / 2, b.x + b.width / 2) - W / 2);
    const cy = lerp(a.y + a.height / 2, b.y + b.height / 2) - arc * 100;
    const floor = 88 + (s * H) / 2;
    set.y(cy + Math.max(0, floor - cy) * arc - H / 2);
    set.sx(s * (1 - 0.04 * arc));
    set.sy(s * (1 + 0.06 * arc));
    set.r(Math.sign(b.x - a.x) * arc * 10);
    layer.style.zIndex = i === 0 && p < 0.05 ? "0" : "20";

    const pose = e < 0.5 ? i : i + 1;
    if (pose !== shown) {
      gsap.to(poses[shown], { autoAlpha: 0, duration: 0.25, overwrite: "auto" });
      gsap.to(poses[pose], { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
      shown = pose;
    }
    const nowParked = p < 0.02 || p > 0.98;
    if (nowParked && !parked)
      gsap.fromTo(body, { scaleX: 1.06, scaleY: 0.92 }, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "expo.out", overwrite: "auto" });
    parked = nowParked;
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    removeEventListener("pointermove", onMove);
    layer.style.display = "";
    gsap.set(slots, { clearProps: "opacity,visibility" });
  };
});
