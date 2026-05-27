import { useState, useEffect, useCallback, useRef } from "react";

// ─── Checklist Data ───────────────────────────────────────────────────────────

const CHECKLIST_DATA = [
  {
    id: "pre",
    title: "Before You Arrive",
    icon: "📋",
    items: [
      { id: "pre-1", text: "Confirm your assigned VIN on your Tesla account matches delivery paperwork" },
      { id: "pre-2", text: "Download the Tesla app and complete all pre-delivery steps (insurance, payment, registration)" },
      { id: "pre-3", text: "Book a morning delivery appointment — you want natural light for paint inspection" },
      { id: "pre-4", text: "Bring a USB-C charger to test ports and a microfibre cloth to check paint depth" },
      { id: "pre-5", text: "Note: Model YL is sourced from Giga Shanghai — inspect transit damage carefully" },
    ],
  },
  {
    id: "exterior-locked",
    title: "Exterior — Vehicle Locked",
    icon: "🚗",
    items: [
      { id: "ext-1", text: "VIN on windshield (bottom driver's side) matches your Tesla account and paperwork" },
      { id: "ext-2", text: "Paint colour and wheel style match your order (19\" vs 20\" Induction wheels)" },
      { id: "ext-3", text: "Full-width front LED light bar: check for dead pixels or uneven brightness along the strip" },
      { id: "ext-4", text: "Full-width rear LED light bar: inspect the continuous bar for chips, cracks, or gaps at the body seam" },
      { id: "ext-5", text: "YL-specific: Check extended body proportions — the extra 177mm wheelbase means an additional body panel section each side. Inspect panel gap consistency around the extension" },
      { id: "ext-6", text: "Panel gaps: compare left vs right, and front vs rear doors. Gaps should be even and consistent" },
      { id: "ext-7", text: "Hood/frunk sits flush with front quarter panels and bumper" },
      { id: "ext-8", text: "Windshield installed evenly — gaps between glass and A-pillar should be equal both sides (uneven = wind noise)" },
      { id: "ext-9", text: "Inspect paint around front intake vents on lower bumper for chips or orange peel" },
      { id: "ext-10", text: "Check rocker panels (black lower trim) for damage or paint transfer from transport" },
      { id: "ext-11", text: "Check all four door handles are present, flush, and undamaged" },
      { id: "ext-12", text: "Wheels: inspect for curb rash, dings, or transit damage on all four rims" },
      { id: "ext-13", text: "Tyres: no screws, nails, or debris lodged in treads; check sidewall condition" },
      { id: "ext-14", text: "All four hubcaps (if fitted) properly attached and not cracked" },
      { id: "ext-15", text: "Inspect all wheel wells — plastic noise dampener pins all present, metal threaded pins with plastic nuts fully secured" },
      { id: "ext-16", text: "Check A, B, C, and D-pillar areas for dings or paint chips (more pillars due to extended body)" },
      { id: "ext-17", text: "Undercarriage: scan for damage, missing screws, or screws not fully seated" },
      { id: "ext-18", text: "Charging port (driver's side rear): fits flush, flap undamaged" },
      { id: "ext-19", text: "Check tail light / light bar area for condensation or moisture intrusion" },
      { id: "ext-20", text: "YL-specific: Inspect the longer liftgate for alignment and even gap around all four edges" },
      { id: "ext-21", text: "YL-specific: Check unique YL wheel design and YL-specific rear emblems/badging are present and undamaged" },
      { id: "ext-22", text: "V2L port cover present and undamaged" },
    ],
  },
  {
    id: "exterior-unlocked",
    title: "Exterior — Vehicle Unlocked",
    icon: "🔓",
    items: [
      { id: "extu-1", text: "Turn on all lights: front light bar DRLs, headlights, fog lights, tail light bar, brake lights, reverse lights, turn signals (integrated in light bar ends)" },
      { id: "extu-2", text: "Adaptive headlights: confirm they swivel when turning steering wheel" },
      { id: "extu-3", text: "Front light bar: confirm turn signals illuminate correctly at both ends of the bar" },
      { id: "extu-4", text: "Rear light bar: visually confirm it's a single continuous illuminated strip with no dark segments" },
      { id: "extu-5", text: "Wipers: test both speeds and washer function; check wiper blades clear cleanly without skipping" },
      { id: "extu-6", text: "Inspect all glass (windshield, panoramic roof, rear, side windows) for chips, cracks, or scratches" },
      { id: "extu-7", text: "Panoramic roof: check seals around the full perimeter, no lifting or gaps" },
      { id: "extu-8", text: "Charge port: opens and closes correctly via app and screen command" },
      { id: "extu-9", text: "Verify rubber door seals are fully seated on all four doors (common issue: secondary seal on door bottoms)" },
      { id: "extu-10", text: "Power liftgate: test open/close, height adjustment stops correctly, button on the hatch closes it cleanly" },
      { id: "extu-11", text: "YL-specific: Liftgate is longer and heavier — confirm it opens without shuddering and closes without catching on weather seals" },
      { id: "extu-12", text: "Water guards below rear windshield are clear and not blocked" },
      { id: "extu-13", text: "Side mirrors: fold and unfold correctly; check for scratches or cracks in mirror glass" },
      { id: "extu-14", text: "Check charge level — should be 80–90% for delivery" },
    ],
  },
  {
    id: "frunk",
    title: "Frunk",
    icon: "🔲",
    items: [
      { id: "frk-1", text: "Open and close frunk — latches cleanly without gaps" },
      { id: "frk-2", text: "Inspect frunk interior for paint defects, dents, or signs of improper closing around T logo" },
      { id: "frk-3", text: "Trim clips holding frunk liner are all present and seated" },
      { id: "frk-4", text: "Frunk drain plug is present (YL has a drain plug — confirm it's seated)" },
      { id: "frk-5", text: "Tow hook is included in the frunk accessory bag" },
      { id: "frk-6", text: "Front license plate holder present (if required in your state/territory)" },
    ],
  },
  {
    id: "interior-front",
    title: "Interior — Front Cabin",
    icon: "🪑",
    items: [
      { id: "int-1", text: "16-inch main touchscreen: no scratches, dead pixels, or touch dead zones — test all corners" },
      { id: "int-2", text: "Screen responsiveness: navigate, use Sketchpad app, check for phantom touches" },
      { id: "int-3", text: "Steering wheel: new TESLA logo (not T badge) — inspect for scratches, tears front and back" },
      { id: "int-4", text: "Turn signal stalks: actuate smoothly both directions, confirm click and return" },
      { id: "int-5", text: "Gear selection via touchscreen: confirm Drive, Reverse, Neutral, Park all engage" },
      { id: "int-6", text: "Redesigned centre console with sliding cover: opens and closes smoothly, no binding" },
      { id: "int-7", text: "Wireless charging: test both left and right pads with your phone" },
      { id: "int-8", text: "Wired charging: test both front USB-C ports" },
      { id: "int-9", text: "Glovebox: opens and closes, USB drive for Sentry/Dashcam present" },
      { id: "int-10", text: "Inspect dashboard: new wrap-around design — check for scratches, uneven seams, or trim gaps" },
      { id: "int-11", text: "64-colour ambient lighting: cycle through colours via screen, check for dark spots or uneven glow" },
      { id: "int-12", text: "Ambient light strip continuity: where the door strip meets the dash trim — common misalignment issue. Check both sides" },
      { id: "int-13", text: "Headliner: inspect for grease, damage, or scuffs" },
      { id: "int-14", text: "Front seats: inspect for scuffs, damage, or poor stitching/seams" },
      { id: "int-15", text: "Front seat adjustments: all-way power adjustment, lumbar support, powered thigh support — test each axis" },
      { id: "int-16", text: "Seat heating (front): both seats, confirm function" },
      { id: "int-17", text: "Seat ventilation (front): both seats, confirm airflow" },
      { id: "int-18", text: "Windshield and A-pillars: check for any distortion or rippling in glass" },
      { id: "int-19", text: "Interior door sills: check for scratches on door sill trim" },
      { id: "int-20", text: "All windows: one-click open/close, manual override, no unusual noises; front two should go fully down, rear windows partial" },
      { id: "int-21", text: "Both coat hooks: extend, retract, and latch correctly" },
      { id: "int-22", text: "All interior lights: dome lights, reading lights, puddle lights, door pocket lighting — all functional" },
    ],
  },
  {
    id: "interior-second",
    title: "Interior — Second Row (Captain's Chairs)",
    icon: "💺",
    items: [
      { id: "r2-1", text: "YL-specific: Both captain's chairs present with correct trim and stitching — no scuffs, tears, or factory marks" },
      { id: "r2-2", text: "Seat heating (row 2): test both seats via rear screen or main screen" },
      { id: "r2-3", text: "Seat ventilation (row 2): test both seats" },
      { id: "r2-4", text: "Power seat adjustment: forward/back slide, recline for both seats" },
      { id: "r2-5", text: "Power armrests: extend and retract on both inboard armrests; test via rear seat screen AND physical button on seat cushion side" },
      { id: "r2-6", text: "One-touch fold function: fold both seatbacks forward; confirm they lock flat and release cleanly" },
      { id: "r2-7", text: "Walk-through gap between seats: confirm clear access path to row 3 without needing tilt/slide" },
      { id: "r2-8", text: "8-inch rear seat display: test climate controls, media, seat adjustments; check for dead pixels and responsiveness" },
      { id: "r2-9", text: "USB-C ports (row 2): confirm both ports charge devices" },
      { id: "r2-10", text: "Row 2 cupholders: present and secure" },
      { id: "r2-11", text: "Ambient lighting continuity: check door-to-seatback trim lighting alignment both sides" },
      { id: "r2-12", text: "Seatbelts: smooth operation on both row 2 seatbelts; pretensioners click in correctly" },
      { id: "r2-13", text: "ISOFIX anchor points: both row 2 outer seats have accessible anchors" },
    ],
  },
  {
    id: "interior-third",
    title: "Interior — Third Row",
    icon: "👨‍👩‍👧‍👦",
    items: [
      { id: "r3-1", text: "YL-specific: Third row seats present and correctly trimmed — inspect headrests, cushions, and seatback fabric" },
      { id: "r3-2", text: "Third row seat heating: test both seats (via main screen or boot controls)" },
      { id: "r3-3", text: "Power fold: both third-row seats fold flat using boot button and screen command" },
      { id: "r3-4", text: "Power recline: confirm adjustable headrests and recline function correctly" },
      { id: "r3-5", text: "Magnetic floor lift: when folding row 2, confirm the lower floor lifts magnetically to connect to row 3 seatbacks for a flat load floor" },
      { id: "r3-6", text: "Fully flat surface: with both rows folded, check the floor is genuinely flat front-to-back (no ridge at row 2/3 join)" },
      { id: "r3-7", text: "Third row USB-C ports: test both ports" },
      { id: "r3-8", text: "Third row cupholders: present both sides and secure" },
      { id: "r3-9", text: "Headroom: sit in row 3 and assess — panoramic roof helps but sloping roofline can be tight" },
      { id: "r3-10", text: "Dedicated climate ventilation (row 3): airflow present from dedicated vents" },
      { id: "r3-11", text: "ISOFIX + top tether anchor points: confirm present and accessible in row 3" },
      { id: "r3-12", text: "Seatbelts: both row 3 seatbelts click, retract, and release correctly" },
    ],
  },
  {
    id: "boot",
    title: "Boot / Cargo Area",
    icon: "📦",
    items: [
      { id: "boot-1", text: "Power liftgate: opens and closes smoothly, no shuddering" },
      { id: "boot-2", text: "Liftgate button (on hatch): confirm closes from hatch button" },
      { id: "boot-3", text: "Boot lighting: confirm both cargo lights illuminate" },
      { id: "boot-4", text: "Boot seat fold buttons: fold row 2 and row 3 seats from boot — confirm both sets respond" },
      { id: "boot-5", text: "Cargo covers: present, properly attached, and slide smoothly" },
      { id: "boot-6", text: "Row 2 and 3 seat folds don't catch on boot floor carpeting" },
      { id: "boot-7", text: "Weather seals around liftgate: inspect full perimeter for correct seating" },
      { id: "boot-8", text: "Tow hitch: present if ordered" },
    ],
  },
  {
    id: "tech-av",
    title: "Technology & AV Systems",
    icon: "📡",
    items: [
      { id: "tech-1", text: "Backup camera: clear image, no artifacts or dropout" },
      { id: "tech-2", text: "Side cameras (blind spot): confirm both show clear feeds when changing lanes" },
      { id: "tech-3", text: "All Autopilot cameras: check no obstructions or misaligned housings on all 8 cameras" },
      { id: "tech-4", text: "Park Assist sensors: walk around car and confirm sensor coverage shown on screen" },
      { id: "tech-5", text: "19-speaker audio system: play a familiar track, use balance and fader controls to test all speakers including row 2 and row 3 dedicated speakers" },
      { id: "tech-6", text: "Bluetooth: pair your phone, confirm audio handoff and call quality" },
      { id: "tech-7", text: "Wi-Fi and LTE connectivity: confirm signal and software version visible on screen" },
      { id: "tech-8", text: "Phone key: lock/unlock and passive entry from a distance — YL has 10x improved phone detection range" },
      { id: "tech-9", text: "Two key cards provided in sleeve: test both" },
      { id: "tech-10", text: "FSD/Autopilot: confirm subscription or purchased FSD shows as active in your account" },
      { id: "tech-11", text: "Over-the-air: confirm software is current and no pending critical updates blocked" },
      { id: "tech-12", text: "Sentry Mode / Dashcam: enable and confirm USB drive detected" },
    ],
  },
  {
    id: "drivetrain",
    title: "Drivetrain & Safety",
    icon: "⚡",
    items: [
      { id: "drive-1", text: "HVAC: test heating and cooling front, row 2, and row 3 zones independently" },
      { id: "drive-2", text: "Heat pump: push temp to max/min and listen for loud or unusual noises from the heat pump" },
      { id: "drive-3", text: "Confirm battery charge level and check for any battery or range warnings" },
      { id: "drive-4", text: "Put vehicle in Drive, Reverse — confirm smooth engagement and regen braking feel" },
      { id: "drive-5", text: "Electronic damping / adaptive suspension: drive over a speed bump and listen for clunks or knocks (suspension reworked for YL's extra load)" },
      { id: "drive-6", text: "Brake and accelerator pedals: check finish consistency and inspect for obvious weld marks on brake pedal arm" },
      { id: "drive-7", text: "No warning lights or alerts on screen at time of delivery" },
      { id: "drive-8", text: "YL-specific: V2L — plug V2L adapter into charge port and confirm 3.3kW power output (first Tesla in Australia with V2L)" },
      { id: "drive-9", text: "AC charging: confirm 11kW Type 2 AC charging works (if charger available)" },
      { id: "drive-10", text: "Set up PIN to Drive and review Sentry Mode settings before leaving" },
    ],
  },
  {
    id: "post",
    title: "After Delivery (First 7 Days)",
    icon: "✅",
    items: [
      { id: "post-1", text: "Document all defects with timestamped photos before leaving the delivery centre" },
      { id: "post-2", text: "Open a Service Request in the Tesla app immediately for any issues noted at delivery" },
      { id: "post-3", text: "You have 72 hours to report wear-and-tear items (paint, scratches, dings) for free rectification" },
      { id: "post-4", text: "Warranty items (mechanical, electrical) remain covered under 8 year / 192,000km battery warranty" },
      { id: "post-5", text: "Check door rubber seals weekly in the first month — bottom door seals are a known issue on Juniper platform" },
      { id: "post-6", text: "Monitor tail light bar for condensation after the first hot→cold temperature cycle" },
      { id: "post-7", text: "Check ambient lighting strip alignment at night — door-to-dash gaps are more visible with lights on" },
      { id: "post-8", text: "Visit a Supercharger within first week to confirm DC fast charging (up to 250kW) works correctly" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

function getSessionId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("s");
}

function setSessionIdInUrl(id) {
  const url = new URL(window.location.href);
  url.search = `?s=${id}`;
  window.history.replaceState(null, "", url.toString());
}

// ─── Print CSS ────────────────────────────────────────────────────────────────

const PRINT_CSS = `
@media print {
  body { background: white !important; color: black !important; }
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  .print-section { break-inside: avoid; margin-bottom: 16px; }
  .print-header { background: white !important; position: static !important; border-bottom: 2px solid #e31937 !important; padding: 12px 0 8px !important; }
  .print-section-title { font-size: 13px; font-weight: 700; background: #f3f4f6; padding: 6px 8px; border-radius: 4px; margin-bottom: 4px; display: block; }
  .print-item { border-bottom: 1px solid #eee; padding: 5px 0; display: flex !important; align-items: flex-start; gap: 8px; }
  .print-item input[type=checkbox] { width: 14px; height: 14px; margin-top: 2px; flex-shrink: 0; }
  .print-yl-badge { background: #7c3aed; color: white; font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: 800; margin-right: 4px; }
  .print-title { font-size: 22px; font-weight: 800; color: #111; }
  .print-subtitle { font-size: 11px; color: #666; }
  .print-progress { font-size: 11px; color: #333; margin-top: 4px; }
}
`;

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({ pre: true });
  const [filter, setFilter] = useState("all");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const saveTimer = useRef(null);

  // Inject print CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = PRINT_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // On mount: resolve or create session ID, then load state from API
  useEffect(() => {
    async function init() {
      let id = getSessionId();
      if (!id) {
        id = generateId();
        setSessionIdInUrl(id);
      }
      setSessionId(id);

      try {
        const res = await fetch(`/api/session?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setChecked(data.checked || {});
        }
      } catch (e) {
        console.warn("Could not load session:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Debounced save to KV
  const saveToKV = useCallback((checkedState, id) => {
    if (!id) return;
    clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/session?id=${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checked: checkedState }),
        });
        if (res.ok) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    }, 600);
  }, []);

  const toggle = useCallback((itemId) => {
    setChecked((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      saveToKV(next, sessionId);
      return next;
    });
  }, [sessionId, saveToKV]);

  const handleReset = () => {
    if (!confirm("Reset all checkboxes for this session?")) return;
    setChecked({});
    saveToKV({}, sessionId);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const all = {};
    CHECKLIST_DATA.forEach((s) => (all[s.id] = true));
    setExpanded(all);
    setTimeout(() => window.print(), 150);
  };

  const toggleSection = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const all = {};
    CHECKLIST_DATA.forEach((s) => (all[s.id] = true));
    setExpanded(all);
  };

  const collapseAll = () => setExpanded({});

  const totalItems = CHECKLIST_DATA.reduce((a, s) => a + s.items.length, 0);
  const checkedCount = CHECKLIST_DATA.reduce(
    (a, s) => a + s.items.filter((i) => checked[i.id]).length, 0
  );
  const pct = Math.round((checkedCount / totalItems) * 100);

  const getFilteredItems = (items) => {
    if (filter === "remaining") return items.filter((i) => !checked[i.id]);
    if (filter === "done") return items.filter((i) => checked[i.id]);
    return items;
  };

  const saveIndicator = {
    saving: { color: "#f59e0b", text: "Saving…" },
    saved:  { color: "#22c55e", text: "✓ Saved" },
    error:  { color: "#e31937", text: "⚠ Save failed" },
    idle:   { color: "#374151", text: "" },
  }[saveStatus];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0d14" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚡</div>
          <div style={{ color: "#6b7280", fontFamily: "monospace", fontSize: "13px" }}>Loading session…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      {/* ── Header ── */}
      <div style={s.header} className="print-header">
        <div style={s.headerTop}>
          <div>
            <div style={s.eyebrow} className="no-print">DELIVERY INSPECTION</div>
            <h1 style={s.title} className="print-title">Tesla Model YL</h1>
            <div style={s.subtitle} className="print-subtitle">6-Seat Extended Wheelbase · 2025–2026</div>
            <div style={s.progressText} className="print-progress">
              {checkedCount} of {totalItems} items checked ({pct}%)
            </div>
          </div>
          <div style={s.scoreBlock} className="no-print">
            <svg width="76" height="76" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#1e2535" strokeWidth="7" />
              <circle cx="40" cy="40" r="34" fill="none"
                stroke={pct === 100 ? "#22c55e" : "#e31937"} strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                strokeLinecap="round" transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
              <text x="40" y="45" textAnchor="middle" fill="white" fontSize="17"
                fontWeight="700" fontFamily="'DM Mono', monospace">{pct}%</text>
            </svg>
            <div style={s.scoreLabel}>{checkedCount}/{totalItems}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={s.progressTrack} className="no-print">
          <div style={{
            ...s.progressFill, width: `${pct}%`,
            background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #e31937, #ff6b6b)",
          }} />
        </div>

        {/* Controls */}
        <div style={s.controls} className="no-print">
          <div style={s.filterGroup}>
            {["all", "remaining", "done"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}>
                {f === "all" ? "All" : f === "remaining" ? "Remaining" : "Done"}
              </button>
            ))}
          </div>
          <div style={s.btnGroup}>
            {saveStatus !== "idle" && (
              <span style={{ ...s.saveIndicator, color: saveIndicator.color }}>
                {saveIndicator.text}
              </span>
            )}
            <button onClick={expandAll} style={s.ctrlBtn}>Expand all</button>
            <button onClick={collapseAll} style={s.ctrlBtn}>Collapse all</button>
            <button onClick={copyLink} style={{ ...s.ctrlBtn, color: copied ? "#22c55e" : "#60a5fa" }}>
              {copied ? "✓ Copied!" : "📋 Copy link"}
            </button>
            <button onClick={handlePrint} style={{ ...s.ctrlBtn, color: "#f59e0b" }}>🖨 PDF</button>
            <button onClick={handleReset} style={{ ...s.ctrlBtn, color: "#e31937" }}>Reset</button>
          </div>
        </div>
      </div>

      {/* ── Session banner ── */}
      <div style={s.sessionBanner} className="no-print">
        <span style={s.sessionDot} />
        <span style={s.sessionText}>
          Session <code style={s.sessionCode}>{sessionId}</code> — progress saves automatically to the cloud. Bookmark this URL or tap <strong>Copy link</strong> to return on any device.
        </span>
      </div>

      {/* ── Sections ── */}
      <div style={s.sections}>
        {CHECKLIST_DATA.map((section) => {
          const sectionItems = getFilteredItems(section.items);
          const sectionTotal = section.items.length;
          const sectionDone = section.items.filter((i) => checked[i.id]).length;
          const isOpen = expanded[section.id];
          const allDone = sectionDone === sectionTotal;

          if (filter !== "all" && sectionItems.length === 0) return null;

          return (
            <div key={section.id} style={s.section} className="print-section">
              <button onClick={() => toggleSection(section.id)} className="no-print"
                style={{ ...s.sectionHeader, ...(allDone ? s.sectionHeaderDone : {}) }}>
                <div style={s.sectionLeft}>
                  <span style={s.sectionIcon}>{section.icon}</span>
                  <span style={s.sectionTitle}>{section.title}</span>
                </div>
                <div style={s.sectionRight}>
                  <span style={{ ...s.badge, ...(allDone ? s.badgeDone : {}) }}>
                    {sectionDone}/{sectionTotal}
                  </span>
                  <span style={{ ...s.chevron, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </div>
              </button>

              {/* Print-only section title */}
              <div className="print-only" style={{ display: "none" }}>
                <div className="print-section-title">{section.icon} {section.title} ({sectionDone}/{sectionTotal})</div>
                {section.items.map((item) => {
                  const isYL = item.text.toLowerCase().startsWith("yl-specific:");
                  const isChecked = !!checked[item.id];
                  const displayText = isYL ? item.text.replace(/^YL-specific:\s*/i, "") : item.text;
                  return (
                    <div key={item.id} className="print-item" style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "4px 8px", borderBottom: "1px solid #eee" }}>
                      <input type="checkbox" checked={isChecked} readOnly style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", lineHeight: "1.4" }}>
                        {isYL && <span style={{ background: "#7c3aed", color: "white", fontSize: "8px", padding: "1px 4px", borderRadius: "3px", fontWeight: "800", marginRight: "4px" }}>YL</span>}
                        {displayText}
                      </span>
                    </div>
                  );
                })}
              </div>

              {isOpen && (
                <div style={s.itemList} className="no-print">
                  {sectionItems.map((item) => {
                    const isYL = item.text.toLowerCase().startsWith("yl-specific:");
                    const isChecked = !!checked[item.id];
                    const displayText = isYL ? item.text.replace(/^YL-specific:\s*/i, "") : item.text;
                    return (
                      <label key={item.id}
                        style={{ ...s.item, ...(isChecked ? s.itemChecked : {}) }}>
                        <input type="checkbox" checked={isChecked}
                          onChange={() => toggle(item.id)} style={s.checkbox} />
                        <div style={s.itemContent}>
                          {isYL && <span style={s.ylBadge}>YL</span>}
                          <span style={{ ...s.itemText, ...(isChecked ? s.itemTextDone : {}) }}>
                            {displayText}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.footerNote}>
          Items tagged <span style={s.ylBadge}>YL</span> are specific to the extended-wheelbase 6-seat Model YL.
        </div>
        <div style={s.footerMeta}>
          Based on community delivery reports · AU deliveries commenced Q2 2026 · Not affiliated with Tesla
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: { minHeight: "100vh", background: "#0a0d14", color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: "60px" },
  header: { background: "linear-gradient(160deg,#0e1220 0%,#12162a 100%)", borderBottom: "1px solid #1e2535", padding: "28px 24px 16px", position: "sticky", top: 0, zIndex: 10 },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  eyebrow: { fontSize: "10px", letterSpacing: "0.15em", color: "#e31937", fontWeight: "700", marginBottom: "4px", fontFamily: "'DM Mono',monospace" },
  title: { margin: 0, fontSize: "26px", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1 },
  subtitle: { fontSize: "12px", color: "#6b7280", marginTop: "4px", fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em" },
  progressText: { fontSize: "11px", color: "#4b5563", marginTop: "4px", fontFamily: "'DM Mono',monospace" },
  scoreBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  scoreLabel: { fontSize: "11px", color: "#6b7280", fontFamily: "'DM Mono',monospace" },
  progressTrack: { height: "3px", background: "#1e2535", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" },
  progressFill: { height: "100%", borderRadius: "2px", transition: "width 0.4s ease" },
  controls: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  filterGroup: { display: "flex", gap: "4px" },
  filterBtn: { background: "transparent", border: "1px solid #1e2535", color: "#6b7280", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" },
  filterBtnActive: { background: "#e31937", borderColor: "#e31937", color: "#fff", fontWeight: "600" },
  btnGroup: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
  saveIndicator: { fontSize: "11px", fontFamily: "'DM Mono',monospace" },
  ctrlBtn: { background: "transparent", border: "none", color: "#6b7280", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", padding: "4px 0" },
  sessionBanner: { margin: "10px 16px 0", maxWidth: "760px", marginLeft: "auto", marginRight: "auto", padding: "8px 12px", background: "#0e1220", border: "1px solid #1e2535", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "8px" },
  sessionDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", flexShrink: 0, marginTop: "4px" },
  sessionText: { fontSize: "12px", color: "#6b7280", lineHeight: "1.5" },
  sessionCode: { background: "#1e2535", padding: "1px 5px", borderRadius: "4px", fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#9ca3af" },
  sections: { maxWidth: "760px", margin: "12px auto 0", padding: "0 16px", display: "flex", flexDirection: "column", gap: "8px" },
  section: { background: "#0e1220", border: "1px solid #1e2535", borderRadius: "10px", overflow: "hidden" },
  sectionHeader: { width: "100%", background: "transparent", border: "none", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#e8eaf0", fontFamily: "inherit" },
  sectionHeaderDone: { opacity: 0.65 },
  sectionLeft: { display: "flex", alignItems: "center", gap: "10px" },
  sectionIcon: { fontSize: "16px" },
  sectionTitle: { fontSize: "14px", fontWeight: "700" },
  sectionRight: { display: "flex", alignItems: "center", gap: "10px" },
  badge: { background: "#1e2535", color: "#9ca3af", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontFamily: "'DM Mono',monospace" },
  badgeDone: { background: "#14532d", color: "#4ade80" },
  chevron: { fontSize: "16px", color: "#4b5563", transition: "transform 0.2s ease", display: "block" },
  itemList: { borderTop: "1px solid #1e2535", padding: "4px 0" },
  item: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #12172a" },
  itemChecked: { background: "#0a1a0e" },
  checkbox: { marginTop: "2px", flexShrink: 0, accentColor: "#22c55e", width: "16px", height: "16px", cursor: "pointer" },
  itemContent: { display: "flex", alignItems: "flex-start", gap: "8px", flex: 1 },
  ylBadge: { background: "#7c3aed", color: "#e9d5ff", fontSize: "9px", fontWeight: "800", padding: "2px 5px", borderRadius: "4px", letterSpacing: "0.08em", flexShrink: 0, marginTop: "2px", fontFamily: "'DM Mono',monospace" },
  itemText: { fontSize: "13.5px", lineHeight: "1.5", color: "#cbd5e1" },
  itemTextDone: { color: "#374151", textDecoration: "line-through" },
  footer: { maxWidth: "760px", margin: "32px auto 0", padding: "20px 16px 0", borderTop: "1px solid #1e2535" },
  footerNote: { fontSize: "12px", color: "#6b7280", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" },
  footerMeta: { fontSize: "11px", color: "#374151", fontFamily: "'DM Mono',monospace" },
};
