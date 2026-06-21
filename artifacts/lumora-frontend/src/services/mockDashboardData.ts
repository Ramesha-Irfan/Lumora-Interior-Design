export const MOCK_STATS = {
  designsThisMonth: 12,
  savedInspirations: 8,
  aiCreditsLeft: 88,
  recentProjects: 4,
  chartData: [
    { name: "Jan", generations: 3 },
    { name: "Feb", generations: 5 },
    { name: "Mar", generations: 2 },
    { name: "Apr", generations: 8 },
    { name: "May", generations: 6 },
    { name: "Jun", generations: 12 },
  ],
};

export const MOCK_PROJECTS = [
  { id: 1, name: "Living Room Luxury", style: "Luxury", date: "Jun 20, 2026", imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80" },
  { id: 2, name: "Minimal Bedroom", style: "Minimalist", date: "Jun 18, 2026", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
  { id: 3, name: "Modern Office", style: "Modern", date: "Jun 15, 2026", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" },
  { id: 4, name: "Cozy Studio", style: "Scandinavian", date: "Jun 10, 2026", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  { id: 5, name: "Master Bathroom", style: "Spa", date: "Jun 5, 2026", imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80" },
  { id: 6, name: "Dining Area", style: "Industrial", date: "Jun 1, 2026", imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80" },
];

export const MOCK_HISTORY = [
  { id: 1, title: "Living Room — Luxury Redesign", style: "Luxury", date: "Jun 20, 2026 · 3:45 PM", thumbUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&q=80" },
  { id: 2, title: "Bedroom — Minimalist Style", style: "Minimalist", date: "Jun 18, 2026 · 11:20 AM", thumbUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80" },
  { id: 3, title: "Home Office — Modern Workspace", style: "Modern", date: "Jun 15, 2026 · 6:10 PM", thumbUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80" },
  { id: 4, title: "Open Kitchen — Nordic Feel", style: "Scandinavian", date: "Jun 12, 2026 · 2:00 PM", thumbUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80" },
  { id: 5, title: "Master Bedroom — Art Deco", style: "Art Deco", date: "Jun 10, 2026 · 9:30 AM", thumbUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=80" },
  { id: 6, title: "Guest Room — Bohemian Vibes", style: "Bohemian", date: "Jun 5, 2026 · 4:15 PM", thumbUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&q=80" },
];

export const MOCK_FAVORITES = [
  { id: 1, title: "Luxury Living Palette", type: "Style Reference", imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=85", height: "h-64" },
  { id: 2, title: "Minimal Bedroom", type: "Generated Design", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=85", height: "h-80" },
  { id: 3, title: "Nordic Kitchen", type: "Style Reference", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85", height: "h-56" },
  { id: 4, title: "Art Deco Suite", type: "Generated Design", imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=85", height: "h-72" },
  { id: 5, title: "Japandi Office", type: "Style Reference", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=85", height: "h-60" },
  { id: 6, title: "Boho Bedroom", type: "Generated Design", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=85", height: "h-72" },
];

export const MOCK_DOWNLOADS = [
  { id: 1, name: "luxury-living-room.jpg", size: "4.2 MB", date: "Jun 20, 2026", imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=90" },
  { id: 2, name: "minimal-bedroom-render.jpg", size: "3.8 MB", date: "Jun 18, 2026", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=90" },
  { id: 3, name: "modern-office-design.jpg", size: "5.1 MB", date: "Jun 15, 2026", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90" },
];
