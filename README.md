# Restaurant Sales Dashboard 🍽️

A modern, premium restaurant sales analytics dashboard built with Next.js, React, and Tailwind CSS.

![Dashboard](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 📊 **5 Core Analytics Sections**
  - Daily Sales KPIs (Revenue, Orders, Average Bill)
  - Sales Trends (Area Chart)
  - Top & Bottom Selling Items (Bar Charts)
  - Category Performance (Donut Chart)
  - Peak Hours Analysis (Bar Chart)

- 🎨 **Premium UI/UX**
  - Modern card-based layout
  - Smooth animations and transitions
  - Responsive design (desktop, tablet, mobile)
  - Professional gradients and colors

- 📁 **Easy Data Import**
  - Drag-and-drop CSV upload
  - File validation
  - Real-time data parsing

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 CSV Format

Your sales data CSV should include these columns:

| Column | Type | Example |
|--------|------|---------|
| Date | DD-MM-YYYY | 20-01-2026 |
| Time | HH:MM | 12:15 |
| Order_ID | String | ORD001 |
| Item_Name | String | Veg Thali |
| Category | String | Main Dish |
| Quantity | Number | 2 |
| Unit_Price | Number | 180 |
| Total_Amount | Number | 360 |

A sample CSV file (`sample_sales_data.csv`) is included in the project.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **Icons**: Lucide React

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── DailySalesKPIs.tsx  # KPI cards
│   ├── SalesTrendChart.tsx # Trend chart
│   ├── TopBottomItems.tsx  # Item charts
│   ├── CategoryPerformance.tsx # Category chart
│   └── PeakHoursChart.tsx  # Hourly chart
├── lib/
│   ├── types.ts            # TypeScript types
│   └── dataProcessor.ts    # Data utilities
└── package.json
```

## 🎯 Usage

1. **Upload Data**: Drag and drop your CSV file or click to browse
2. **View Insights**: The dashboard automatically processes and visualizes your data
3. **Analyze**: Review KPIs, trends, and performance metrics
4. **Make Decisions**: Use insights for menu optimization and staffing

## 🌟 Key Highlights

✅ Clean, professional design  
✅ Fast data processing  
✅ Interactive charts with tooltips  
✅ Fully responsive layout  
✅ Business-friendly labels  
✅ No technical jargon  

## 📈 Business Value

Perfect for restaurant owners who need quick, daily insights:

- Monitor daily sales performance
- Identify trending items
- Understand customer preferences
- Optimize menu offerings
- Plan staff schedules based on busy hours

**Get insights in under 5 seconds!**

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

This project was created for restaurant analytics and business intelligence purposes.

---

**Built with ❤️ for restaurant owners**
