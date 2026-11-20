/* ============================================================
   ALL SITE CONTENT LIVES HERE.
   Edit this file to update the website; no other file is needed
   for day-to-day content changes.

   Voice: first person, plain, a bit dry. Say the specific thing.
   British spelling (programme, organised). Go easy on the dashes.
   ============================================================ */

const PROFILE = {
  name: "Karam Tabba", // creative name (landing page, arts side)
  proName: "Karam Altabaa", // passport name (tech side, résumé)
  tagline: "I run programmes by day. I appear in them by night.",
  email: "karamtabba@gmail.com",
  linkedin: "https://www.linkedin.com/in/karam-altabba/",
  github: "https://github.com/KaramTab",
  instagram: "https://www.instagram.com/karamtabba/",
  cloudjoi: "https://www.cloudjoi.com/profiles/116861",
  fiverr: "https://www.fiverr.com/users/karamtabba",
  youtube: "https://www.youtube.com/user/karamtabba",
  location: "Kuala Lumpur, Malaysia",
  born: "1994-10-11", // used to auto-compute age on the comp card
};

/* Both careers on one calendar (landing page). One row per year;
   `day` = the programme-manager side, `night` = the stage side. */
const CALENDAR = [
  { y: 2016, day: ["Chief Technology Officer, iKitch"], night: [] },
  { y: 2018, day: ["Senior Project Manager, Onnet. 10+ ERP projects and 2 SaaS launches"], night: [] },
  { y: 2019, day: [], night: ["Best Script, Short+Sweet"] },
  { y: 2020, day: [], night: ["The Ice Kacang Project, the first live show back after lockdown", "One Minute To Midnight", "Love in Georgetown City and Tales from the Scars"] },
  { y: 2021, day: [], night: ["Wrote and directed at Short+Sweet Penang", "Once Upon A Time, Parts 2 to 5"] },
  { y: 2022, day: ["Project Management Lead, FrogAsia. Frog VLE and Launchpad"], night: [] },
  { y: 2023, day: [], night: ["His Story", "Directed Forkbeard at klpac"] },
  { y: 2024, day: ["Programme Manager, AI, at YTL AI Labs"], night: ["TWISTED"] },
  { y: 2025, day: ["ILMU and Ryt AI go live"], night: ["US", "The Epic Game Show"] },
  { y: 2026, day: ["Still shipping"], night: ["Co-wrote and directed The Relationsh*t Chronicles. Sold out", "Sgt. John in Tears Under The Rising Sun, Melaka"] },
];

/* ---------- TECH SIDE ---------- */

