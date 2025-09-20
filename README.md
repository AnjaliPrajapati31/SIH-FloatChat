<div align="center">

# 🌊 FloatChat - Aapka Jal Saathi

**Interactive Marine Buoy Data Visualization & Natural Language Query Platform**

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

_Transforming marine research through intelligent data visualization and natural language queries_

[🚀 **Live Demo**](https://floatchat-ins.vercel.app/) • [📊 **Features**](#-features) • [🏗️ **Architecture**](#-system-architecture) • [🤝 **Contributing**](#-contributing)

**🌐 Try it now: [floatchat-ins.vercel.app](https://floatchat-ins.vercel.app/)**

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [📐 System Architecture](#-system-architecture)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🛠️ ETL Pipeline](#️-etl-pipeline)
- [🎨 Dashboard Preview](#-dashboard-preview)
- [🔒 Authentication & Roles](#-authentication--roles)
- [💬 Example Queries](#-example-queries)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

### 🧠 **Intelligent Querying**

- **Natural Language Interface**: Query complex oceanographic data using plain English
- **RAG-Powered Responses**: Context-aware answers using Retrieval-Augmented Generation
- **Multi-Parameter Analysis**: Compare temperature, salinity, pressure, and depth profiles

### 🌍 **Advanced Visualization**

- **Interactive 2D Maps**: Leaflet-based satellite view with buoy locations
- **3D Ocean Exploration**: Cesium.js integration for immersive underwater profiling
- **Real-time Charts**: Plotly-powered interactive time series and profile plots
- **Comparative Analysis**: Side-by-side buoy comparisons and temporal analysis

### 📊 **Data Processing Excellence**

- **NetCDF Ingestion**: Automated processing of Argo float `.nc` files from FTP
- **Smart Deduplication**: Checksum, cycle number, and timestamp-based duplicate detection
- **Quality Control**: Automated QC flag validation and data integrity checks
- **Multi-format Output**: Postgres, Parquet, and Vector DB storage

### 🔐 **Enterprise-Ready Security**

- **Role-Based Access**: Researcher, Student, and Admin privilege levels
- **JWT Authentication**: Secure token-based login system
- **API Rate Limiting**: Prevent abuse with intelligent request throttling

---

## 📐 System Architecture

FloatChat implements a modern, scalable architecture designed for handling large-scale marine datasets with intelligent query processing capabilities.

### 🏗️ **High-Level Architecture**

```mermaid
graph TB
    subgraph "🌐 Data Sources"
        A1[Argo Float FTP Servers]
        A2[NOAA Data Centers]
        A3[Marine Research APIs]
    end

    subgraph "🔄 ETL & Processing Layer"
        B1[Data Ingestion Service<br/>🐍 Python + Celery]
        B2[NetCDF Parser<br/>📊 xarray + netCDF4]
        B3[Quality Controller<br/>✅ QC Flag Validation]
        B4[Data Normalizer<br/>🔧 Schema Transformation]
    end

    subgraph "🗄️ Storage Layer"
        C1[PostgreSQL<br/>🐘 Relational Data]
        C2[Apache Parquet<br/>📈 Time Series Analytics]
        C3[ChromaDB<br/>🧠 Vector Embeddings]
        C4[Redis<br/>⚡ Cache & Sessions]
    end

    subgraph "🤖 AI & Intelligence Layer"
        D1[Embedding Generator<br/>🔤 OpenAI text-embedding-3]
        D2[RAG Engine<br/>🔍 LangChain + ChromaDB]
        D3[Query Processor<br/>💬 GPT-4 + Context]
        D4[Response Formatter<br/>📝 Structured Output]
    end

    subgraph "⚡ API Layer"
        E1[FastAPI Gateway<br/>🚀 REST + WebSocket]
        E2[Authentication Service<br/>🔐 JWT + RBAC]
        E3[Rate Limiter<br/>🛡️ Redis-based throttling]
        E4[Data Export Service<br/>📥 CSV/JSON/NetCDF]
    end

    subgraph "💻 Frontend Layer"
        F1[React Dashboard<br/>⚛️ Interactive UI]
        F2[Leaflet Maps<br/>🗺️ 2D Visualization]
        F3[Chart.js Analytics<br/>📊 Scientific Plots]
        F4[Chat Interface<br/>💬 Natural Language]
    end

    A1 & A2 & A3 --> B1
    B1 --> B2 --> B3 --> B4
    B4 --> C1 & C2 & C3
    C1 & C2 & C3 --> D1
    D1 --> D2 --> D3 --> D4
    C1 & C2 & D4 --> E1
    E2 & E3 & E4 --> E1
    E1 --> F1
    F1 --> F2 & F3 & F4
```

### 🔄 **Data Processing Pipeline**

```mermaid
sequenceDiagram
    participant FTP as 🌐 FTP Server
    participant ETL as 🔄 ETL Service
    participant DB as 🗄️ Storage Layer
    participant AI as 🤖 AI Engine
    participant API as ⚡ FastAPI
    participant UI as 💻 React UI

    FTP->>ETL: Download .nc files
    ETL->>ETL: Parse & validate NetCDF
    ETL->>DB: Store normalized data
    ETL->>AI: Generate embeddings

    UI->>API: Natural language query
    API->>AI: Process with RAG
    AI->>DB: Retrieve relevant data
    AI->>API: Formatted response
    API->>UI: Visualization data
    UI->>UI: Render charts & maps
```

### 🏛️ **Microservices Architecture**

| Service                 | Technology         | Responsibility                 | Scaling               |
| ----------------------- | ------------------ | ------------------------------ | --------------------- |
| **🔄 Data Ingestion**   | Python + Celery    | FTP downloads, file processing | Horizontal (workers)  |
| **🧠 AI Processing**    | LangChain + OpenAI | RAG queries, embeddings        | Vertical (GPU/CPU)    |
| **⚡ API Gateway**      | FastAPI + Nginx    | Request routing, auth          | Horizontal (replicas) |
| **💻 Frontend**         | React + Vercel     | User interface, visualization  | CDN distribution      |
| **🗄️ Database Cluster** | PostgreSQL + Redis | Data persistence, caching      | Read replicas         |

### 🔐 **Security Architecture**

```mermaid
graph LR
    A[User Request] --> B[🛡️ WAF]
    B --> C[🔐 JWT Auth]
    C --> D[📊 Rate Limiter]
    D --> E[⚡ API Gateway]
    E --> F[🔒 Service Mesh]
    F --> G[📊 Database]

    H[🔑 Secrets Manager] --> E
    I[📝 Audit Logs] --> G
```

### 📊 **Performance Optimizations**

- **🚀 Lazy Loading**: Components and data loaded on demand
- **📦 Data Compression**: Gzip + Brotli for API responses
- **⚡ Query Caching**: Redis-based intelligent caching layer
- **🔍 Database Indexing**: Optimized for geospatial and temporal queries
- **📈 CDN Distribution**: Global content delivery for static assets

---

## ⚙️ Tech Stack

### 🐍 **Backend**

```python
# Core Processing
xarray         # NetCDF data manipulation
netCDF4        # File parsing
pandas         # Data transformation
numpy          # Numerical computing

# Database & Storage
PostgreSQL     # Primary database
Apache Parquet # Columnar storage
ChromaDB       # Vector embeddings

# AI & ML
OpenAI API     # LLM integration
LangChain      # RAG framework
scikit-learn   # ML utilities

# API & Auth
FastAPI        # REST API framework
JWT            # Authentication
Pydantic       # Data validation
```

### ⚛️ **Frontend**

```javascript
// Core Framework
React 18       // UI library
React Router   // Navigation
Context API    // State management

// Visualization
Leaflet        // 2D mapping
Cesium.js      // 3D globe
Chart.js       // Interactive charts
Plotly.js      // Scientific plotting

// Styling & UX
Tailwind CSS   // Utility-first styling
Material Icons // Icon system
Fira Sans      // Typography
```

### 🚀 **DevOps & Deployment**

- **Docker**: Containerized deployment
- **Nginx**: Reverse proxy & load balancing
- **Redis**: Caching & session storage
- **GitHub Actions**: CI/CD pipeline

---

## 🚀 Getting Started

### 📋 Prerequisites

```bash
# Required versions
Node.js >= 16.0.0
Python >= 3.9.0
PostgreSQL >= 13.0
Redis >= 6.0
```

### ⚡ Quick Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-org/SIH-FloatChat.git
cd SIH-FloatChat
```

2. **Environment Setup**

```bash
# Copy environment template
cp .env.example .env

# Configure your environment
# Add OpenAI API key, database credentials, etc.
```

3. **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database setup
python manage.py migrate
python manage.py create_admin
```

4. **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

5. **🎉 Launch Application**

```bash
# Terminal 1: Backend
cd backend && python manage.py runserver

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Vector DB
chroma run --host localhost --port 8000
```

**Access**: Open `http://localhost:3000` and start exploring! 🌊

> **⚠️ Note**: First launch will take 2-3 minutes while we populate sample data and generate embeddings.

---

## 🛠️ ETL Pipeline

### 📥 **Stage 1: Data Ingestion**

```python
# Automated FTP download
ftp_client.download_argo_files(
    date_range="2023-01-01,2024-12-31",
    regions=["indian_ocean", "arabian_sea"],
    parameters=["temperature", "salinity", "pressure"]
)
```

### 🔍 **Stage 2: Deduplication & Validation**

```python
# Smart duplicate detection
duplicates = detect_duplicates(
    methods=["checksum", "cycle_number", "juld"],
    tolerance=0.001  # 1ms time tolerance
)

# Quality control validation
qc_results = validate_quality_flags(
    temperature_qc=1,  # Good data only
    salinity_qc=1,
    position_qc=1
)
```

### 🔄 **Stage 3: Normalization**

```json
{
  "profile_meta": {
    "float_id": "1901910",
    "cycle_number": 1,
    "timestamp": "2023-03-15T12:30:00Z",
    "latitude": 15.5,
    "longitude": 68.2
  },
  "measurements": [
    {
      "pressure": 10.5,
      "temperature": 28.3,
      "salinity": 35.1,
      "depth": 10.7
    }
  ],
  "calibration": {...},
  "history": {...}
}
```

### 🗄️ **Stage 4: Multi-Storage Loading**

- **PostgreSQL**: Relational queries and CRUD operations
- **Parquet**: Columnar analytics and time-series analysis
- **ChromaDB**: Vector similarity search for RAG queries

---

## 🎨 Dashboard Preview

### 🗺️ **Interactive Map View**

![Map Preview](docs/images/map-preview.gif)
_Real-time buoy locations with satellite imagery_

### 📊 **Profile Analysis**

![Chart Preview](docs/images/chart-preview.png)
_Multi-parameter depth profiles with comparison tools_

### 💬 **Chat Interface**

![Chat Preview](docs/images/chat-preview.gif)
_Natural language queries with intelligent responses_

### 🌍 **3D Ocean Exploration**

![3D Preview](docs/images/3d-preview.png)
_Cesium-powered underwater visualization_

---

## 🔒 Authentication & Roles

### 👥 **User Roles**

| Role              | Permissions                         | Data Access                     |
| ----------------- | ----------------------------------- | ------------------------------- |
| **🎓 Student**    | View public datasets, basic queries | Limited to educational datasets |
| **🔬 Researcher** | Full query access, data export      | All validated datasets          |
| **👤 Admin**      | User management, system config      | Complete database access        |

### 🔐 **Security Features**

- **JWT Tokens**: Secure, stateless authentication
- **Rate Limiting**: 1000 queries/hour per user
- **Data Encryption**: TLS 1.3 for all communications
- **Audit Logging**: Complete user activity tracking

---

## 💬 Example Queries

### 🌊 **Basic Queries**

```
"Show me temperature data from the Arabian Sea"
"Compare salinity between floats 1901910 and 1902050"
"Map all buoys active in March 2023"
```

### 📊 **Advanced Analysis**

```
"Find temperature anomalies greater than 2°C in the Bay of Bengal during monsoon season"
"Show me the deepest measurements from buoy 1901910 in the last 6 months"
"Compare seasonal temperature variations between 2022 and 2023 near the equator"
```

### 🔬 **Research Queries**

```
"Identify potential upwelling zones based on temperature and salinity gradients"
"Show correlation between sea surface temperature and monsoon intensity"
"Generate a climatology report for the Indian Ocean from 2020-2023"
```

---

## 📂 Project Structure

```
SIH-FloatChat/
├── 📁 backend/
│   ├── 🐍 app/
│   │   ├── api/          # FastAPI routes
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   ├── 🔄 etl/
│   │   ├── ingestion/    # FTP downloaders
│   │   ├── processing/   # NetCDF parsers
│   │   └── validation/   # QC checks
│   └── 🧠 rag/
│       ├── embeddings/   # Vector generation
│       ├── retrieval/    # Context search
│       └── generation/   # LLM responses
├── ⚛️ frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # State management
│   │   ├── pages/        # Route components
│   │   └── services/     # API clients
│   └── public/           # Static assets
├── 📊 data/
│   ├── raw/              # Original NetCDF files
│   ├── processed/        # Normalized JSON
│   └── samples/          # Demo datasets
├── 🐳 docker/
│   ├── backend.dockerfile
│   ├── frontend.dockerfile
│   └── docker-compose.yml
├── 📚 docs/
│   ├── api/              # API documentation
│   ├── architecture/     # System design
│   └── user-guide/       # Usage tutorials
└── 🧪 tests/
    ├── backend/          # Python tests
    ├── frontend/         # React tests
    └── integration/      # E2E tests
```

---

## 🤝 Contributing

We welcome contributions from the marine research community! 🌊

### 🚀 **Getting Started**

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 📝 **Contribution Guidelines**

- Follow Python PEP 8 and React best practices
- Add tests for new features
- Update documentation for API changes
- Use conventional commits format

### 🐛 **Bug Reports**

Found a bug? Please create an issue with:

- **Environment**: OS, browser, Python version
- **Steps to reproduce**: Detailed reproduction steps
- **Expected vs Actual**: What should vs. what happened
- **Sample Data**: If related to specific datasets

### 💡 **Feature Requests**

Have ideas? We'd love to hear them! Open an issue with:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other approaches considered?

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2024 FloatChat Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

<div align="center">

### 🌊 **Built with ❤️ for Smart India Hackathon 2025**

**Team FloatChat** • Transforming Marine Research Through AI

[![GitHub stars](https://img.shields.io/github/stars/your-org/SIH-FloatChat?style=social)](https://github.com/your-org/SIH-FloatChat/stargazers)
[![Twitter Follow](https://img.shields.io/twitter/follow/FloatChatApp?style=social)](https://twitter.com/FloatChatApp)

[🌐 **Website**](https://floatchat.in) • [📧 **Contact**](mailto:team@floatchat.in) • [📱 **Demo**](https://demo.floatchat.in)

</div>
