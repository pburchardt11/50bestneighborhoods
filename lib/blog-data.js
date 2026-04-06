// lib/blog-data.js
// Seed articles for the blog. Expand by appending entries; routes pick them up automatically.

export const POSTS = [
  {
    slug: 'how-to-pick-a-neighborhood-before-you-book',
    title: 'How to pick the right neighborhood before you book your hotel',
    excerpt: 'The single most important decision on any city trip is where you sleep. Here is how to choose well.',
    author: '50 Best Neighborhoods Editorial',
    date: '2026-04-01',
    tags: ['travel-tips', 'hotels', 'guide'],
    body: [
      "The single most important decision on any city trip is not which hotel you book — it is which neighborhood that hotel sits in. The difference between a wonderful weekend and a mediocre one is almost entirely geographical.",
      "The rule of thumb we follow at 50 Best Neighborhoods is simple: pick the neighborhood first, then pick the best hotel within it. Starting from the hotel end will always push you toward generic business districts, airport-adjacent blocks, or whatever the booking site's algorithm is promoting this week.",
      "So how do you choose? Three questions.",
      "**1. What do you actually want to do?** A foodie trip to Rome belongs in Testaccio, not Prati. A first-time museum-heavy Paris trip belongs in the Marais, not La Défense. Match the neighborhood's personality to the shape of your trip.",
      "**2. What is the 10-minute walk?** The best test of any neighborhood is what you can reach on foot in ten minutes from your hotel door. Coffee, dinner, a bookshop, a park, a bar: if all five are in that radius, you will have a great trip. If none of them are, the neighborhood is too quiet or too car-dependent.",
      "**3. Where do locals actually spend time?** Tourist neighborhoods empty out at night and on Sundays. Residential neighborhoods keep their soul. When in doubt, pick the one where local families walk their dogs on Sunday mornings — Trastevere over Prati, the Marais over the 16th, Prenzlauer Berg over Mitte.",
      "Our city guides are structured around this logic: each of the five neighborhoods we list for a city answers a different version of the above questions. Start there. Then book the hotel.",
    ],
  },
  {
    slug: 'the-neighborhood-brunch-rule',
    title: 'The Neighborhood Brunch Rule: a 60-second test for a great district',
    excerpt: 'There is one reliable shortcut for spotting the best neighborhood in any unfamiliar city. We call it the Brunch Rule.',
    author: '50 Best Neighborhoods Editorial',
    date: '2026-03-22',
    tags: ['travel-tips', 'food', 'guide'],
    body: [
      "Most people arrive in a new city on a Friday night and spend two days trying to figure out which neighborhood they should have booked instead. There is a faster way.",
      "We call it the Brunch Rule, and it works like this: on your first Sunday morning, walk the main street of your neighborhood at 11 AM. If every café has a queue of locals in workout clothes waiting for tables, you are in the right neighborhood. If every café is empty, or full of people taking photos of their avocado toast for Instagram, you are in the wrong one — move hotels.",
      "That sounds glib, but it is remarkably diagnostic. Queues of locals in workout clothes mean: this neighborhood has people who live here, who care about their Sunday routine, who have opinions about which café makes the best flat white. It means the district works as a place to live, not just a place to visit.",
      "Neighborhoods that pass the Brunch Rule around the world: Williamsburg, Brooklyn. Mile End, Montreal. Fitzroy, Melbourne. Vesterbro, Copenhagen. Kreuzberg, Berlin. Notting Hill, London. Condesa, Mexico City. Nørrebro, Copenhagen. Palermo Soho, Buenos Aires.",
      "Neighborhoods that fail: almost any central business district. Almost any stretch dominated by hotel chains. Almost any street where the shops close on Sundays. Beautiful but empty is the worst combination.",
      "Use the rule. Book better.",
    ],
  },
  {
    slug: 'five-underrated-cities',
    title: 'Five underrated cities with extraordinary neighborhoods',
    excerpt: 'Paris, Tokyo and London get the headlines. These five cities deserve far more attention than they get.',
    author: '50 Best Neighborhoods Editorial',
    date: '2026-03-10',
    tags: ['cities', 'underrated', 'guide'],
    body: [
      "Every 'world's best city' ranking looks roughly the same: Paris, Tokyo, London, New York, Barcelona, and a handful of usual suspects. They are all wonderful. They are also, in 2026, crowded, expensive, and — crucially — no longer surprising.",
      "Here are five cities we think are quietly hosting some of the most interesting neighborhoods in the world right now.",
      "**1. Tbilisi, Georgia.** Old Tbilisi's wooden balconies and sulphur baths, Sololaki's artistic quarter, Vera's riverside cafés — Tbilisi is the most atmospheric city in the Caucasus and still a fraction of the price of any European capital.",
      "**2. Porto, Portugal.** Lisbon is increasingly Lisbon-priced. Porto remains the quieter, grittier, more rewarding Portuguese city — especially Ribeira's UNESCO-listed riverfront and the emerging Cedofeita design quarter.",
      "**3. Bologna, Italy.** Florence and Venice get the tourists. Bologna gets the food. The porticoes of the centro storico, the food market in the Quadrilatero, the university-town energy — Bologna is the smartest Italian city for a food-focused weekend.",
      "**4. Ljubljana, Slovenia.** A capital the size of a large town. Metelkova's autonomous culture zone, Trnovo's riverside and the castle-hill old town make for one of Europe's most walkable city trips.",
      "**5. Tel Aviv, Israel.** Bauhaus boulevards, Neve Tzedek's stone alleys, the Florentin nightlife scene, and ancient Jaffa at the southern edge. Few cities combine beach, ancient history and contemporary design culture so elegantly.",
      "We have full neighborhood guides for each of these cities — use the city index to explore.",
    ],
  },
  {
    slug: 'why-we-synthesize-editorial-sources',
    title: 'Why our rankings synthesize editorial sources (and do not scrape them)',
    excerpt: "A note on how we build our rankings, and why you will not find scraped article text on this site.",
    author: '50 Best Neighborhoods Editorial',
    date: '2026-02-28',
    tags: ['editorial', 'about'],
    body: [
      "Every neighborhood page on 50 Best Neighborhoods lists three editorial sources — Time Out, Condé Nast Traveler, The New York Times, The Guardian, local city press — where you can read more. We link to publication homepages and travel sections, but we do not scrape, mirror or republish their editorial content. That is deliberate.",
      "First, the legal point: scraping and republishing copyrighted editorial content is copyright infringement, full stop. Many travel aggregators have tried it and many have been forced to shut down or settle. We are not going to play that game.",
      "Second, the editorial point: a synthesis is more useful than a paste. A travel reader does not need to read fifteen 'Best Neighborhoods in London' articles in full — they need the short version that reconciles what the fifteen articles agree on and disagree about. That is what we are trying to provide.",
      "Third, the encyclopedic point: for factual context about each neighborhood — history, architecture, demographics, famous residents, cultural landmarks — we draw on Wikipedia, which is licensed under Creative Commons Attribution-ShareAlike 4.0. That license permits reuse with attribution, which we render on every neighborhood page and in the site footer.",
      "The result: original editorial rankings, plus factual encyclopedic context, plus attributed links to the best travel journalism. No scraping, no pasting, no copyright gray area. That is the deal.",
    ],
  },
  {
    slug: 'where-to-stay-for-nightlife-vs-sleep',
    title: 'Where to stay for nightlife — and where to stay if you like sleeping',
    excerpt: 'The two most common hotel mistakes in every major city, and how to avoid them.',
    author: '50 Best Neighborhoods Editorial',
    date: '2026-02-15',
    tags: ['travel-tips', 'hotels'],
    body: [
      "Two of the most common mistakes travelers make when picking a neighborhood are symmetrical. The first is booking far from the nightlife because 'it will be quieter' — and then spending 40 minutes and €25 in a taxi every time you want dinner. The second is booking in the middle of the nightlife district because 'we'll walk everywhere' — and then being kept awake until 4 AM by people throwing up in the street below your window.",
      "The sweet spot is almost always adjacent. One neighborhood over from the loudest district, within walking distance of the action but out of earshot of the worst of it. Examples:",
      "• In Berlin: stay in Kreuzberg or Friedrichshain, not on Oranienburger Straße.",
      "• In Lisbon: stay in Príncipe Real or Chiado, not in Bairro Alto itself.",
      "• In Buenos Aires: stay in Palermo Chico or Villa Crespo, not in Palermo Soho's loudest blocks.",
      "• In Bangkok: stay in Ari or Ekkamai, not on Sukhumvit Soi 11.",
      "• In Madrid: stay in Chueca or Malasaña (but not on the main drag), not in Sol.",
      "Our neighborhood pages note the nightlife character of each district explicitly — check the tagline before you book. 'Loud' districts have a tagline that tells you so.",
    ],
  },
];

export function getAllPosts() {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug);
}
