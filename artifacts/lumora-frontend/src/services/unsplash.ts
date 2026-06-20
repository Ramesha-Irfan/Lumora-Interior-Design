export interface UnsplashPhoto {
  id: number;
  unsplashId: string;
  type: string;
  title: string;
  height: string;
}

export const GALLERY_CATEGORIES = [
  "All",
  "Modern",
  "Luxury",
  "Minimalist",
  "Bedroom",
  "Kitchen",
  "Living Room",
  "Office",
  "Scandinavian",
  "Zen",
  "Gaming",
  "Cyberpunk",
];

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80";

export function buildUnsplashUrl(
  unsplashId: string,
  width = 800,
  quality = 80,
): string {
  return `https://images.unsplash.com/photo-${unsplashId}?w=${width}&q=${quality}&fit=crop&auto=format`;
}

const CURATED_PHOTOS: UnsplashPhoto[] = [
  // Modern
  { id: 1,  unsplashId: "1616486338812-3dadae4b4ace", type: "Modern",      title: "Glass Penthouse",        height: "h-[260px]" },
  { id: 2,  unsplashId: "1600585154340-be6161a56a0c", type: "Modern",      title: "Open Villa",             height: "h-[300px]" },
  { id: 3,  unsplashId: "1618221195710-dd6b41faaea6", type: "Modern",      title: "Sleek Loft",             height: "h-[340px]" },
  { id: 4,  unsplashId: "1556909114-f6e7ad7d3136",    type: "Modern",      title: "Contemporary Kitchen",   height: "h-[260px]" },
  { id: 5,  unsplashId: "1600607687920-4e2a09cf159d", type: "Modern",      title: "Urban Apartment",        height: "h-[220px]" },
  { id: 6,  unsplashId: "1547282610-c86a1b5c6ca0",    type: "Modern",      title: "Clean Lines Study",      height: "h-[300px]" },

  // Luxury
  { id: 7,  unsplashId: "1554995207-c18c203602cb",    type: "Luxury",      title: "Master Bedroom Suite",   height: "h-[360px]" },
  { id: 8,  unsplashId: "1615874959474-d609969a20ed", type: "Luxury",      title: "Marble & Gold",          height: "h-[300px]" },
  { id: 9,  unsplashId: "1560448204-e02f11c3d0e2",    type: "Luxury",      title: "Grand Living Room",      height: "h-[260px]" },
  { id: 10, unsplashId: "1600596542815-ffad4c1539a9", type: "Luxury",      title: "Penthouse Terrace",      height: "h-[340px]" },
  { id: 11, unsplashId: "1505691938895-1758d7feb511", type: "Luxury",      title: "Gold Accents Bath",      height: "h-[280px]" },
  { id: 12, unsplashId: "1631049307264-da0ec9d70304", type: "Luxury",      title: "Presidential Suite",     height: "h-[320px]" },

  // Minimalist
  { id: 13, unsplashId: "1586023492125-27b2c045efd7", type: "Minimalist",  title: "Bright Living Room",     height: "h-[280px]" },
  { id: 14, unsplashId: "1555041469-a586c61ea9bc",    type: "Minimalist",  title: "Monochrome Sofa",        height: "h-[260px]" },
  { id: 15, unsplashId: "1503174971373-b1f69850bdd0", type: "Minimalist",  title: "Clean White Studio",     height: "h-[320px]" },
  { id: 16, unsplashId: "1524758631624-e2822b8da36",  type: "Minimalist",  title: "Minimal Workspace",      height: "h-[240px]" },
  { id: 17, unsplashId: "1491382825904-a4f789d44b27", type: "Minimalist",  title: "Open Plan Interior",     height: "h-[300px]" },
  { id: 18, unsplashId: "1536152470836-b962b7e50302", type: "Minimalist",  title: "Nordic Simplicity",      height: "h-[260px]" },

  // Bedroom
  { id: 19, unsplashId: "1540574163026-643ea20ade25", type: "Bedroom",     title: "Cozy Master Bedroom",    height: "h-[300px]" },
  { id: 20, unsplashId: "1484101403633-562f891dc89a", type: "Bedroom",     title: "Linen & Light",          height: "h-[340px]" },
  { id: 21, unsplashId: "1587654780291-39c9404d746b", type: "Bedroom",     title: "Warm Tones Bedroom",     height: "h-[260px]" },
  { id: 22, unsplashId: "1502005097973-6a7082348e28", type: "Bedroom",     title: "Penthouse Bedroom",      height: "h-[280px]" },
  { id: 23, unsplashId: "1505693314120-0d443867891c", type: "Bedroom",     title: "Spa Retreat Bedroom",    height: "h-[320px]" },
  { id: 24, unsplashId: "1594026112284-02bb6f3352fe", type: "Bedroom",     title: "Hotel-Style Suite",      height: "h-[240px]" },

  // Kitchen
  { id: 25, unsplashId: "1556909129-04b4302ff0bb",    type: "Kitchen",     title: "Marble Island Kitchen",  height: "h-[300px]" },
  { id: 26, unsplashId: "1600489000022-c2bd27bddbb9", type: "Kitchen",     title: "Chef's Open Kitchen",    height: "h-[260px]" },
  { id: 27, unsplashId: "1556909190-4e1c56c22e78",    type: "Kitchen",     title: "Matte Black Cabinetry",  height: "h-[340px]" },
  { id: 28, unsplashId: "1495474472287-4d71bcdd2085", type: "Kitchen",     title: "Minimalist Kitchen Bar", height: "h-[280px]" },
  { id: 29, unsplashId: "1565538708323-c1889e0a1da7", type: "Kitchen",     title: "Farmhouse Kitchen",      height: "h-[260px]" },
  { id: 30, unsplashId: "1570585765765-e45fc9b3e23c", type: "Kitchen",     title: "White Scandinavian Kitchen","height": "h-[300px]" },

  // Living Room
  { id: 31, unsplashId: "1558618666-fcd25c85cd64",    type: "Living Room", title: "Sunlit Family Room",     height: "h-[300px]" },
  { id: 32, unsplashId: "1555041469-a586c61ea9bc",    type: "Living Room", title: "Grey Sofa Lounge",       height: "h-[340px]" },
  { id: 33, unsplashId: "1606241895268-2bb1253e0a1b", type: "Living Room", title: "Fireplace Living Room",  height: "h-[260px]" },
  { id: 34, unsplashId: "1601628828688-632f38a5a7d0", type: "Living Room", title: "Open Space Lounge",      height: "h-[280px]" },
  { id: 35, unsplashId: "1583847268964-b28dc8f51f92", type: "Living Room", title: "Zen Seating Area",       height: "h-[320px]" },
  { id: 36, unsplashId: "1600607688969-a5bfcd646154", type: "Living Room", title: "Modern Family Room",     height: "h-[260px]" },

  // Office
  { id: 37, unsplashId: "1507003211169-0a1dd7228f2d", type: "Office",      title: "Minimalist Home Office", height: "h-[280px]" },
  { id: 38, unsplashId: "1517245386807-bb43f82c33c4", type: "Office",      title: "Creative Studio Desk",   height: "h-[320px]" },
  { id: 39, unsplashId: "1524758631624-e2822b8da36",  type: "Office",      title: "White Desk Setup",       height: "h-[260px]" },
  { id: 40, unsplashId: "1593642632559-0c6d3fc62b89", type: "Office",      title: "Executive Office",       height: "h-[300px]" },
  { id: 41, unsplashId: "1526040652367-ac758e98052e", type: "Office",      title: "Glass Office Space",     height: "h-[240px]" },
  { id: 42, unsplashId: "1572025442646-868bec9f3b2c", type: "Office",      title: "Cozy Reading Corner",    height: "h-[340px]" },

  // Scandinavian
  { id: 43, unsplashId: "1505843490538-5133c6c7d0e1", type: "Scandinavian", title: "Fjord Light Room",      height: "h-[300px]" },
  { id: 44, unsplashId: "1598928506311-c55ded91a20c", type: "Scandinavian", title: "Hygge Living Space",    height: "h-[260px]" },
  { id: 45, unsplashId: "1561731216-c3a4d99437d5",    type: "Scandinavian", title: "Nordic White Room",     height: "h-[340px]" },
  { id: 46, unsplashId: "1555041469-a586c61ea9bc",    type: "Scandinavian", title: "Pine Wood Interior",    height: "h-[280px]" },
  { id: 47, unsplashId: "1603712759282-7a21d26ae4b5", type: "Scandinavian", title: "Danish Design Corner",  height: "h-[300px]" },
  { id: 48, unsplashId: "1536152470836-b962b7e50302", type: "Scandinavian", title: "Clean Scandinavian Bedroom","height": "h-[260px]" },

  // Zen
  { id: 49, unsplashId: "1583847268964-b28dc8f51f92", type: "Zen",         title: "Bamboo Retreat",         height: "h-[320px]" },
  { id: 50, unsplashId: "1540575861122-3b0a0bbf40c2", type: "Zen",         title: "Japanese Garden Room",   height: "h-[260px]" },
  { id: 51, unsplashId: "1600607687920-4e2a09cf159d", type: "Zen",         title: "Meditation Alcove",      height: "h-[300px]" },
  { id: 52, unsplashId: "1558618666-fcd25c85cd64",    type: "Zen",         title: "Wabi-Sabi Living",       height: "h-[280px]" },
  { id: 53, unsplashId: "1524758631624-e2822b8da36",  type: "Zen",         title: "Tatami Room",            height: "h-[340px]" },
  { id: 54, unsplashId: "1549488831-7e5e9cc4f1af",    type: "Zen",         title: "Onsen-style Bathroom",   height: "h-[260px]" },

  // Gaming
  { id: 55, unsplashId: "1593784991095-a205069470b6", type: "Gaming",      title: "Neon Gaming Setup",      height: "h-[340px]" },
  { id: 56, unsplashId: "1593642632559-0c6d3fc62b89", type: "Gaming",      title: "Streamer Command Center","height": "h-[280px]" },
  { id: 57, unsplashId: "1552820728-8b57e3da9c3d",    type: "Gaming",      title: "RGB Battle Station",     height: "h-[300px]" },
  { id: 58, unsplashId: "1547919307-1ecb10702e6f",    type: "Gaming",      title: "Dual Monitor Rig",       height: "h-[260px]" },
  { id: 59, unsplashId: "1600210492493-0946911123ea", type: "Gaming",      title: "Cyberpunk Gaming Den",   height: "h-[320px]" },
  { id: 60, unsplashId: "1588681664899-f0fd0a2b3c6d", type: "Gaming",      title: "Pro Setup Studio",       height: "h-[240px]" },

  // Cyberpunk
  { id: 61, unsplashId: "1600210492493-0946911123ea", type: "Cyberpunk",   title: "Neon Lit Interior",      height: "h-[320px]" },
  { id: 62, unsplashId: "1547919307-1ecb10702e6f",    type: "Cyberpunk",   title: "Future Apartment",       height: "h-[260px]" },
  { id: 63, unsplashId: "1593784991095-a205069470b6", type: "Cyberpunk",   title: "Digital Lounge",         height: "h-[300px]" },
  { id: 64, unsplashId: "1596422405526-93af98a2d2b7", type: "Cyberpunk",   title: "Neon Pod Room",          height: "h-[340px]" },
  { id: 65, unsplashId: "1552820728-8b57e3da9c3d",    type: "Cyberpunk",   title: "Holographic Den",        height: "h-[280px]" },
  { id: 66, unsplashId: "1618221195710-dd6b41faaea6", type: "Cyberpunk",   title: "Night City Loft",        height: "h-[260px]" },
];

