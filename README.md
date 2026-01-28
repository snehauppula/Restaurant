# Restaurant Sales Dashboard 🍽️

A premium, owner-centric restaurant analytics dashboard that connects directly to **Google Sheets** to provide real-time sales insights and actionable storytelling reports.

![Dashboard](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Modern Features

- 📑 **Executive Business Snapshot (New!)**
  - Interactive Daily/Monthly report selector
  - Visual-first storytelling (Icons/Badges instead of tables)
  - Actionable recommendations (e.g., "Stock up on Paneer")
  - **Single-page Print/PDF optimization** for professional sharing

- 🔗 **Google Sheets Auto-Loading**
  - Direct integration with your public Google Sheet
  - No manual CSV uploads required
  - Real-time connection status monitoring

- 📊 **Strategic Analytics**
  - **Smart Insights**: Automated business tips based on data trends
  - **Quick Filters**: Focus on Today, This Month, or specific Meal Slots (Lunch/Dinner)
  - **KPI Cards**: Gross Revenue, Total Orders, and Average Bill Value
  - **Visual Trends**: Beautiful charts for items, categories, and peak hours

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Data Configuration

The dashboard fetches data from a public Google Sheets CSV export. Your sheet should include:

| Column | Type | Example |
|--------|------|---------|
| Date | DD-MM-YYYY | 28-01-2026 |
| Time | HH:MM | 14:30 |
| Order_ID | String | ORD001 |
| Item_Name | String | Veg Thali |
| Category | String | Main Dish |
| Quantity | Number | 2 |
| Unit_Price | Number | 180 |
| Total_Amount | Number | 360 |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with Premium Aesthetics)
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF/Print**: Custom CSS Optimization

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with premium Inter font
│   ├── page.tsx            # Main dashboard & Sheet orchestration
│   └── globals.css         # Global styles & Design tokens
├── components/
│   ├── ExecutiveReport.tsx # Premium storytelling report
│   ├── SheetConfig.tsx     # Google Sheets URL manager
│   ├── TodaysInsights.tsx  # Smart business recommendations
│   ├── QuickFilters.tsx    # Time & Category selectors
│   └── ...                 # Visual chart components
├── lib/
│   ├── sheetsIntegration.ts # Google Sheets fetching logic
│   ├── dataProcessor.ts    # Business logic & Metric calculations
│   └── types.ts            # Enterprise-grade TS definitions
└── package.json
```

## 🎯 Dashboard Routine

1. **Connect**: Enter your Google Sheets URL in the config panel
2. **Review**: Check the **Smart Insights** for immediate action items
3. **Generate**: Click **Get Snapshot** to see your Daily or Monthly "Business Story"
4. **Share**: Print the snapshot to PDF to share results with partners or staff

## 🌟 Visual Excellence

✅ **wow-factor design** with soft gradients and shadows
✅ **Responsive layout** for tablet and mobile use
✅ **Actionable over Analytical**: Tells you what to do, not just what happened
✅ **One-click insights** for non-technical users

---

**Designed and Developed by Flowsite ai** ❤️

