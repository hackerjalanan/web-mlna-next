# Perintah run
  - all host
    npm run dev -- --hostname 0.0.0.0
  - default
    npm run dev
    
# Menu bar
    Navbar
    ├── Home
    ├── About
    ├── Projects
    ├── Gallery
    ├── Documentation
    └── Contact

# Flow 
                    VERCEL
                      │
                  NEXT.JS
                      │
        ┌─────────────┼──────────────┐
        │             │              │
      Pages       Components       API
        │             │              │
        │             │              │
        └─────────────┼──────────────┘
                      │
                   Supabase
          ┌───────────┼───────────┐
          │           │           │
       Database     Storage      Auth
          │           │           │
     ┌────┼────┐      │           │
     │    │    │      │           │
 Projects Gallery Docs          Admin
 Messages Fireworks

# Foldering
portfolio/
│
├── public/
│   ├── images/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── gallery/
│   │   └── documents/
│   │
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   │
│   │   ├── docs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── gallery/
│   │   │   │   ├── page.tsx
│   │   │   │   └── upload/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── docs/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── messages/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── fireworks/
│   │       │   └── route.ts
│   │       │
│   │       ├── projects/
│   │       │   └── route.ts
│   │       │
│   │       ├── gallery/
│   │       │   └── route.ts
│   │       │
│   │       ├── docs/
│   │       │   └── route.ts
│   │       │
│   │       └── messages/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Gallery.tsx
│   │   │   └── Contact.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   └── ProjectDetail.tsx
│   │   │
│   │   ├── gallery/
│   │   │   ├── GalleryCard.tsx
│   │   │   └── GalleryGrid.tsx
│   │   │
│   │   ├── docs/
│   │   │   ├── DocsCard.tsx
│   │   │   └── DocsContent.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── GalleryForm.tsx
│   │   │   └── DocsForm.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       └── Loading.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── auth/
│   │   │   └── auth.ts
│   │   │
│   │   └── utils.ts
│   │
│   ├── data/
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── social.ts
│   │   └── navigation.ts
│   │
│   ├── types/
│   │   ├── project.ts
│   │   ├── gallery.ts
│   │   ├── documentation.ts
│   │   ├── profile.ts
│   │   └── database.ts
│   │
│   └── hooks/
│       ├── useProjects.ts
│       ├── useGallery.ts
│       └── useAuth.ts
│
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md