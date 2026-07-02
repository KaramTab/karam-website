/* ============================================================
   ALL SITE CONTENT LIVES HERE.
   Edit this file to update the website — no other file needed
   for day-to-day content changes.
   ============================================================ */

const PROFILE = {
  name: "Karam Altabaa",
  stageName: "Karam Tabba",
  tagline: "I run programmes by day. I appear in them by night.",
  email: "Karamtabba@gmail.com",
  linkedin: "https://www.linkedin.com/in/karam-altabba/",
  instagram: "https://www.instagram.com/karamtabba/",
  cloudjoi: "https://www.cloudjoi.com/profiles/116861",
  location: "Kuala Lumpur, Malaysia",
};

/* ---------- TECH SIDE ---------- */

const TECH = {
  role: "Programme Manager · AI",
  org: "YTL AI Labs",
  heroLines: [
    "> whoami",
    "Programme Manager, AI @ YTL AI Labs",
    "> current_mission",
    "Helping build ILMU — Malaysia's own AI",
    "> years_shipping",
    "10+ and counting",
  ],
  summary:
    "Ten years of turning ambitious, messy, cross-functional work into shipped products — from ERP rollouts and SaaS launches to a national education platform and now frontier AI. I'm the person who builds the framework, automates the boring parts, and keeps twenty workstreams honest.",
  highlights: [
    {
      title: "ILMU — Malaysia's AI",
      text: "Part of the YTL AI Labs team building ILMU, Malaysia's own large language model. Programme management across research, engineering, and deployment workstreams.",
      tag: "NOW",
    },
    {
      title: "Frog VLE at national scale",
      text: "Managed continuous-improvement programmes for a virtual learning environment serving millions of students across Malaysia.",
      tag: "EDTECH",
    },
    {
      title: "Automation as a habit",
      text: "Automated user-testing flows, feedback triage, and customer data analysis — because a process you run twice by hand is a process you should have scripted.",
      tag: "OPS",
    },
    {
      title: "10+ ERP deliveries",
      text: "Led ERP software projects end-to-end at Onnet — conception to go-live — while doubling as marketing lead for two SaaS products.",
      tag: "DELIVERY",
    },
  ],
  /* Gantt timeline — start/end are decimal years; end: null = present */
  career: [
    {
      role: "Programme Manager, AI",
      org: "YTL AI Labs",
      start: 2024.0, end: null,
      note: "Promoted; FrogAsia became YTL AI Labs. Building ILMU, Malaysia's own AI.",
    },
    {
      role: "Project Management Lead",
      org: "FrogAsia",
      start: 2022.45, end: 2024.0,
      note: "PM frameworks across streams · Frog VLE (millions of users) · automated user testing · Teach for Malaysia volunteer.",
    },
    {
      role: "Senior Project Manager",
      org: "Onnet Sdn Bhd",
      start: 2018.25, end: 2022.45,
      note: "10+ ERP projects · marketing lead for 2 SaaS products · led devs, BAs & support · sales & requirements on high-value leads.",
    },
    {
      role: "Chief Technology Officer",
      org: "iKitch Sdn Bhd",
      start: 2016.45, end: 2017.2,
      note: "Online marketplace · supply-chain ERP · directed 2 e-commerce builds · IT policy.",
    },
  ],
  skills: [
    { group: "Programme & Delivery", items: ["Programme management", "PMP certified", "Frameworks & PMO", "Stakeholder wrangling", "Odoo ERP Professional"] },
    { group: "AI & Data", items: ["LangChain", "Flowise", "LLM programme delivery", "Power BI", "Google Analytics", "SQL"] },
    { group: "Hands-on Technical", items: ["Python", "React JS", "CSS", "C++", "JSON", "Process automation"] },
    { group: "Creative Tooling", items: ["Photoshop", "Illustrator", "After Effects", "Premiere"] },
  ],
  education: {
    degree: "B.Sc. Information Technology Management",
    school: "Multimedia University, Melaka",
  },
  languages: ["Arabic (native)", "English (excellent)", "Bahasa Melayu (learning)"],
};

/* ---------- ARTS SIDE ---------- */

