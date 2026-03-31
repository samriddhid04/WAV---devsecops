import { useState } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: 1,  name: "Chris", age: 34, condition: "Hypertension",     status: "active",     ward: "Cardiology",  admitted: "28 Mar", avatar: "AK", hue: "#4A7C59" },
  { id: 2,  name: "John",     age: 52, condition: "Type 2 Diabetes",  status: "critical",   ward: "ICU",         admitted: "30 Mar", avatar: "RM", hue: "#C0392B" },
  { id: 3,  name: "Nancy",    age: 28, condition: "Asthma",           status: "active",     ward: "Pulmonology", admitted: "1 Apr",  avatar: "PS", hue: "#2980B9" },
  { id: 4,  name: "Justin",     age: 61, condition: "Arthritis",        status: "discharged", ward: "Orthopedics", admitted: "25 Mar", avatar: "VN", hue: "#7F8C8D" },
  { id: 5,  name: "Paul",      age: 45, condition: "Migraine",         status: "active",     ward: "Neurology",   admitted: "2 Apr",  avatar: "DI", hue: "#8E44AD" },
  { id: 6,  name: "Laura",     age: 39, condition: "Anxiety Disorder", status: "active",     ward: "Psychiatry",  admitted: "31 Mar", avatar: "AP", hue: "#D35400" },
  { id: 7,  name: "Alex",     age: 55, condition: "Heart Failure",    status: "critical",   ward: "Cardiology",  admitted: "29 Mar", avatar: "KR", hue: "#C0392B" },
  { id: 8,  name: "Ken",     age: 67, condition: "COPD",             status: "discharged", ward: "Pulmonology", admitted: "20 Mar", avatar: "SB", hue: "#7F8C8D" },
  { id: 9,  name: "Tom",     age: 31, condition: "Appendicitis",     status: "active",     ward: "Surgery",     admitted: "2 Apr",  avatar: "NV", hue: "#16A085" },
  { id: 10, name: "George",    age: 48, condition: "Kidney Stones",    status: "active",     ward: "Urology",     admitted: "1 Apr",  avatar: "AK", hue: "#1A5276" },
];

const APPOINTMENTS = [
  { time: "09:00", name: "Chris", type: "Follow-up",    duration: "20 min" },
  { time: "10:00", name: "John",     type: "ICU Review",   duration: "30 min" },
  { time: "11:30", name: "Nancy",    type: "Consultation", duration: "45 min" },
  { time: "14:00", name: "Paul",      type: "Neuro Review", duration: "20 min" },
  { time: "15:30", name: "Laura",     type: "Therapy",      duration: "50 min" },
];

const CHART_PTS = [40, 55, 45, 60, 52, 68, 58, 72, 65, 74, 70, 76];

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const STATUS_META = {
  active:     { label: "Active",     bg: "#E8F5EC", text: "#2D6E44" },
  critical:   { label: "Critical",   bg: "#FDECEA", text: "#B71C1C" },
  discharged: { label: "Discharged", bg: "#F1F2F3", text: "#546E7A" },
};

function Badge({ status }) {
  const m = STATUS_META[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.3px",
      padding: "3px 10px", borderRadius: 20,
      background: m.bg, color: m.text, whiteSpace: "nowrap",
    }}>{m.label}</span>
  );
}

function Avatar({ initials, hue, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: hue + "22", color: hue,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.32), fontWeight: 600,
    }}>{initials}</div>
  );
}

