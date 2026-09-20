import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  Circle,
  Clock3,
  Martini,
  Map,
  MapPin,
  Music2,
  Navigation,
  Plane,
  Sparkles,
  Star,
  Ticket,
  Wine,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "hs-weekend-nyc-2026";

const statusMeta = {
  reserved: { label: "RESERVED", cue: "Fixed booking" },
  tentative: { label: "TENTATIVE", cue: "If confirmed / if available" },
  flexible: { label: "FLEXIBLE", cue: "Can move if needed" },
};

const days = {
  friday: {
    key: "friday",
    nav: "FRI 23",
    label: "FRIDAY",
    date: "OCTOBER 23",
    theme: "Fall by day. Disco by night.",
    mood: "ARRIVE → FALL IN NYC → GOLDEN HOUR → HARRY",
  },
  saturday: {
    key: "saturday",
    nav: "SAT 24",
    label: "SATURDAY",
    date: "OCTOBER 24",
    theme: "Books, Broadway & Downtown After Dark.",
    mood: "BOOKS → BROADWAY → DOWNTOWN → DATE NIGHT → JAZZ",
  },
  sunday: {
    key: "sunday",
    nav: "SUN 25",
    label: "SUNDAY",
    date: "OCTOBER 25",
    theme: "One last look at New York.",
    mood: "HOME",
  },
};

