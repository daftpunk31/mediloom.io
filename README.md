# 🏥 Mediloom.io

**Mediloom.io** is a real-time, integrated healthcare management platform designed to address the inefficiencies of fragmented hospital systems. It enables secure EHR centralization, efficient resource allocation, and predictive healthcare planning using modern technologies like blockchain, machine learning, and Kafka.

---

## 🚀 Features

- **Centralized Patient Records**  
  Unified access to EHRs from multiple hospitals and centers.

- **Secure Access with Blockchain**  
  Tamper-proof record storage and OTP-based authentication (via WhatsApp).

- **Real-Time Bed Allocation**  
  Dynamic queueing model to manage bed occupancy efficiently.

- **Predictive Patient Inflow**  
  Machine learning models forecast patient volume for proactive planning.

- **Real-Time Dashboards**  
  Live visualization of hospital data and trends via Grafana.

- **Patient Empowerment**  
  Patients can securely access their medical records anytime, anywhere.

---

## 📦 Tech Stack

- **Frontend:** HTML, CSS, JavaScript, EJS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Real-Time Data:** Apache Kafka  
- **Security:** Blockchain, bcrypt, WhatsApp OTP  
- **Visualization:** Grafana  
- **ML Models:** Python (for predictive analytics)

---

## 📁 Project Structure

mediloom.io/
|----main/
| |----api_services/
| |----controller/
| |----dao/
| |----middleware/
| |----postgres_db_config/ | |----redis_db_config/
| |----routes/
| |----service/
| |----views/ |----node_modules/ |----tailwindcss4/
| |----dist/
| | |----assets/
| | |----index.html
| |----node_modules/
| |----src/
| | |----assets/
| | |----components/
| | |----pages/
| | |----App.jsx
| | |----index.css
| | |----main.jsx
| | |----urlConfig.js
| |----.gitignore
| |----eslint.config.js
| |----index.html
| |----package-lock.json
| |----package.json
| |----readme.md
| |----vite.config.js
|----.env 
|----.gitignore
|----App.js
|----package-lock.json
|----package.json


## 🛠️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mediloom.io.git
   cd mediloom.io
2) Install Dependencies by performing "npm i" in main/, tailwindcss4/ and blockchain/.
3) Environment varibales have not been pushed so change yours accordingly.
4) Run the file in two different terminals: one in the main folder (perform nodemon app.js) and the other in the tailwindcss4 terminal (perform npm run dev).
5) Done! you are now using the mediloom.io!