// ── SPARKLINE CHART ───────────────────────────────────────────────────────────
function SparkChart() {
  const W = 260, H = 72;
  const max = Math.max(...CHART_PTS), min = Math.min(...CHART_PTS);
  const px = (i) => (i / (CHART_PTS.length - 1)) * W;
  const py = (v) => H - ((v - min) / (max - min + 2)) * H;
  const linePts = CHART_PTS.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const areaPts = `0,${H} ${linePts} ${W},${H}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A7C59" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4A7C59" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill="url(#sg)" />
      <polyline points={linePts} fill="none" stroke="#7EAF8C" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle
        cx={px(CHART_PTS.length - 1)}
        cy={py(CHART_PTS[CHART_PTS.length - 1])}
        r={5} fill="#7EAF8C"
      />
    </svg>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ setPage }) {
  const counts = {
    active:     PATIENTS.filter(p => p.status === "active").length,
    critical:   PATIENTS.filter(p => p.status === "critical").length,
    discharged: PATIENTS.filter(p => p.status === "discharged").length,
  };

  const metrics = [
    { label: "Active Patients",    value: counts.active,         accent: "#2D6E44" },
    { label: "Critical",           value: counts.critical,       accent: "#B71C1C" },
    { label: "Discharged Today",   value: counts.discharged,     accent: "#546E7A" },
    { label: "Appointments Today", value: APPOINTMENTS.length,   accent: "#185EA5" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#111", marginBottom: 4 }}>
          Good morning, Dr. John Doe
        </h1>
        <p style={{ fontSize: 14, color: "#999" }}>Wednesday, 2 April 2026 · Texas</p>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 14, border: "1px solid #E8E9E5",
            padding: "20px 22px",
          }}>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>{m.label}</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: m.accent, lineHeight: 1 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* Patient list preview */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E9E5", padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#111" }}>Patient Overview</h2>
            <button onClick={() => setPage("patients")} style={{
              fontSize: 12, padding: "6px 14px", borderRadius: 8,
              border: "1px solid #C5D9C8", background: "#EDF5EF", color: "#3A6E47",
              cursor: "pointer", fontFamily: "inherit",
            }}>View all →</button>
          </div>
          {PATIENTS.slice(0, 6).map((p, i) => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "11px 0",
              borderBottom: i < 5 ? "1px solid #F3F4F2" : "none",
            }}>
              <Avatar initials={p.avatar} hue={p.hue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{p.condition} · Age {p.age}</div>
              </div>
              <div style={{ fontSize: 12, color: "#ccc", marginRight: 8 }}>{p.ward}</div>
              <Badge status={p.status} />
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Heart rate card */}
          <div style={{ background: "#1E3A2F", borderRadius: 14, padding: "22px 24px", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#7EAF8C", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 4 }}>
              Avg Heart Rate · 12 readings
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, marginBottom: 16 }}>
              74 <span style={{ fontSize: 15, fontWeight: 300, opacity: 0.5 }}>bpm</span>
            </div>
            <SparkChart />
          </div>

          {/* Status bars */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E9E5", padding: "20px 22px" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: "#bbb", marginBottom: 18, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Status Breakdown
            </h3>
            {Object.entries(STATUS_META).map(([key, meta]) => {
              const count = PATIENTS.filter(p => p.status === key).length;
              const pct = Math.round((count / PATIENTS.length) * 100);
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: meta.text, fontWeight: 600 }}>{meta.label}</span>
                    <span style={{ color: "#ccc" }}>{count} / {PATIENTS.length}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: "#F1F2F1" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: meta.text, opacity: 0.65 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PATIENTS ──────────────────────────────────────────────────────────────────
function Patients() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  const filtered = PATIENTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.condition.toLowerCase().includes(q) ||
      p.ward.toLowerCase().includes(q);
    return matchSearch && (filter === "all" || p.status === filter);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#111", marginBottom: 4 }}>Patients</h1>
        <p style={{ fontSize: 14, color: "#999" }}>{PATIENTS.length} patients registered</p>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{
            position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
            color: "#ccc", fontSize: 16, pointerEvents: "none",
          }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, condition, ward…"
            style={{
              width: "100%", padding: "10px 14px 10px 36px",
              borderRadius: 10, border: "1px solid #DDE0DA",
              fontSize: 13, fontFamily: "inherit",
              background: "#fff", outline: "none", color: "#111",
              transition: "border-color 0.15s",
            }}
          />
        </div>
        {["all", "active", "critical", "discharged"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "9px 16px", borderRadius: 10, fontSize: 12,
            fontFamily: "inherit", cursor: "pointer", textTransform: "capitalize",
            border: filter === f ? "1px solid #4A7C59" : "1px solid #DDE0DA",
            background: filter === f ? "#EDF5EF" : "#fff",
            color: filter === f ? "#3A6E47" : "#777",
            fontWeight: filter === f ? 600 : 400,
          }}>{f}</button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "#bbb" }}>
        {filtered.length === 0
          ? "No patients match your search."
          : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {/* Patient rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(p => (
          <div
            key={p.id}
            style={{
              background: "#fff", border: "1px solid #E8E9E5", borderRadius: 12,
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
              cursor: "pointer", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#A8CCAF"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E8E9E5"}
          >
            <Avatar initials={p.avatar} hue={p.hue} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 3 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "#aaa" }}>{p.condition}</div>
            </div>
            <div style={{ textAlign: "right", marginRight: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#555" }}>{p.ward}</div>
              <div style={{ fontSize: 12, color: "#ccc", marginTop: 2 }}>Age {p.age}</div>
            </div>
            <div style={{ textAlign: "right", marginRight: 6 }}>
              <div style={{ fontSize: 12, color: "#ccc" }}>Admitted</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#555", marginTop: 2 }}>{p.admitted}</div>
            </div>
            <Badge status={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCHEDULE (static) ─────────────────────────────────────────────────────────
function Schedule() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#111", marginBottom: 4 }}>Schedule</h1>
        <p style={{ fontSize: 14, color: "#999" }}>Wednesday, 2 April 2026</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E9E5", overflow: "hidden" }}>
        {APPOINTMENTS.map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center",
            borderBottom: i < APPOINTMENTS.length - 1 ? "1px solid #F3F4F2" : "none",
          }}>
            <div style={{
              width: 88, flexShrink: 0, padding: "18px 16px",
              borderRight: "1px solid #F3F4F2",
              fontSize: 13, fontWeight: 600, color: "#777",
              fontVariantNumeric: "tabular-nums",
            }}>{a.time}</div>
            <div style={{ flex: 1, padding: "16px 20px" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 3 }}>{a.name}</div>
              <div style={{ fontSize: 13, color: "#aaa" }}>{a.type} · {a.duration}</div>
            </div>
            <div style={{ padding: "0 20px" }}>
              <button style={{
                fontSize: 12, padding: "7px 16px", borderRadius: 8,
                background: "#1E3A2F", color: "#fff", border: "none",
                cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
              }}>Start</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PLACEHOLDER ───────────────────────────────────────────────────────────────
function PlaceholderPage({ icon, title, desc }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 14 }}>
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#444" }}>{title}</div>
      <div style={{ fontSize: 14, color: "#bbb" }}>{desc}</div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "patients",  icon: "♡", label: "Patients"  },
  { id: "schedule",  icon: "◷", label: "Schedule"  },
  { id: "labs",      icon: "⊕", label: "Labs"      },
  { id: "messages",  icon: "◻", label: "Messages"  },
];

function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 210, flexShrink: 0, background: "#FDFCF9",
      borderRight: "1px solid #E8E9E5",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      <div style={{ padding: "26px 22px 20px", borderBottom: "1px solid #E8E9E5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1E3A2F", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#7EAF8C", fontSize: 15, fontWeight: 700 }}>H</span>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "#111" }}>WAV</div>
            <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.5px", textTransform: "uppercase" }}>Health OS</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "14px 10px" }}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 12px", borderRadius: 9,
              background: active ? "#EDF5EF" : "transparent",
              border: "none", cursor: "pointer",
              color: active ? "#3A6E47" : "#888",
              fontSize: 14, fontWeight: active ? 600 : 400,
              fontFamily: "inherit", marginBottom: 2, textAlign: "left",
              transition: "all 0.12s",
            }}>
              <span style={{ fontSize: 16, opacity: 0.7 }}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 18px 24px", borderTop: "1px solid #E8E9E5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#E8F0FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#2980B9" }}>DR</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Dr. John Doe</div>
            <div style={{ fontSize: 11, color: "#ccc" }}>Cardiologist</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");

  const content = {
    dashboard: <Dashboard setPage={setPage} />,
    patients:  <Patients />,
    schedule:  <Schedule />,
    labs:      <PlaceholderPage icon="🧪" title="Lab Results"   desc="Coming soon — lab reports and test tracking." />,
    messages:  <PlaceholderPage icon="💬" title="Messages"      desc="Coming soon — internal messaging between staff." />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F4F3EF; color: #111; }
        input:focus { outline: none; border-color: #4A7C59 !important; box-shadow: 0 0 0 3px rgba(74,124,89,0.12); }
        button:active { transform: scale(0.97); }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar page={page} setPage={setPage} />
        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
          {content[page]}
        </main>
      </div>
    </>
  );
}