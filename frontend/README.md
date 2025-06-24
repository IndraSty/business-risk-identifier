# 🤖 RiskSight AI - AI-Powered Business Risk Analysis

<div align="center">
  <img src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="RiskSight AI Banner" width="100%" height="300" style="object-fit: cover; border-radius: 10px;">
  
  [![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.0-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

## 📋 Description

**RiskSight AI** is an AI-powered business risk analysis platform that enables companies to automatically identify potential risks from business documents such as meeting transcripts, business plans, and other strategic documents. Leveraging Natural Language Processing (NLP) and Machine Learning technologies, this platform delivers accurate, fast, and reliable risk analysis.

### ✨ Key Features

- 🔍 **Smart Document Analysis**: Upload and automatically analyze business documents (PDF, DOCX, DOC, TXT)
- 📊 **Risk Visualization**: Interactive dashboard with charts and graphs to understand risk distribution
- 🎯 **Risk Classification**: Categorize risks by severity level (Critical, High, Medium, Low)
- 📈 **Risk Scoring**: Risk assessment system with a 1-10 scale for mitigation prioritization
- 💡 **Mitigation Recommendations**: Actionable suggestions to reduce risk impact
- 📄 **Report Export**: Download analysis results in JSON and PDF formats
- 🏭 **Multi-Industry Support**: Compatible with various business sectors (Technology, Finance, Healthcare, etc.)
- 📱 **Responsive Design**: Optimized interface for desktop, tablet, and mobile devices

## 🚀 Demo Live

Try the app now: [RiskSight AI Demo](https://your-deployment-url.com)

## 🛠️ Technologies Used

### Frontend Framework
- **Next.js 13.5.1** – React framework with App Router
- **TypeScript 5.2.2** – Type-safe JavaScript
- **React 18.2.0** – UI library

### Styling & UI
- **Tailwind CSS 3.3.3** – Utility-first CSS framework
- **shadcn/ui** – Modern React component library
- **Framer Motion 11.0.0** – Animation library
- **Lucide React** – Beautiful icon set

### Data Visualization
- **Recharts 2.12.7** – Chart library for React
- **Chart.js integration** – Advanced charting capabilities

### File Processing
- **jsPDF 2.5.1** – PDF generation
- **html2canvas 1.4.1** – HTML to canvas conversion

### State Management & Utilities
- **React Hook Form 7.53.0** – Form handling
- **Zod 3.23.8** – Schema validation
- **date-fns 3.6.0** – Date manipulation
- **clsx & tailwind-merge** – Conditional styling

## 📦 Instalasi

### Prerequisites
- Node.js 18.0.0 or newer
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/risksight-ai.git
    cd risksight-ai
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. **Open your browser**
    ```
    http://localhost:3000
    ```

## 🏗️ Project Structure


```
risksight-ai/
├── app/                            # Next.js App Router
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/                     # React components
│   ├── ui/                         # shadcn/ui components
│   ├── About.tsx                   # About section
│   ├── Demo.tsx                    # Interactive demo
│   ├── Features.tsx                # Features showcase
│   ├── Footer.tsx                  # Footer component
│   ├── Hero.tsx                    # Hero section
│   └── Navbar.tsx                  # Navigation bar
├── constants/                      # Application constants and configuration
│   ├── index.ts                    # Exports all constants
├── context/                        # React context providers
│   ├── RiskAnalysisContext.tsx     # Context for risk analysis state management
├── services/                       # Business logic and API services
│   ├── api_service.ts              # Base API service (axios/fetch wrappers)
│   ├── risk_analyze_service.ts     # Risk analysis specific API calls
├── types/                          # TypeScript type definitions
│   ├── index.ts                    # Exports all type definitions
├── lib/                            # Utility functions
│   ├── pdfExport.ts                # PDF generation logic
│   └── utils.ts                    # Common utilities
├── public/                         # Static assets
├── hooks/                          # Custom React hooks
│   └── use-toast.ts                # Toast notification hook
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

## 🎨 Komponen Utama

### 1. Hero Section (`components/Hero.tsx`)
- Landing page with engaging animations
- Call-to-action button for live demo
- Platform statistics display
- Gradient background with floating elements

### 2. Features Section (`components/Features.tsx`)
- Showcase main features with icons and descriptions
- Animated cards with hover effects
- Responsive grid layout

### 3. Interactive Demo (`components/Demo.tsx`)
- File upload with drag & drop
- Text extraction from documents
- Real-time analysis simulation
- Result visualization with charts
- Export functionality (JSON & PDF)

### 4. About Section (`components/About.tsx`)
- Information about the technologies used
- Statistik and achievements
- Technology stack showcase

## 📊 Fitur Demo

### Upload & Processing
- **Drag & Drop**: Intuitive interface for file uploads
- **File Validation**: Supports PDF, DOCX, DOC, TXT (max 10MB)
- **Text Extraction**: Automatic text extraction from documents
- **Progress Tracking**: Real-time progress indicator

### Analysis Configuration
- **Industry Selection**: Choose the business sector
- **Company Scale**: Configure company size
- **Template Guide**: Document templates for optimal results

### Results Visualization
- **Risk Overview**: Summary with key metrics
- **Interactive Charts**: Bar chart, pie chart, category distribution
- **Detailed Risk List**: Expandable risk cards with mitigation recommendations
- **Export Options**: JSON and PDF report generation

## 🎯 Mock Data Structure

```typescript
interface RiskAnalysisResult {
  document_analysis: {
    document_type: string;
    industry: string;
    company_scale: string;
    analysis_timestamp: string;
    document_length: number;
  };
  identified_risk: Array<{
    risk_id: string;
    title: string;
    description: string;
    category: 'financial' | 'market' | 'operational' | 'compliance' | 'technology';
    severity: 'critical' | 'high' | 'medium' | 'low';
    probability: string;
    risk_score: number;
    impact_areas: string[];
    mitigation_recommendations: string[];
    context_evidence: string;
  }>;
  risk_summary: {
    total_risks: number;
    risk_distribution: Record<string, number>;
    top_categories: string[];
    overall_risk_score: number;
    key_concerns: string[];
  };
  processing_time: number;
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3b82f6 to #1e40af)
- **Secondary**: Indigo (#6366f1)
- **Accent**: Cyan (#06b6d4)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-800)
- **Body**: Regular (400) and Medium (500)
- **Line Height**: 150% for body, 120% for headings

### Spacing System
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## ⚡ Performance Optimizations

- **Static Generation**: Next.js static export for optimal performance
- **Image Optimization**: Lazy loading and responsive images
- **Code Splitting**: Automatic code splitting with Next.js
- **Bundle Analysis**: Optimized bundle size
- **Caching**: Browser caching for assets

## 🔧 Scripts Available

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🚀 Deployment

1. Push your code to the GitHub repository  
2. Connect the repository in the Vercel dashboard  
3. Automatic deployment will trigger on every push  

### Netlify
1. Build the project: `npm run build`
2. Upload the `out/` folder to Netlify
3. Configure redirects if needed

### Manual Deployment
```bash
npm run build
# Upload 'out' folder ke hosting provider
```

## 🤝 Contributing

We welcome contributions from the community! Here’s how you can contribute:

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow the configured ESLint rules
- Write readable and maintainable code
- Test features before submitting a PR
- Update documentation if necessary

## 📝 Roadmap

### Phase 1 (Current)
- ✅ Frontend interface with demo functionality
- ✅ File upload and text extraction simulation
- ✅ Interactive data visualization
- ✅ PDF report generation

### Phase 2 (Planned)
- 🔄 Backend API integration
- 🔄 Real AI model integration (OpenAI/Custom)
- 🔄 User authentication system
- 🔄 Document history and management

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced analytics dashboard
- 📋 Team collaboration features
- 📋 API for third-party integration

## 🐛 Known Issues

- File upload is currently simulated (will be integrated with the backend)
- Text extraction uses mock data
- Analysis results are based on predefined mock data

## 📞 Support

If you encounter any issues or have questions:

- **Email**: indrastyawan0925@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/IndraSty/business-risk-identifier/issues)
- **Documentation**: [Wiki](https://github.com/IndraSty/business-risk-identifier/wiki)

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for full details.
## 🙏 Acknowledgments

- **OpenAI** for the AI technology that inspired this project
- **Vercel** for the excellent deployment platform
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for the powerful animation library

## 📊 Project Stats

- **Lines of Code**: ~3,000+
- **Components**: 15+
- **Dependencies**: 50+
- **Build Size**: ~2MB (optimized)
- **Performance Score**: 95+ (Lighthouse)

---

<div align="center">
<p>Made with ❤️ using Next.js and TypeScript</p>
<p>© 2025 RiskSight AI. All rights reserved.</p>
</div>
