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
  - Actionable recommendations (e.g., "Paneer is trending")
  - **Single-page Print/PDF optimization** for professional sharing

- 🔗 **Google Sheets Auto-Loading**
  - Direct integration with your public Google Sheet
  - No manual CSV uploads required
  - Real-time connection status monitoring

- ✍️ **Live Data Entry (New!)**
  - Add new sales records directly from the dashboard
  - Real-time sync to your Google Sheet
  - Auto-calculation of totals and smart category selection

- **📱 Mobile Optimized**
  - Full-screen forms and horizontal scrolling chips for a native app feel

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 Live Sync Setup (Google Apps Script)

To enable the **Add Entry** feature to write data directly to your Google Sheet:

1. Open your **Google Sheet**.
2. Go to **Extensions** -> **Apps Script**.
3. Create a new file named `Sync.gs` and paste the provided sync code (see `google_apps_script.js` in the project).
4. Click **Deploy** -> **New Deployment**.
5. Select **Type: Web App**.
6. Set **Execute as: Me** and **Who has access: Anyone**.
7. Deploy and copy the **Web App URL**.
8. Paste this URL into the **Connectivity Settings** at the bottom of the dashboard.

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

## 📁 Project Structure

```
├── app/
│   ├── api/add-entry/      # Next.js API route for secure sync
│   ├── page.tsx            # Main dashboard orchestration
│   └── ...
├── components/
│   ├── ExecutiveReport.tsx # Storytelling snapshot report
│   ├── AddEntryModal.tsx   # Live data entry form (Mobile optimized)
│   ├── SheetConfig.tsx     # Connectivity settings manager
│   └── ...
├── lib/
│   ├── sheetsIntegration.ts # Read logic
│   └── dataProcessor.ts    # Business logic & KPI calculations
└── google_apps_script.js   # Code for Google Sheet Sync backend
```

## 🎯 Dashboard Routine

1. **Verify Connection**: Ensure the "Live" green badge appears in the header.
2. **Add Entry**: Use the "Add Entry" button to record new sales on the fly.
3. **Review**: Check the **Smart Insights** for immediate action items.
4. **Get Snapshot**: Generate your Daily/Monthly snapshot and print to PDF.

---

**Designed and Developed by [Flowsite ai](https://wa.me/8500097071?text=Hi%20Flowsite%20AI%2C%20I%27m%20interested%20in%20your%20services)** ❤️