const activities = [
  {
    id: "jfk-arrival",
    day: "friday",
    time: "8:50 AM",
    sort: "2026-10-23T08:50:00-04:00",
    title: "Arrive at JFK",
    status: "reserved",
    neighborhood: "JFK → Manhattan",
    notes: "Land at JFK and take the pre-planned shuttle into Manhattan.",
    travelNext: "Shuttle into Manhattan. Leave buffer for traffic.",
    icon: Plane,
  },
  {
    id: "hotel-drop",
    day: "friday",
    time: "~10:30–11:15 AM",
    sort: "2026-10-23T10:30:00-04:00",
    title: "Millennium Hilton New York One UN Plaza",
    status: "flexible",
    neighborhood: "Turtle Bay",
    notes: "Drop luggage at the hotel. Check-in if available.",
    extra: "Millennium Hilton New York One UN Plaza · 1 United Nations Plaza",
    travelNext: "Hotel is immediately nearby for the UN reservation.",
    icon: MapPin,
  },
  {
    id: "un",
    day: "friday",
    time: "12:00 PM",
    sort: "2026-10-23T12:00:00-04:00",
    title: "United Nations",
    status: "reserved",
    neighborhood: "Turtle Bay",
    notes: "Confirmed reservation. Hotel is immediately nearby.",
    travelNext: "Head uptown afterward for Central Park.",
    icon: Star,
  },
  {
    id: "central-park",
    day: "friday",
    time: "~1:30 PM",
    sort: "2026-10-23T13:30:00-04:00",
    title: "Central Park — Fall Walk",
    label: "THE FALL MOMENT",
    status: "flexible",
    neighborhood: "Central Park",
    notes: "Enter Central Park, then let the afternoon feel unhurried and photogenic.",
    route: ["enter Central Park", "The Mall", "Bethesda Terrace", "Bethesda Fountain", "The Lake", "Bow Bridge", "fall foliage / photos"],
    travelNext: "Stay near the lake if the Boathouse timing works.",
    icon: Sparkles,
    variant: "fall",
  },
  {
    id: "boathouse",
    day: "friday",
    time: "~2:45–3:30 PM",
    sort: "2026-10-23T14:45:00-04:00",
    title: "Central Park Boathouse",
    status: "flexible",
    neighborhood: "Central Park",
    notes: "See the Boathouse and, if timing/weather allows, consider the boats. Not a mandatory full meal.",
    travelNext: "Short ride or brisk walk south toward MoMA.",
    icon: MapPin,
  },
  {
    id: "moma",
    day: "friday",
    time: "~3:30–4:45 PM",
    sort: "2026-10-23T15:30:00-04:00",
    title: "MoMA — Greatest Hits",
    status: "flexible",
    neighborhood: "Midtown",
    notes: "Do a focused highlights visit rather than trying to see the entire museum.",
    travelNext: "Keep the exit clean so Magic Hour stays relaxed.",
    icon: BookOpen,
    variant: "art",
    checklist: true,
  },
  {
    id: "magic-hour",
    day: "friday",
    time: "5:15 PM",
    sort: "2026-10-23T17:15:00-04:00",
    title: "Magic Hour Rooftop",
    label: "GOLDEN HOUR → DISCO MODE",
    status: "reserved",
    neighborhood: "Midtown / Herald Square",
    notes: "The official shift from fall afternoon into concert-night sparkle.",
    travelNext: "Close to MSG. Keep the vibe, watch the clock.",
    icon: Martini,
    variant: "golden",
  },
  {
    id: "chase-lounge",
    day: "friday",
    time: "7:00 PM",
    sort: "2026-10-23T19:00:00-04:00",
    title: "Chase Lounge",
    status: "tentative",
    neighborhood: "Madison Square Garden",
    notes: "If confirmed / if available. Do not treat this as required.",
    travelNext: "Already at MSG if it works out.",
    icon: Ticket,
  },
  {
    id: "harry",
    day: "friday",
    time: "8:00 PM",
    sort: "2026-10-23T20:00:00-04:00",
    title: "HARRY STYLES — MADISON SQUARE GARDEN",
    label: "TONIGHT · DISCO, OCCASIONALLY",
    status: "reserved",
    neighborhood: "Madison Square Garden",
    notes: "MADISON SQUARE GARDEN · 8:00 PM · THE MAIN EVENT 🪩",
    extra: "After the show: → back to One UN Plaza. No mandatory post-concert plans.",
    travelNext: "Back to One UN Plaza.",
    icon: Music2,
    variant: "main-event",
  },
  {
    id: "breakfast",
    day: "saturday",
    time: "Morning",
    sort: "2026-10-24T09:00:00-04:00",
    title: "Relaxed Breakfast",
    status: "flexible",
    neighborhood: "Near hotel or Morgan Library",
    notes: "Keep this soft: coffee, breakfast, and a little room before the library.",
    travelNext: "Aim toward the Morgan by 10:30 AM.",
    icon: Clock3,
  },
  {
    id: "morgan",
    day: "saturday",
    time: "10:30 AM",
    sort: "2026-10-24T10:30:00-04:00",
    title: "The Morgan Library & Museum",
    status: "reserved",
    neighborhood: "Murray Hill",
    notes: "Old-library atmosphere, manuscripts, quiet rooms, and a beautiful start to Saturday.",
    travelNext: "Quick move west toward theatre/Broadway orbit.",
    icon: BookOpen,
    variant: "library",
  },
  {
    id: "drama-book-shop",
    day: "saturday",
    time: "~12:00 PM",
    sort: "2026-10-24T12:00:00-04:00",
    title: "Drama Book Shop",
    status: "flexible",
    neighborhood: "Theater District",
    notes: "Quick browse before Broadway.",
    travelNext: "Stay close for the 2:00 PM show.",
    icon: BookOpen,
  },
  {
    id: "cursed-child",
    day: "saturday",
    time: "2:00 PM",
    sort: "2026-10-24T14:00:00-04:00",
    title: "Harry Potter and the Cursed Child",
    status: "reserved",
    neighborhood: "Broadway",
    notes: "Theatre afternoon. Elegant Broadway energy, no rush afterward.",
    travelNext: "Head downtown for the SoHo/Nolita run.",
    icon: Ticket,
    variant: "theatre",
  },
  {
    id: "nyon",
    day: "saturday",
    time: "~5:30 PM",
    sort: "2026-10-24T17:30:00-04:00",
    title: "New York or Nowhere",
    status: "flexible",
    neighborhood: "SoHo / Nolita",
    notes: "First downtown stop because of closing time. Flagship store at 250 Lafayette St for the real NYC souvenir moment.",
    extra: "250 Lafayette St · New York, NY 10012",
    travelNext: "Walk west through SoHo toward Aritzia on Broadway.",
    icon: Navigation,
    variant: "shop",
  },
  {
    id: "aritzia-soho",
    day: "saturday",
    time: "~6:05 PM",
    sort: "2026-10-24T18:05:00-04:00",
    title: "Aritzia — SoHo Flagship",
    status: "flexible",
    neighborhood: "SoHo",
    notes: "Go to the famous one: the SoHo Flagship on Broadway. Big flagship energy, cast-iron SoHo architecture, and the best version of this stop.",
    extra: "560 Broadway · New York, NY 10012",
    travelNext: "From here, keep the downtown run light: dessert, Pier 35 if timing works, then protect dinner.",
    icon: Star,
    variant: "shop",
  },
  {
    id: "mimis",
    day: "saturday",
    time: "~6:40 PM",
    sort: "2026-10-24T18:40:00-04:00",
    title: "Mimi’s Frozen Yogurt",
    status: "flexible",
    neighborhood: "SoHo / Nolita",
    notes: "Quick sweet stop after shopping. Keep it flexible so Pier 35 and One40 still work.",
    travelNext: "Then drift east for skyline views if timing is friendly.",
    icon: Sparkles,
  },
  {
    id: "pier-35",
    day: "saturday",
    time: "Sunset / early evening",
    sort: "2026-10-24T18:30:00-04:00",
    title: "Pier 35 — East River",
    label: "NYC VIEW MOMENT",
    status: "flexible",
    neighborhood: "Lower East Side waterfront",
    notes: "Photo/viewpoint moment. Keep it around sunset or early evening depending on downtown timing.",
    travelNext: "Check dinner timing before committing to a long waterfront pause.",
    icon: Camera,
    variant: "view",
  },
  {
    id: "bibliotheque",
    day: "saturday",
    time: "Early evening",
    sort: "2026-10-24T19:15:00-04:00",
    title: "Bibliotheque Wine Bar",
    status: "flexible",
    neighborhood: "SoHo / Nolita",
    notes: "Romantic wine stop with book-and-wine energy. Can move depending on Pier 35 timing and the 8:30 PM reservation.",
    travelNext: "Protect the 8:30 PM One40 reservation.",
    icon: Wine,
    variant: "wine",
  },
  {
    id: "one40",
    day: "saturday",
    time: "8:30 PM",
    sort: "2026-10-24T20:30:00-04:00",
    title: "One40",
    status: "reserved",
    neighborhood: "Downtown",
    notes: "Fixed Saturday night reservation. Main dinner/date-night anchor.",
    travelNext: "Late-night stops can flex after dinner.",
    icon: Wine,
    variant: "date",
  },
  {
    id: "old-friend",
    day: "saturday",
    time: "Late Night",
    sort: "2026-10-24T22:15:00-04:00",
    title: "Old Friend Photobooth",
    status: "flexible",
    neighborhood: "Downtown",
    notes: "A small, joyful proof-of-weekend stop.",
    extra: "TAKE THE PHOTO 📸",
    completeMessage: "Proof we were here.",
    travelNext: "Smalls is the ideal final stop if energy is still high.",
    icon: Camera,
  },
  {
    id: "smalls",
    day: "saturday",
    time: "Late Night",
    sort: "2026-10-24T23:15:00-04:00",
    title: "Smalls Jazz Club",
    label: "LAST STOP",
    status: "flexible",
    neighborhood: "West Village",
    notes: "The ideal final activity of the weekend: dark room, warm lamps, records, late-night jazz.",
    travelNext: "No strict ending time.",
    icon: Music2,
    variant: "jazz",
  },
  {
    id: "checkout",
    day: "sunday",
    time: "Morning",
    sort: "2026-10-25T07:30:00-04:00",
    title: "Check out — One UN Plaza",
    status: "flexible",
    neighborhood: "Turtle Bay",
    notes: "Soft departure morning. Keep the room sweep calm.",
    travelNext: "Leave for JFK around 8:00–8:15 AM.",
    icon: MapPin,
  },
  {
    id: "leave-jfk",
    day: "sunday",
    time: "~8:00–8:15 AM",
    sort: "2026-10-25T08:10:00-04:00",
    title: "Leave for JFK",
    status: "reserved",
    neighborhood: "Manhattan → JFK",
    notes: "Departure buffer matters more than squeezing in one more thing.",
    travelNext: "Target JFK by ~9:00 AM.",
    icon: Plane,
  },
  {
    id: "target-jfk",
    day: "sunday",
    time: "~9:00 AM",
    sort: "2026-10-25T09:00:00-04:00",
    title: "Target arrival at JFK",
    status: "reserved",
    neighborhood: "JFK",
    notes: "Arrive with room to breathe.",
    travelNext: "Flight home at 12:00 PM.",
    icon: Clock3,
  },
  {
    id: "flight-home",
    day: "sunday",
    time: "12:00 PM",
    sort: "2026-10-25T12:00:00-04:00",
    title: "Flight Home",
    status: "reserved",
    neighborhood: "JFK → Home",
    notes: "NYC → HOME",
    extra: "until next time.",
    travelNext: "Weekend complete.",
    icon: Plane,
  },
];