export function getPhotoUrl(photo: UnsplashPhoto, width = 800): string {
  return buildUnsplashUrl(photo.unsplashId, width);
}

export function searchPhotos(query: string, category: string): UnsplashPhoto[] {
  const q = query.trim().toLowerCase();
  return CURATED_PHOTOS.filter((photo) => {
    const matchCat = category === "All" || photo.type === category;
    const matchSearch =
      !q ||
      photo.title.toLowerCase().includes(q) ||
      photo.type.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
}

export function getFallbackImage(): string {
  return FALLBACK_IMAGE;
}

export const STUDIO_STYLE_IMAGES: Record<string, string> = {
  minimalist: buildUnsplashUrl("1586023492125-27b2c045efd7", 900),
  luxury:     buildUnsplashUrl("1554995207-c18c203602cb",    900),
  zen:        buildUnsplashUrl("1583847268964-b28dc8f51f92", 900),
  gaming:     buildUnsplashUrl("1593784991095-a205069470b6", 900),
  cyberpunk:  buildUnsplashUrl("1600210492493-0946911123ea", 900),
  scandinavian: buildUnsplashUrl("1505843490538-5133c6c7d0e1", 900),
  modern:     buildUnsplashUrl("1618221195710-dd6b41faaea6", 900),
  bedroom:    buildUnsplashUrl("1540574163026-643ea20ade25",  900),
  kitchen:    buildUnsplashUrl("1556909129-04b4302ff0bb",    900),
};

export const STUDIO_STYLE_THUMBNAILS: Record<string, string> = {
  minimalist: buildUnsplashUrl("1586023492125-27b2c045efd7", 400),
  luxury:     buildUnsplashUrl("1554995207-c18c203602cb",    400),
  zen:        buildUnsplashUrl("1583847268964-b28dc8f51f92", 400),
  gaming:     buildUnsplashUrl("1593784991095-a205069470b6", 400),
  cyberpunk:  buildUnsplashUrl("1600210492493-0946911123ea", 400),
  scandinavian: buildUnsplashUrl("1505843490538-5133c6c7d0e1", 400),
  modern:     buildUnsplashUrl("1618221195710-dd6b41faaea6", 400),
  bedroom:    buildUnsplashUrl("1540574163026-643ea20ade25",  400),
  kitchen:    buildUnsplashUrl("1556909129-04b4302ff0bb",    400),
};