const ARTS = {
  heroTitle: "House lights down.",
  heroSub:
    "Writer, director, actor. 25+ productions, 20+ scripts, 5 in the director's chair, and one Viking musical he will absolutely bring up.",
  stats: [
    { n: "25+", label: "productions" },
    { n: "20+", label: "plays written" },
    { n: "5", label: "shows directed" },
    { n: "🏆", label: "Best Script · Short+Sweet 2019" },
  ],
  /* Shows are rendered in this order — most prominent first.
     img: drop a file at assets/img/shows/<id>.jpg and it appears. */
  shows: [
    {
      id: "forkbeard",
      featured: true,
      title: "Forkbeard: A Viking Musical Odyssey",
      role: "Director",
      dates: "Oct 2023",
      venue: "The Kuala Lumpur Performing Arts Centre (klpac)",
      company: "Forkbeard Musical Productions",
      synopsis:
        "Year 1000 AD. The Vikings' old ways are threatened by winds of change from the South, as Forkbeard of Denmark plots to destroy Olav of Norway — once his most trusted brother-in-arms. Sword fights, warships, witches, and an original score, told by an all-Malaysian cast of 21. Based on true events that changed the course of European history.",
      link: "https://www.cloudjoi.com/shows/forkbeard-a-viking-musical-odyssey",
      badge: "THE BIG ONE",
    },
    {
      id: "us",
      title: "US: A Journey of Love, Loss & Belonging",
      role: "Actor",
      dates: "Jun & Jul 2025 · two runs",
      venue: "klpac",
      synopsis:
        "Mark and Anna — two fiercely independent souls — fall into an unexpected romance that begins as fiery chemistry and unravels into passion, vulnerability, and self-discovery. What it means to love deeply, lose bravely, and find home.",
      link: "https://www.cloudjoi.com/shows/us-a-journey-of-love-loss",
    },
    {
      id: "twisted",
      title: "TWISTED: A Different Kind of Fairy Tale",
      role: "Actor",
      dates: "Jul 2024",
      venue: "Pentas 2, klpac",
      company: "Big Nose Productions",
      synopsis:
        "Gone are the days of princesses waiting helplessly for knights in shining armour. Classic fairy-tale characters, rewritten as independent leads and woven into one new plot.",
      link: "https://www.cloudjoi.com/shows/twisted-a-different-kind-of-fairy-tale",
    },
    {
      id: "his-story",
      title: "His Story",
      role: "Actor & Writer — “I Got Busy”",
      dates: "Feb 2023",
      venue: "klpac",
      company: "The Actors Studio Seni Teater Rakyat × Big Nose Productions",
      synopsis:
        "Eight monologues by young writers on what it is to be him. Karam wrote and performed “I Got Busy” — one of the eight.",
      link: "https://www.cloudjoi.com/shows/his-story",
    },
    {
      id: "epic-game-show",
      title: "The Epic Game Show with Nuha & Karam",
      role: "Co-creator & Performer",
      dates: "Nov 2025",
      venue: "BoboKL, Kuala Lumpur",
      synopsis:
        "A stand-up comedian and an actor walk into a jazz club — and compete in singing, dancing, and jokes to prove which profession is the Real Funny Business. Two hours of comedy, zero dignity spared.",
      link: "https://www.cloudjoi.com/shows/4725-the-epic-game-show-with-nuha-and-karam",
      badge: "COMEDY",
    },
    {
      id: "short-sweet",
      title: "Short+Sweet Theatre Penang 2021",
      role: "Writer & Director",
      dates: "Dec 2021",
      venue: "Penang",
      synopsis:
        "The world's biggest little-play festival. Karam wrote and directed for the 2021 edition — two years after taking Best Script at Short+Sweet 2019.",
    },
    {
      id: "once-upon-a-time",
      title: "Once Upon A Time (Parts 2–5)",
      role: "Actor",
      dates: "2021 – 2022",
      venue: "Streaming series",
      synopsis:
        "A four-part serialized theatre production performed across 2021–2022 — one story, told in instalments.",
    },
    {
      id: "love-in-georgetown",
      title: "Love in Georgetown City",
      role: "Actor",
      dates: "Dec 2020",
      venue: "George Town, Penang",
      synopsis: "A love letter to Penang's capital, performed in it.",
    },
    {
      id: "tales-from-the-scars",
      title: "Tales from the Scars",
      role: "Actor",
      dates: "Dec 2020",
      venue: "Penang",
      synopsis: "Stories that leave marks — an ensemble piece from the Penang stage.",
    },
  ],
  /* Voiceover & screen — add items as {title, note, src (mp3/video)} */
  voiceover: {
    intro:
      "The voice behind ads and narrations. Samples on their way — this shelf is being stocked.",
    items: [],
  },
  screen: {
    intro:
      "Occasionally on your screen selling you things convincingly. Ad reel coming soon.",
    items: [],
  },
  design: {
    intro:
      "Every show needs a poster, and Karam designs his own — the entire Forkbeard campaign identity included. Photoshop, Illustrator, After Effects: same hands, different stage.",
    items: [], // {img: "assets/img/design/xxx.jpg", caption: ""}
  },
};