const momaWorks = [
  "Vincent van Gogh — The Starry Night",
  "Salvador Dalí — The Persistence of Memory",
  "Pablo Picasso",
  "Claude Monet",
  "Andy Warhol",
  "Henri Matisse",
];

const bench = [
  "Inter Miami",
  "AT CAVE",
  "American Museum of Natural History",
  "New York Public Library",
  "Roosevelt Island",
  "Caffe Paradiso",
  "Frank Sinatra show",
  "The Met — Possible MoMA swap",
];

const routes = {
  friday: [
    ["JFK", 86, 80],
    ["One UN Plaza / UN", 62, 38],
    ["Central Park", 43, 18],
    ["MoMA", 45, 30],
    ["Magic Hour", 47, 43],
    ["MSG", 41, 50],
  ],
  saturday: [
    ["One UN Plaza", 62, 38],
    ["Morgan Library", 54, 43],
    ["Drama Book Shop / Broadway", 44, 42],
    ["New York or Nowhere", 43, 64],
    ["Aritzia SoHo Flagship", 39, 66],
    ["Mimi’s", 42, 69],
    ["Pier 35", 61, 72],
    ["One40", 50, 78],
    ["Photobooth", 43, 82],
    ["Smalls", 34, 79],
  ],
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => loadState()[key] ?? initialValue);
  useEffect(() => {
    const current = loadState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [key]: value }));
  }, [key, value]);
  return [value, setValue];
}