const TECH = {
  role: "Programme Manager · AI",
  org: "YTL AI Labs",
  kicker: "Programme Manager, AI · YTL AI Labs · Kuala Lumpur",
  headline: "I make sure the AI actually launches.",
  lede: [
    "I'm a programme manager at YTL AI Labs. I work on ILMU, Malaysia's own AI model, and on the products built on top of it: Ryt AI inside Ryt Bank, and ILMUchat.",
    "Before that came ERP rollouts, an online marketplace and a national learning platform. The job underneath is always the same: somebody has to own the plan, and I like being that somebody.",
  ],
  /* the status report beside the headline. The date and the RAG line are worked out live. */
  report: {
    shipped: [
      "ILMU launched to Malaysia with the PMX, Aug 2025",
      "Ryt AI: 1.2M users, 25M+ transactions",
      "ILMUchat: 15,000 users in the first weeks",
      "Frog VLE for 10M students, Launchpad with 1M+ downloads",
    ],
    risks: "Also writes and directs plays. The calendar is contested.",
    asks: "A hard problem, or a coffee.",
  },
  now: "ILMU and ILMUchat are in flight. Ryt AI is live and supported.",
  /* Each highlight: short bullets on the ticket; clicking opens a modal
     with `story` paragraphs + `wins` achievement list.
     Keep the array order: the critical-path diagram (NET in main.js) refers to tickets by index. */
  highlights: [
    {
      title: "ILMU: Malaysia's own AI model",
      lane: "inflight",
      tag: "AI",
      bullets: [
        "Sovereign and multimodal: text, voice and images, hosted in Malaysia",
        "I run the programme side across research, engineering and deployment",
        "Beats frontier models on the Malay MMLU benchmark",
      ],
      story: [
        "ILMU (Intelek Luhur Malaysia Untukmu) is Malaysia's own AI model, built entirely in Malaysia by YTL AI Labs with Universiti Malaya. It handles text, voice and images, and it's hosted, managed and governed here, with data protected under the PDPA.",
        "My part is the programme management: keeping research, engineering, deployment and the products on top of it moving in the same direction.",
      ],
      wins: [
        "Beats all frontier models at understanding Bahasa Melayu (Malay MMLU benchmark)",
        "Powers products used by millions of Malaysians, including Ryt AI and ILMUchat",
      ],
      links: [{ label: "ytlailabs.com", href: "https://www.ytlailabs.com/" }],
    },
    {
      title: "Ryt AI: banking in plain language",
      lane: "shipped",
      tag: "FINTECH",
      bullets: [
        "I project-managed it from implementation to launch to live support",
        "1.2M users in about 7 months, Malaysia's fastest-growing digital bank",
        "Ryt Bank won Best AI-Powered CX at The Asian Banker Malaysia Awards 2026, for Ryt AI",
      ],
      story: [
        "Ryt Bank is Malaysia's digital bank (YTL × Sea Ltd), and Ryt AI is the ILMU-powered assistant at its centre. You transfer money, pay and split bills, and ask for financial guidance in plain language. The AI does the banking.",
        "I project-managed it from implementation through launch and into live support. That's the full lifecycle of putting a language model in front of 1.2 million banking customers, where a wrong answer costs real money.",
      ],
      wins: [
        "1.2 million users within about 7 months of the August 2025 launch",
        "25M+ transactions processed; monthly volumes up over 35×",
        "Nearly half of all users bank through the AI, across every age group, including 50+",
        "Ryt Bank won Best AI-Powered Customer Experience & Engagement Initiative in Malaysia at The Asian Banker Malaysia Awards 2026, for Ryt AI",
      ],
      links: [
        { label: "App Store", href: "https://apps.apple.com/my/app/ryt-bank-ai-powered-bank/id6480042570" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=my.rytbank.app&hl=en-US" },
      ],
    },
    {
      title: "ILMUchat: the AI that speaks Malaysian",
      lane: "inflight",
      tag: "AI",
      bullets: [
        "The consumer app for ILMU, in Bahasa Melayu, Manglish and local dialects",
        "Text, voice and images, with data kept in Malaysia",
        "15,000 users in the first weeks",
      ],
      story: [
        "ILMUchat is the consumer face of ILMU: an AI assistant that speaks the way Malaysians do, from formal Bahasa Melayu to Manglish to dialects like Kelate. Text, voice and images, with data kept in Malaysia.",
        "It launched recently and the numbers are still moving. 15,000 users in the first weeks.",
      ],
      wins: [
        "Built for how Malaysians actually talk",
        "15k users within weeks of launch",
      ],
      links: [
        { label: "ilmu.ai", href: "https://www.ilmu.ai/" },
        { label: "App Store", href: "https://apps.apple.com/my/app/ilmuchat/id6748936268" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.ytlailabs.ilmu.chat" },
      ],
    },
    {
      title: "Frog VLE and Launchpad",
      lane: "shipped",
      tag: "EDTECH",
      bullets: [
        "Project management lead on the national Virtual Learning Environment",
        "Serves 10M+ students nationwide",
        "Launchpad app: 1M+ downloads on Android and iOS",
      ],
      story: [
        "At FrogAsia I led project management for Frog VLE, the national Virtual Learning Environment: the digital classroom for over 10 million students across Malaysia. I ran continuous-improvement programmes and automated the user-testing and feedback pipelines that kept it evolving.",
        "We also built Launchpad, a handheld learning-assistant app that put the VLE in students' pockets. Over a million downloads across Android and iOS.",
      ],
      wins: [
        "10M+ students served nationwide",
        "Launchpad: 1M+ downloads across both app stores",
        "Volunteered with Teach for Malaysia, teaching low-income communities in KL",
      ],
      links: [
        { label: "App Store", href: "https://apps.apple.com/my/app/launchpad-frogplay/id1441749509" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.frogeducationsdnbhd.play&hl=en" },
      ],
    },
    {
      title: "Automation as a habit",
      lane: "practice",
      tag: "OPS",
      bullets: [
        "Automated user-testing flows and feedback triage",
        "Automated customer data collection and analysis",
        "House rule: do it by hand twice, then script it",
      ],
      story: [
        "Every role has had the same pattern: find the process everyone tolerates doing by hand, then automate it. User-testing flows, feedback prioritisation, customer acquisition and retention analytics. All of it went from chore to pipeline.",
      ],
    },
    {
      title: "10+ ERP deliveries",
      lane: "practice",
      tag: "DELIVERY",
      bullets: [
        "10+ ERP projects, conception to go-live",
        "Marketing lead for 2 SaaS products",
        "Led developers, BAs and support staff",
      ],
      story: [
        "At Onnet I managed over ten ERP implementations end to end, and doubled as marketing lead for two SaaS products: building their first brands and taking them to market. I also designed and ran application training for staff and customers, and chaired sales and requirements discussions on high-value leads.",
      ],
    },
  ],
  /* Gantt timeline: start/end are decimal years; end: null = present.
     `note` = short hover text on the site Gantt chart.
     `period` + `resumePoints` = what appears on the printable PDF résumé.
     Add a new role here and BOTH the site and the résumé update. */
  career: [
    {
      role: "Programme Manager, AI",
      resumeRole: "Programme Manager",
      org: "YTL AI Labs",
      start: 2024.0, end: null,
      period: "2024 – Present",
      milestones: [{ at: 2025.62, label: "ILMU and Ryt AI launch · Aug 2025" }],
      note: "Promoted when FrogAsia became YTL AI Labs. ILMU, Ryt AI from implementation to live support, ILMUchat.",
      resumeBlurb: "Delivery, commercial operations and PMO for AI products built on ILMU, Malaysia’s sovereign LLM.",
      resumePoints: [
        "Managed Ryt AI from implementation to live support: the first regulator-approved deployment of conversational AI as a bank’s primary interface (EMNLP 2025), used 10M times in Ryt Bank’s first year.",
        "Programme-managed Sofia, Yes’s live agentic assistant (SIM purchase with eKYC, top-ups, bills, live-agent handover; English, BM, Chinese) across three delivery teams; own post-launch change requests.",
        "Defined and automated billing processes for key enterprise and government clients, including Ryt Bank, Yes 5G and MyDIGITAL for AI untuk Rakyat.",
        "Lead government and enterprise tenders in domains such as financial regulation and power, covering requirements, compliance matrices, costing and security baselines.",
        "Launched ILMUchat (15,000 users), built for code-switching across Malay, English, Mandarin and Tamil; run the ILMUchat Enterprise rollout to YTL Power and YTL Construction.",
        "Built the PMO layer: a Jira-fed portfolio timeline and sprint roadmap for leadership, and a pipeline tracker for the Head of Commercial.",
      ],
    },
    {
      role: "Project Management Lead",
      org: "FrogAsia Sdn Bhd",
      start: 2022.45, end: 2024.0,
      period: "Jun 2022 – 2024",
      note: "PM frameworks across workstreams, the national Frog VLE (10M+ students), Launchpad (1M+ downloads), Teach for Malaysia volunteering.",
      resumePoints: [
        "Led Frog VLE, the national learning platform serving 10M+ students, through its final phase.",
        "Delivered Launchpad, a handheld learning-assistant app with 1M+ downloads on Android and iOS.",
        "Mapped and improved PM frameworks across workstreams; automated user testing and feedback triage.",
      ],
    },
    {
      role: "Senior Project Manager",
      org: "Onnet Sdn Bhd",
      start: 2018.25, end: 2022.45,
      period: "Apr 2018 – Jun 2022",
      note: "10+ ERP projects, marketing lead for 2 SaaS products, led developers, BAs and support, sales and requirements on high-value leads.",
      /* TODO: name the Odoo modules/industries, team size, the 2 SaaS products,
         and any sales-win figures; they tie straight into the commercial story. */
      resumePoints: [
        "Managed 10+ ERP implementations and legacy migrations, leading developers, BAs and support staff.",
        "Led sales discussions and requirements gathering on high-value leads; ran staff and customer training.",
        "Marketing lead for 2 SaaS products, from brand to launch; automated acquisition and retention analytics.",
      ],
    },
    {
      role: "Chief Technology Officer",
      org: "iKitch Sdn Bhd",
      start: 2016.45, end: 2017.2,
      period: "Jun 2016 – Mar 2017",
      note: "Online marketplace, supply-chain ERP, directed 2 e-commerce builds, wrote the IT policy.",
      resumePoints: [
        "Implemented and supported an online marketplace and a supply-chain ERP; set IT policies.",
        "Project director for 2 e-commerce website builds; project lead for online branding campaigns.",
      ],
    },
  ],
  /* the skills list on the site is allowed to be less formal than the résumé's */
  skills: [
    { group: "Run the programme", items: ["Programme management", "PMO and frameworks", "Governance and reporting", "Stakeholder wrangling", "UAT"] },
    { group: "Keep it commercial", items: ["Pricing and commercial models", "Tender and RFP response", "Compliance matrices", "Costing"] },
    { group: "Know the AI", items: ["LLM programme delivery", "RAG evaluation", "LangChain", "Flowise", "Power BI", "SQL", "Google Analytics"] },
    { group: "Build small things", items: ["Python", "React", "HTML and CSS", "Process automation", "Odoo", "Jira", "Excel"] },
  ],
  education: {
    degree: "B.Sc. Information Technology Management",
    school: "Multimedia University, Melaka",
  },
  certifications: ["Project Management Professional (PMP)", "Odoo ERP Professional"],
  languages: ["Arabic (native)", "English (excellent)", "Bahasa Melayu (learning)"],
};

/* ---------- RÉSUMÉ-ONLY CONTENT ----------
   Everything the printable résumé needs that the site doesn't share.
   Roles, bullets and periods come from TECH.career above. */

const RESUME = {
  /* Shown in the contact line only when filled in. Leave empty if this repo
     goes public: add it locally before exporting the PDF, don't commit it. */
  phone: "",
  headline: "Programme Manager · AI Delivery & Commercial Operations",
  summary:
    "Ten years turning messy, cross-functional work into shipped products — ERP rollouts, a national learning platform, and now AI at YTL AI Labs for banking, telco, energy and government. I run delivery and commercials, build the framework, automate the boring parts, and hand over something that runs. PMP certified.",
  skills: [
    { group: "Delivery", items: ["Programme management", "PMO set-up", "Governance & reporting", "Stakeholder management"] },
    { group: "Commercial", items: ["Pricing & commercial models", "Tender & RFP response", "Compliance matrices", "Costing"] },
    { group: "AI & data", items: ["LLM programme delivery", "RAG evaluation", "LangChain", "Flowise", "Power BI", "SQL", "Google Analytics"] },
    { group: "Tools", items: ["Jira", "Odoo", "Excel", "Python", "React", "HTML/CSS", "Adobe CC"] },
  ],
  languages: ["Arabic (native)", "English (fluent)", "Bahasa Melayu (learning)"],
  volunteering: "Teach For Malaysia — taught in low-income communities in Kuala Lumpur",
};

/* ---------- ARTS SIDE ---------- */

const ARTS = {
  heroKicker: "Karam Tabba · writer, director, actor",
  heroTitle: "House lights down.",
  heroSub:
    "I write plays, direct them, and act in other people's. Twenty-five-odd productions so far, one of them with Vikings, which I will bring up.",
  stats: [
    { n: "25+", label: "productions" },
    { n: "20+", label: "plays written" },
    { n: "5", label: "shows directed" },
    { n: "2019", label: "Best Script, Short+Sweet" },
  ],
  /* Update this line whenever something opens or closes. */
  now: "Last on stage: Tears Under The Rising Sun, an original musical in wartime Melaka, at JKKN on 14 and 15 November 2026. I played Sgt. John.",
  /* Comp card: shown from the "Comp Card" button in the header.
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
  /* Shows are rendered in this order, most prominent first (the first one is the big one).
     Poster: drop assets/img/shows/<id>.jpg (portrait, about 2:3). Until then a typeset
     stand-in is drawn (see POSTER_ART in js/main.js).
     Modal slider: add image paths to `gallery` (falls back to the poster).
     `more`: extra paragraphs shown only in the modal. */
  shows: [
    {
      id: "forkbeard",
      tags: ["directed"],
      featured: true,
      title: "Forkbeard: A Viking Musical Odyssey",
      role: "Director",
      dates: "27–29 Oct 2023",
      venue: "Pentas 1, klpac",
      company: "Forkbeard Musical Productions",
      synopsis:
        "Year 1000 AD. The Vikings' old ways are threatened by winds of change from the South, as Forkbeard of Denmark plots to destroy Olav of Norway, once his most trusted brother-in-arms. Sword fights, warships, witches and an original score, told by an all-Malaysian cast of 21. Based on true events that changed the course of European history.",
      link: "https://www.cloudjoi.com/shows/forkbeard-a-viking-musical-odyssey",
      badge: "The Viking one",
      gallery: [],
      more: [
        "I directed it: 21 performers, sword choreography and an original score, alongside an award-winning artistic team. Written by Nancy P. Jenster, musical direction by Dominic Lucien Luk, dance direction by Aida Redza.",
        "I also designed the show's entire marketing identity: posters, socials, the lot.",
      ],
    },
    {
      id: "tears-under-the-rising-sun",
      tags: ["acted"],
      title: "Tears Under The Rising Sun",
      role: "Actor (Sgt. John)",
      dates: "14–15 Nov 2026",
      venue: "Panggung Seri, JKKN Melaka",
      company: "Krate Creative Space",
      poster: "assets/img/shows/tears-under-the-rising-sun.webp",
      synopsis:
        "An original musical set in Japanese-occupied Melaka, inspired by true events. A young Nyonya's sheltered world is shaken by a mysterious stranger seeking refuge. A story of love, sacrifice, survival and the choices we make in times of war.",
      link: "https://www.cloudjoi.com/shows/7355-tears-under-the-rising-sun",
      badge: "New",
      gallery: ["assets/img/shows/tears-under-the-rising-sun-sgt-john.webp"],
      more: [
        "I played Sgt. John. Written and directed by Shyre May for Krate Creative Space, with original songs, traditional instrumentation and Peranakan heritage at its heart, in collaboration with Persatuan Peranakan Cina Melaka.",
        "Two nights at Panggung Seri, JKKN Melaka, on 14 and 15 November 2026. Performed in English with Peranakan lingo, Bahasa Malaysia, Hokkien and a little Japanese. It's set during the Occupation, so the themes are dark and mature.",
      ],
    },
    {
      id: "relationshit-chronicles",
      tags: ["written", "directed"],
      title: "The Relationsh*t Chronicles: KL Edition",
      role: "Co-writer & Director",
      dates: "2–4 Oct 2026",
      venue: "Indicine, klpac",
      company: "Big Nose Productions",
      synopsis:
        "Ten performers, nine stories, one honest look at how relationships fall apart: the ghoster, the gaslighter, the ex who still owes you RM400 since Raya. Stand-up-style comedy for grown-ups.",
      link: "https://www.cloudjoi.com/shows/7121-the-relationsht-chronicles",
      badge: "Sold out",
      gallery: [],
      more: [
        "Co-written with Fa Abdul and directed by me. Produced by Esther Kuan. Four shows over the weekend of 2 to 4 October 2026, and every one sold out.",
        "The poster promised “a comedy theater show that's cheaper than couples therapy”. Mature audiences only: strong language and adult humour, about 80 minutes without an interval, in English with plenty of local flavour.",
      ],
    },
    {
      id: "us",
      tags: ["acted"],
      title: "US: A Journey of Love, Loss & Belonging",
      role: "Actor",
      dates: "Jun & Jul 2025 · two runs",
      venue: "Komtar, Penang, then klpac",
      synopsis:
        "Mark and Anna, two fiercely independent souls, fall into an unexpected romance that begins as fiery chemistry and unravels into passion, vulnerability and self-discovery. What it means to love deeply, lose bravely, and find home.",
      links: [
        { label: "Penang run", href: "https://www.cloudjoi.com/shows/3106-us-a-journey-of-love-loss-belonging" },
        { label: "KL run", href: "https://www.cloudjoi.com/shows/us-a-journey-of-love-loss" },
      ],
      gallery: [],
      more: [
        "Two runs: 27 to 29 June 2025 at Auditorium A, Komtar, Penang, then 17 to 20 July 2025 at Pentas 2, klpac, Kuala Lumpur.",
        "Crafted by Fa Abdul, with Lauren Tan and me on stage and a special appearance by Ivan Gabriel.",
      ],
    },
    {
      id: "twisted",
      tags: ["acted"],
      title: "TWISTED: A Different Kind of Fairy Tale",
      role: "Actor",
      dates: "18–21 Jul 2024",
      venue: "Pentas 2, klpac",
      company: "Big Nose Productions",
      synopsis:
        "Gone are the days of princesses waiting helplessly for knights in shining armour. Classic fairy-tale characters, rewritten as independent leads and woven into one new plot.",
      link: "https://www.cloudjoi.com/shows/twisted-a-different-kind-of-fairy-tale",
      gallery: [],
      more: [
        "Produced and directed by Fa Abdul, with artistic direction by Joe Hasham OAM. Presented by Big Nose Productions and klpac.",
      ],
    },
    {
      id: "his-story",
      tags: ["written", "acted"],
      title: "His Story",
      role: "Writer & Actor (wrote “I Got Busy”)",
      dates: "23–26 Feb 2023",
      venue: "Pentas 2, klpac",
      company: "The Actors Studio Seni Teater Rakyat × Big Nose Productions",
      synopsis:
        "Eight monologues by new male writers, from different backgrounds and age groups, on what it is to be him. I wrote “I Got Busy”, one of the eight, and performed another writer’s piece.",
      link: "https://www.cloudjoi.com/shows/his-story",
      gallery: [],
      more: [
        "The second half of a pair: “Her Story” (January) and “His Story” (February) began as an online playwriting project led by Fa Abdul during the pandemic, and were staged for the first time as twenty monologues in two instalments. Fa Abdul directed.",
        "I pulled double duty: wrote one monologue, performed another writer’s.",
      ],
    },
    {
      id: "epic-game-show",
      tags: ["written", "acted"],
      title: "The Epic Game Show with Nuha & Karam",
      role: "Co-creator & Performer",
      dates: "19 Nov 2025",
      venue: "BoboKL, Kuala Lumpur",
      synopsis:
        "A stand-up comedian and an actor walk into a jazz club and compete in singing, dancing and jokes to prove which profession is the Real Funny Business. Is it acting? Is it stand-up? Come and be the judge.",
      link: "https://www.cloudjoi.com/shows/4725-the-epic-game-show-with-nuha-and-karam",
      badge: "Comedy",
      gallery: [],
      more: [
        "Co-created with stand-up comedian Nuha: a live game show at BoboKL, KL's intimate jazz-club-slash-theatre. Presented by BoboKL.",
      ],
    },
    {
      id: "short-sweet",
      tags: ["written", "directed"],
      title: "Short+Sweet Theatre Penang 2021",
      role: "Writer & Director",
      dates: "10–11 Dec 2021",
      venue: "Stage 2, penangpac, Penang",
      poster: "assets/img/shows/short-sweet.webp",
      synopsis:
        "The world's biggest little-play festival. I wrote and directed for the 2021 edition, two years after taking Best Script at Short+Sweet 2019.",
      link: "https://www.cloudjoi.com/shows/short-sweet-theatre-penang-2021",
      gallery: [],
      more: [
        "Both nights sold out.",
      ],
    },
    {
      id: "once-upon-a-time",
      tags: ["acted"],
      title: "Once Upon A Time (Parts 2–5)",
      role: "Actor",
      dates: "Nov 2021 – Jun 2022",
      venue: "CloudTheatre On-Demand",
      poster: "assets/img/shows/once-upon-a-time.webp",
      synopsis:
        "Parts 2 to 5 of a five-part series of almost-forgotten Malaysian folklore, legends and tales, two stories to a part, written and directed by Fa Abdul and streamed on demand.",
      links: [
        { label: "Part 2", href: "https://www.cloudjoi.com/shows/once-upon-a-time-part-2" },
        { label: "Part 3", href: "https://www.cloudjoi.com/shows/once-upon-a-time-part-3" },
        { label: "Part 4", href: "https://www.cloudjoi.com/shows/once-upon-a-time-part-iv" },
        { label: "Part 5", href: "https://www.cloudjoi.com/shows/once-upon-a-time-part-5-tun-teja-tale-of-love" },
      ],
      gallery: [
        "assets/img/shows/once-upon-a-time-2.jpg",
        "assets/img/shows/once-upon-a-time-3.jpg",
        "assets/img/shows/once-upon-a-time-4.jpg",
        "assets/img/shows/once-upon-a-time-5.jpg",
      ],
      more: [
        "Part 2: The Curse of Mahsuri, and Raja Bersiong. Part 3: Bawang Putih Bawang Merah, and The Fairy Princess of Gunung Ledang. Part 4: The Adventures of Musang Berjanggut, and Sanggul Beracun. Part 5: Tun Teja, and Pak Belalang.",
        "The poster shown is Part 3's; each part had its own.",
      ],
    },
    {
      id: "love-in-georgetown",
      tags: ["acted"],
      title: "Love in Georgetown City",
      role: "Actor",
      dates: "Dec 2020",
      venue: "Online (CloudTheatre)",
      synopsis:
        "Fa Abdul's collection of ten raunchy, heart-warming and thought-provoking tales about love, sex and a hypocritical society.",
      link: "https://www.cloudjoi.com/shows/love-in-georgetown-city",
      gallery: [],
      more: [
        "Streamed online through CloudTheatre in December 2020. Adult themes.",
      ],
    },
    {
      id: "tales-from-the-scars",
      tags: ["acted"],
      title: "Tales from the Scars",
      role: "Actor",
      dates: "18–19 Dec 2020",
      venue: "Online (CloudTheatre)",
      synopsis:
        "A series of ten insightful monologues that make up one play, written and directed by Fa Abdul. Titles include My Beef with God, Brown Man in a Hood and Happily Unmarried.",
      link: "https://www.cloudjoi.com/shows/tales-from-the-scars",
      gallery: [],
    },
    {
      id: "ice-kacang-project",
      tags: ["acted"],
      title: "The Ice Kacang Project",
      role: "Actor",
      dates: "7–9 Aug 2020",
      venue: "Online, from penangpac",
      company: "Performing Arts Centre of Penang (penangpac)",
      synopsis:
        "Six comedies in 60 minutes, put together to celebrate penangpac reopening after more than three months shut by the Covid-19 lockdown. Billed as the first live theatre performance after the MCO, and it went out online.",
      link: "https://www.cloudjoi.com/shows/the-ice-kacang-project",
      gallery: [],
      more: [
        "Directed by Fa Abdul, with Chen and me on stage. Streamed live with English and Chinese subtitles.",
      ],
    },
    {
      id: "one-minute-to-midnight",
      tags: ["acted"],
      title: "One Minute To Midnight: An Eco-Musical for the Whole Family",
      role: "Actor",
      dates: "27–29 Nov 2020",
      venue: "Online (CloudTheatre)",
      synopsis:
        "While her friends are in class, Wanda the baby whale slips away for a pink jellyfish treat and ends up with a bad tummy ache. Washed up on the shore, she is found by Abbie and her friends, who set out to rescue her and land in the most dangerous adventure of their lives.",
      link: "https://www.cloudjoi.com/shows/omtm",
      gallery: [],
    },
  ],
  /* Voiceover & screen: add items as {title, note, src (mp3/video)} */
  voiceover: {
    intro:
      "The voice behind ads and narrations. The reel is still in the booth.",
    items: [],
  },
  screen: {
    intro:
      "Occasionally on your screen, selling you things convincingly. Ad reel to follow.",
    items: [],
  },
  design: {
    intro:
      "Every show needs a poster, and I design my own, the whole Forkbeard campaign included. Photoshop, Illustrator, After Effects: same hands, different stage.",
    items: [], // {img: "assets/img/design/xxx.jpg", caption: ""}
  },
};
