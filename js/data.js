/* ============================================================
   ALL SITE CONTENT LIVES HERE.
   Edit this file to update the website — no other file needed
   for day-to-day content changes.
   ============================================================ */

const PROFILE = {
  name: "Karam Tabba",
  tagline: "I run programmes by day. I appear in them by night.",
  email: "Karamtabba@gmail.com",
  linkedin: "https://www.linkedin.com/in/karam-altabba/",
  github: "https://github.com/KaramTab",
  instagram: "https://www.instagram.com/karamtabba/",
  cloudjoi: "https://www.cloudjoi.com/profiles/116861",
  fiverr: "https://www.fiverr.com/users/karamtabba",
  youtube: "https://www.youtube.com/user/karamtabba",
  location: "Kuala Lumpur, Malaysia",
  born: "1994-10-11", // used to auto-compute age on the comp card
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
    "> shipped_recently",
    "Ryt AI — a bank you can talk to (1.2M users)",
  ],
  summary:
    "Ten years of turning ambitious, messy, cross-functional work into shipped products — from ERP rollouts and a national education platform to a bank you can talk to. I'm the person who builds the framework, automates the boring parts, and keeps twenty workstreams honest.",
  /* Each highlight: short bullets on the card; clicking opens a modal
     with `story` paragraphs + `wins` achievement list. */
  highlights: [
    {
      title: "ILMU — Malaysia's AI",
      tag: "AI",
      bullets: [
        "Malaysia's own sovereign, multimodal AI model",
        "Programme management across research, engineering & deployment",
        "Outperforms frontier models on the Malay MMLU benchmark",
      ],
      story: [
        "ILMU (Intelek Luhur Malaysia Untukmu) is Malaysia's own AI model — built entirely in Malaysia by YTL AI Labs in collaboration with Universiti Malaya. It handles text, voice, and images, and it's hosted, managed, and governed in Malaysia with data protected under the PDPA.",
        "My job is programme management across the workstreams that make a frontier-model effort actually ship: research, engineering, deployment, and the products built on top of it.",
      ],
      wins: [
        "Outperforms all frontier models in Bahasa Melayu understanding (Malay MMLU benchmark)",
        "Powers products used by millions of Malaysians — Ryt AI and ILMUchat below",
      ],
      links: [{ label: "ytlailabs.com", href: "https://www.ytlailabs.com/" }],
    },
    {
      title: "Ryt AI — banking in plain language",
      tag: "FINTECH",
      bullets: [
        "Project-managed implementation → launch → live support",
        "1.2M users in 7 months — Malaysia's fastest-growing digital bank",
        "🏆 Best AI-Powered Customer Experience, Asian Banker 2026",
      ],
      story: [
        "Ryt Bank is Malaysia's next-generation digital bank (YTL × Sea Ltd), and Ryt AI is the ILMU-powered assistant at its heart. Customers transfer money, pay and split bills, and get financial guidance by simply asking in natural language — the AI does the banking.",
        "I project-managed Ryt AI from implementation through launch and into live support — the full lifecycle of putting a language model in front of 1.2 million banking customers, where mistakes aren't an option.",
      ],
      wins: [
        "1.2 million users within ~7 months of the August 2025 launch — Malaysia's fastest-growing digital bank",
        "25M+ transactions processed; monthly volumes grew over 35×",
        "Nearly half of all users bank through the AI — adoption across every age group, including 50+",
        "Best AI-Powered Customer Experience & Engagement Initiative in Malaysia — The Asian Banker Malaysia Awards 2026",
      ],
      links: [
        { label: "App Store", href: "https://apps.apple.com/my/app/ryt-bank-ai-powered-bank/id6480042570" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=my.rytbank.app&hl=en-US" },
      ],
    },
    {
      title: "ILMUchat — the AI that speaks Malaysian",
      tag: "AI",
      bullets: [
        "Malaysia's first multimodal AI assistant",
        "Fluent in Bahasa Melayu, Manglish & local dialects",
        "15,000 users and climbing since launch",
      ],
      story: [
        "ILMUchat is the consumer face of ILMU — Malaysia's first AI assistant that genuinely speaks Malaysian, from formal Bahasa Melayu to Manglish to dialects like Kelate. Text, voice, and images, with data kept in Malaysia.",
        "Freshly launched and growing — 15,000 users so far.",
      ],
      wins: [
        "First AI assistant built for how Malaysians actually talk",
        "15k users within weeks of launch",
      ],
      links: [
        { label: "ilmu.ai", href: "https://www.ilmu.ai/" },
        { label: "App Store", href: "https://apps.apple.com/my/app/ilmuchat/id6748936268" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.ytlailabs.ilmu.chat" },
      ],
    },
    {
      title: "Frog VLE & Launchpad — edtech at national scale",
      tag: "EDTECH",
      bullets: [
        "Ran the national Virtual Learning Environment ecosystem",
        "10M+ students nationwide",
        "Launchpad app: 1M+ downloads on Android & iOS",
      ],
      story: [
        "At FrogAsia, we ran the national Virtual Learning Environment ecosystem — the digital classroom for over 10 million students across Malaysia. I managed continuous-improvement programmes and automated the user-testing and feedback pipelines that kept it evolving.",
        "We also built Launchpad, a handheld learning-assistant app that put the VLE in students' pockets — over a million downloads across Android and iOS.",
      ],
      wins: [
        "10M+ students served nationwide",
        "Launchpad: 1M+ downloads across both app stores",
        "Volunteered with Teach for Malaysia to teach low-income communities in KL",
      ],
      links: [
        { label: "App Store", href: "https://apps.apple.com/my/app/launchpad-frogplay/id1441749509" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.frogeducationsdnbhd.play&hl=en" },
      ],
    },
    {
      title: "Automation as a habit",
      tag: "OPS",
      bullets: [
        "Automated user-testing flows & feedback triage",
        "Automated customer data collection & analysis",
        "Rule: run it twice by hand → script it",
      ],
      story: [
        "Across every role, the pattern repeats: find the process everyone tolerates doing manually, and automate it. User-testing flows, feedback collection and prioritisation, customer acquisition and retention analytics — all turned from chores into pipelines.",
      ],
    },
    {
      title: "10+ ERP deliveries",
      tag: "DELIVERY",
      bullets: [
        "10+ ERP projects, conception to go-live",
        "Marketing lead for 2 SaaS products",
        "Led developers, BAs & support staff",
      ],
      story: [
        "At Onnet, I managed over ten ERP implementations end-to-end while doubling as marketing lead for two SaaS products — building their initial brands and taking them to market. I also designed and ran application training for staff and customers, and chaired sales and requirements discussions on high-value leads.",
      ],
    },
  ],
  /* Gantt timeline — start/end are decimal years; end: null = present.
     `note` = short hover text on the site Gantt chart.
     `period` + `resumePoints` = what appears on the printable PDF résumé.
     Add a new role here and BOTH the site and the résumé update. */
  career: [
    {
      role: "Programme Manager, AI",
      org: "YTL AI Labs",
      start: 2024.0, end: null,
      period: "2024 – Present",
      note: "Promoted; FrogAsia became YTL AI Labs. Building ILMU, Malaysia's own AI · Ryt AI: implementation → launch → support · ILMUchat launch.",
      resumePoints: [
        "Programme management for ILMU — Malaysia's own sovereign, multimodal AI model (YTL AI Labs × Universiti Malaya) — across research, engineering, and deployment workstreams.",
        "Project-managed Ryt AI from implementation through launch to live support: the AI assistant inside Ryt Bank, Malaysia's fastest-growing digital bank — 1.2M users and 25M+ transactions within 7 months of launch; nearly half of all users bank through the AI.",
        "Winner: Best AI-Powered Customer Experience & Engagement Initiative in Malaysia — The Asian Banker Malaysia Awards 2026.",
        "Launched ILMUchat, Malaysia's first multimodal AI assistant fluent in Bahasa Melayu, Manglish, and local dialects — 15,000 users and growing.",
      ],
    },
    {
      role: "Project Management Lead",
      org: "FrogAsia Sdn Bhd",
      start: 2022.45, end: 2024.0,
      period: "Jun 2022 – 2024",
      note: "PM frameworks across streams · national Frog VLE ecosystem (10M+ students) · Launchpad app (1M+ downloads) · Teach for Malaysia volunteer.",
      resumePoints: [
        "Ran the national Virtual Learning Environment (Frog VLE) ecosystem serving over 10 million students nationwide.",
        "Delivered Launchpad, a handheld learning-assistant app — 1M+ downloads across Android and iOS.",
        "Mapped and enhanced project management frameworks across multiple workstreams.",
        "Automated user-testing flows and feedback collection & prioritisation.",
        "Volunteered with Teach for Malaysia (partner) to teach low-income communities within KL.",
      ],
    },
    {
      role: "Senior Project Manager",
      org: "Onnet Sdn Bhd",
      start: 2018.25, end: 2022.45,
      period: "Apr 2018 – Jun 2022",
      note: "10+ ERP projects · marketing lead for 2 SaaS products · led devs, BAs & support · sales & requirements on high-value leads.",
      resumePoints: [
        "Managed 10+ ERP software projects from conception to completion.",
        "Marketing lead for 2 SaaS products — created the initial brands and introduced the products to market.",
        "Led a team of developers, business analysts, and support staff.",
        "Designed and conducted application training courses for internal staff and customers.",
        "Chaired sales discussions and requirements gathering on high-value leads.",
        "Automated data collection and analysis for customer acquisition and retention.",
      ],
    },
    {
      role: "Chief Technology Officer",
      org: "iKitch Sdn Bhd",
      start: 2016.45, end: 2017.2,
      period: "Jun 2016 – Mar 2017",
      note: "Online marketplace · supply-chain ERP · directed 2 e-commerce builds · IT policy.",
      resumePoints: [
        "Implemented and supported an online marketplace and a supply-chain ERP solution.",
        "Project director for 2 e-commerce website builds; project lead for online branding campaigns.",
        "Established and enforced IT policies.",
      ],
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
  certifications: ["Project Management Professional (PMP)", "Odoo ERP Professional"],
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
  /* Comp card — shown from the "Comp Card" button in the header.
     Age is computed automatically from PROFILE.born.
     Headshots: drop files at these paths and they appear. */
  compCard: {
    subtitle: "Actor · Singer · Voice Artist",
    headshots: [
      "assets/img/comp/headshot-1.jpg",
      "assets/img/comp/headshot-2.jpg",
      "assets/img/comp/headshot-3.jpg",
    ],
    stats: [
      ["Height", "184 cm"],
      ["Vocal Range", "Bass – Tenor"],
      ["Jacket Size", "Medium"],
      ["Ethnicity", "Caucasian"],
      ["Languages", "Arabic (native) · English · Bahasa Melayu"],
      ["Base", "Kuala Lumpur, Malaysia"],
    ],
  },
  /* Shows are rendered in this order — most prominent first.
     Card image: assets/img/shows/<id>.jpg
     Modal slider: add image paths to `gallery` (falls back to the card image).
     `more`: extra paragraphs shown only in the modal. */
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
      gallery: [],
      more: [
        "Karam directed the production — 21 performers, sword choreography, and an original score — alongside an award-winning artistic team: musical direction by Dominic Lucien Luk, choreography by Aida Redza, book and music by Nancy Jenster.",
        "He also designed the show's entire marketing identity: posters, socials, the lot.",
      ],
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
      gallery: [],
      more: [
        "Staged at klpac across two runs in June and July 2025.",
      ],
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
      gallery: [],
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
      gallery: [],
      more: [
        "Presented by The Actors Studio Seni Teater Rakyat and klpac in collaboration with Big Nose Productions. Karam pulled double duty: playwright of one monologue and performer in the ensemble.",
      ],
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
      gallery: [],
      more: [
        "Co-created with stand-up comedian Nuha — a two-hour live game show at BoboKL, KL's intimate jazz-club-slash-theatre.",
      ],
    },
    {
      id: "short-sweet",
      title: "Short+Sweet Theatre Penang 2021",
      role: "Writer & Director",
      dates: "Dec 2021",
      venue: "Penang",
      synopsis:
        "The world's biggest little-play festival. Karam wrote and directed for the 2021 edition — two years after taking Best Script at Short+Sweet 2019.",
      gallery: [],
    },
    {
      id: "once-upon-a-time",
      title: "Once Upon A Time (Parts 2–5)",
      role: "Actor",
      dates: "2021 – 2022",
      venue: "Streaming series",
      synopsis:
        "A four-part serialized theatre production performed across 2021–2022 — one story, told in instalments.",
      gallery: [],
    },
    {
      id: "love-in-georgetown",
      title: "Love in Georgetown City",
      role: "Actor",
      dates: "Dec 2020",
      venue: "George Town, Penang",
      synopsis: "A love letter to Penang's capital, performed in it.",
      gallery: [],
    },
    {
      id: "tales-from-the-scars",
      title: "Tales from the Scars",
      role: "Actor",
      dates: "Dec 2020",
      venue: "Penang",
      synopsis: "Stories that leave marks — an ensemble piece from the Penang stage.",
      gallery: [],
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