function formatCountdown(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const seconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

function App() {
  const [completed, setCompleted] = usePersistentState("completed", []);
  const [seenWorks, setSeenWorks] = usePersistentState("moma", []);
  const [expanded, setExpanded] = useState(["harry", "central-park"]);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("itinerary");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [benchOpen, setBenchOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => new Date(a.sort) - new Date(b.sort)),
    []
  );
  const nextActivity = useMemo(() => {
    const upcoming = sortedActivities.find((item) => !completedSet.has(item.id) && new Date(item.sort) >= now);
    return upcoming || sortedActivities.find((item) => !completedSet.has(item.id)) || sortedActivities[sortedActivities.length - 1];
  }, [completedSet, now, sortedActivities]);
  const displayedNextActivity = useMemo(() => {
    if (filter === "all") return nextActivity;
    return (
      sortedActivities.find((item) => item.day === filter && !completedSet.has(item.id)) ||
      sortedActivities.find((item) => item.day === filter) ||
      nextActivity
    );
  }, [completedSet, filter, nextActivity, sortedActivities]);
  const activeDay = useMemo(() => {
    const key = nextActivity?.day || "friday";
    return filter !== "all" ? filter : key;
  }, [filter, nextActivity]);
  const visibleDays = filter === "all" ? ["friday", "saturday", "sunday"] : [filter];
  const eventCountdown = formatCountdown(new Date("2026-10-23T20:00:00-04:00") - now);

  const toggleComplete = (id) => {
    setCompleted((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    );
  };

  const toggleExpanded = (id) => {
    setExpanded((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    );
  };

  const scrollToActivity = (activity, resetFilter = false) => {
    if (resetFilter) setFilter("all");
    setView("itinerary");
    setExpanded((items) => [...new Set([...items, activity.id])]);
    requestAnimationFrame(() => {
      document.getElementById(activity.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const scrollToNext = () => scrollToActivity(nextActivity, true);

  const dayCounts = useMemo(() => {
    return Object.fromEntries(
      Object.keys(days).map((day) => {
        const items = activities.filter((item) => item.day === day);
        return [day, { done: items.filter((item) => completedSet.has(item.id)).length, total: items.length }];
      })
    );
  }, [completedSet]);

  const nextDayCounts = dayCounts[activeDay] || dayCounts.friday;

  return (
    <>
      <Hero countdown={eventCountdown} onStart={() => document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" })} />
      <nav className="sticky-nav" aria-label="Weekend navigation">
        <div className="nav-tabs">
          {Object.values(days).map((day) => (
            <button
              key={day.key}
              className={filter === day.key ? "active" : ""}
              onClick={() => {
                setFilter(day.key);
                setView("itinerary");
                document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {day.nav}
            </button>
          ))}
          <button className="now-button" onClick={scrollToNext}>
            Now <span />
          </button>
        </div>
      </nav>
      <main id="agenda">
        <section className="command-center">
          <div className="progress-card">
            <p>{days[activeDay].label} — {nextDayCounts.done} / {nextDayCounts.total} DONE</p>
            <div className="progress-track">
              <span style={{ width: `${(nextDayCounts.done / nextDayCounts.total) * 100}%` }} />
            </div>
          </div>
          <NextUp item={displayedNextActivity} onClick={() => scrollToActivity(displayedNextActivity)} />
          <div className="control-row">
            {["friday", "saturday", "sunday", "all"].map((key) => (
              <button key={key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>
                {key === "all" ? "ALL" : days[key].label}
              </button>
            ))}
          </div>
          <div className="mode-row">
            <button className={view === "itinerary" ? "active" : ""} onClick={() => setView("itinerary")}>Itinerary</button>
            <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
              <Map size={16} /> MAP / ROUTE
            </button>
            <button onClick={() => setDrawerOpen(true)}>
              <Sparkles size={16} /> WE HAVE TIME
            </button>
          </div>
        </section>

        {view === "map" ? (
          <RouteView activeDay={activeDay === "sunday" ? "friday" : activeDay} />
        ) : (
          <div className="timeline-shell">
            {visibleDays.map((dayKey) => (
              <DaySection
                key={dayKey}
                day={days[dayKey]}
                items={activities.filter((item) => item.day === dayKey)}
                completedSet={completedSet}
                expanded={expanded}
                onToggleComplete={toggleComplete}
                onToggleExpanded={toggleExpanded}
                seenWorks={seenWorks}
                setSeenWorks={setSeenWorks}
              />
            ))}
          </div>
        )}

        <WildcardCard />
        <Stats completedSet={completedSet} />
        <Bench open={benchOpen} onToggle={() => setBenchOpen((value) => !value)} />
      </main>
      <TimeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} completedSet={completedSet} />
    </>
  );
}

function Hero({ countdown, onStart }) {
  return (
    <header className="hero">
      <div className="hero-media" aria-hidden="true" />
      <div className="hero-content">
        <h1>HS WEEKEND</h1>
        <p className="hero-subtitle">New York City · October 23–25, 2026</p>
        <p className="hero-line">Fall. Disco. Books. Broadway. Harry. Jazz.</p>
        <p className="album-era">Kiss all the time · disco, occasionally</p>
        <div className="era-swatches" aria-label="Weekend color mood">
          <span>blush</span>
          <span>sky</span>
          <span>mustard</span>
          <span>plum</span>
        </div>
        <div className="countdown-card">
          <div>
            <strong>Harry Styles</strong>
            <span>Friday, October 23 · 8:00 PM</span>
          </div>
          <div className="countdown-grid">
            {Object.entries(countdown).map(([key, value]) => (
              <div key={key}>
                <b>{String(value).padStart(2, "0")}</b>
                <small>{key}</small>
              </div>
            ))}
          </div>
        </div>
        <p className="just-us">2 days · NYC · just us</p>
        <button className="hero-cta" onClick={onStart}>
          START THE WEEKEND <ArrowDown size={18} />
        </button>
      </div>
    </header>
  );
}

function NextUp({ item, onClick }) {
  return (
    <button className="next-up" onClick={onClick}>
      <span className="next-label">NEXT UP</span>
      <span className="next-time">{item.time}</span>
      <span className="next-title">{item.title}</span>
      <span className="next-meta"><MapPin size={14} /> {item.neighborhood} · {statusMeta[item.status].label}</span>
      <ArrowRight className="next-arrow" size={18} />
    </button>
  );
}

function DaySection({ day, items, completedSet, expanded, onToggleComplete, onToggleExpanded, seenWorks, setSeenWorks }) {
  return (
    <section className={`day-section ${day.key}`} aria-labelledby={`${day.key}-heading`}>
      <div className="day-heading">
        <span>{day.date}</span>
        <h2 id={`${day.key}-heading`}>{day.label}</h2>
        <p>{day.theme}</p>
        <small>{day.mood}</small>
      </div>
      <div className="timeline">
        {items.map((item) => (
          <ActivityCard
            key={item.id}
            item={item}
            done={completedSet.has(item.id)}
            open={expanded.includes(item.id)}
            onToggleComplete={onToggleComplete}
            onToggleExpanded={onToggleExpanded}
            seenWorks={seenWorks}
            setSeenWorks={setSeenWorks}
          />
        ))}
      </div>
    </section>
  );
}

function ActivityCard({ item, done, open, onToggleComplete, onToggleExpanded, seenWorks, setSeenWorks }) {
  const Icon = item.icon || Circle;
  return (
    <article id={item.id} className={`activity ${item.variant || ""} ${done ? "done" : ""}`}>
      <div className="time">{item.time}</div>
      <div className="timeline-dot" />
      <div className="activity-card">
        <button className="activity-summary" onClick={() => onToggleExpanded(item.id)} aria-expanded={open}>
          <span className="activity-icon"><Icon size={18} /></span>
          <span className="activity-copy">
            {item.label && <em>{item.label}</em>}
            <strong>{item.title}</strong>
            <small>{item.neighborhood}</small>
          </span>
          <span className={`status ${item.status}`}>
            <i /> {statusMeta[item.status].label}
          </span>
          <ChevronDown className={open ? "rotated" : ""} size={18} />
        </button>
        {open && (
          <div className="activity-details">
            <p>{item.notes}</p>
            {item.extra && <p className="extra-line">{item.extra}</p>}
            {item.route && <MiniList items={item.route} />}
            {item.sequence && <Sequence items={item.sequence} />}
            {item.checklist && <MomaChecklist seenWorks={seenWorks} setSeenWorks={setSeenWorks} />}
            <div className="detail-grid">
              <span><MapPin size={14} /> {item.neighborhood}</span>
              <span><Navigation size={14} /> {item.travelNext}</span>
              {item.status === "tentative" && <span><Clock3 size={14} /> If confirmed / if available.</span>}
            </div>
            {done && item.completeMessage && <p className="complete-message">{item.completeMessage}</p>}
            {item.variant === "main-event" && (
              <>
                <div className="harry-ticket" aria-hidden="true">
                  <span>HARRY</span>
                  <span>MSG</span>
                  <span>8 PM</span>
                </div>
                <div className="album-strip">
                  <span>weekend theme</span>
                  <b>kiss all the time · disco, occasionally · city romance</b>
                </div>
              </>
            )}
            <button className="complete-button" onClick={() => onToggleComplete(item.id)}>
              {done ? <Check size={17} /> : <Circle size={17} />} {done ? "Completed" : "Mark complete"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function MiniList({ items }) {
  return (
    <ol className="mini-route">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ol>
  );
}

function Sequence({ items }) {
  return (
    <div className="sequence">
      {items.map((item, index) => (
        <React.Fragment key={item}>
          <span>{item}</span>
          {index < items.length - 1 && <ArrowDown size={15} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function MomaChecklist({ seenWorks, setSeenWorks }) {
  return (
    <div className="moma-list">
      <div className="moma-head">
        <strong>MoMA Hit List</strong>
        <span>{seenWorks.length} / {momaWorks.length}</span>
      </div>
      {momaWorks.map((work) => (
        <label key={work}>
          <input
            type="checkbox"
            checked={seenWorks.includes(work)}
            onChange={() =>
              setSeenWorks((items) =>
                items.includes(work) ? items.filter((item) => item !== work) : [...items, work]
              )
            }
          />
          <span>{work}</span>
        </label>
      ))}
    </div>
  );
}

function RouteView({ activeDay }) {
  const dayKey = activeDay === "saturday" ? "saturday" : "friday";
  const stops = routes[dayKey];
  return (
    <section className="route-view">
      <div className="route-copy">
        <span>MAP / ROUTE</span>
        <h2>{days[dayKey].label} route</h2>
        <p>Approximate sequence only. Use live maps for transit, traffic, and exact walking times.</p>
      </div>
      <div className="map-board">
        <div className="manhattan" />
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <polyline points={stops.map(([, x, y]) => `${x},${y}`).join(" ")} />
        </svg>
        {stops.map(([label, x, y], index) => (
          <button key={label} className="route-dot" style={{ left: `${x}%`, top: `${y}%` }}>
            <b>{index + 1}</b>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function WildcardCard() {
  return (
    <section className="wildcard">
      <span>🥃 SPEAKEASY WILDCARD</span>
      <h2>Polly’s NY</h2>
      <p>If we’re nearby and have 20–30 minutes, stop at Polly’s for one drink just to experience the speakeasy.</p>
      <small>Spontaneous bonus. Not an obligation.</small>
    </section>
  );
}

function TimeDrawer({ open, onClose, completedSet }) {
  const options = [
    ["Polly’s speakeasy", "20–30 min wildcard", null],
    ["extra Central Park time", "photos / leaves / no rush", "central-park"],
    ["longer MoMA visit", "more galleries if energy is good", "moma"],
    ["Bibliotheque", "wine + books", "bibliotheque"],
    ["Pier 35", "skyline view", "pier-35"],
  ].filter(([, , id]) => !id || !completedSet.has(id));

  return (
    <div className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose}>
      <aside className="time-drawer" onClick={(event) => event.stopPropagation()}>
        <button className="drawer-pull" onClick={onClose} aria-label="Close drawer" />
        <div className="drawer-title">
          <h2>WE HAVE TIME ✨</h2>
          <p>Flexible ideas that still fit the weekend mood.</p>
        </div>
        {options.map(([title, note]) => (
          <div className="drawer-option" key={title}>
            <Sparkles size={16} />
            <div>
              <strong>{title}</strong>
              <span>{note}</span>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}

function Stats({ completedSet }) {
  const stats = [
    ["Museums", 2],
    ["Shows", 2],
    ["Rooftops", 1],
    ["Jazz clubs", 1],
    ["Wine bars", 1],
    ["Concerts", 1],
    ["Speakeasy potential", 1],
    ["Main character moments", "unlimited"],
  ];
  return (
    <section className="stats">
      <h2>Mini Trip Stats</h2>
      <div className="stat-grid">
        {stats.map(([label, value]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p>{completedSet.size} itinerary moments stamped so far.</p>
    </section>
  );
}

function Bench({ open, onToggle }) {
  return (
    <section className="bench">
      <button onClick={onToggle} aria-expanded={open}>
        <span>THE BENCH</span>
        <ChevronDown className={open ? "rotated" : ""} />
      </button>
      {open && (
        <div className="bench-list">
          {bench.map((item) => <span key={item}>{item}</span>)}
        </div>
      )}
      <footer>
        <strong>NYC → HOME</strong>
        <small>until next time.</small>
      </footer>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
