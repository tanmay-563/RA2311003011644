# 📢 Priority Notifications System

This project implements a **priority-based notification system** with a centralized logging middleware.  
It fetches notifications from an authenticated API, processes them based on defined priority rules, and ensures all major operations are logged properly.

---

## 🚀 Features

- 🔐 **Authenticated API Integration**
  - Secure registration and token-based authentication

- 📊 **Priority-Based Sorting**
  - Placement > Result > Event
  - Latest notifications first within each category

- 🧩 **Logging Middleware**
  - Centralized logging across all layers
  - Logs API calls, errors, and processing steps

- 🏗️ **Modular Architecture**
  - Clean separation of services, utilities, and middleware

---

## 🧠 Priority Logic

Notifications are sorted based on:

1. **Type Priority**
   ```
   Placement > Result > Event
   ```

2. **Recency**
   - Newer notifications appear first within the same type

---

## 🛠️ Tech Stack

- Node.js  
- JavaScript (ES Modules)  
- REST APIs  
- Custom Logging Middleware  

---

## 📂 Project Structure

```
src/
├── middleware/     # Logging middleware
├── services/       # API + authentication logic
├── utils/          # Sorting and helper functions
├── storage/        # Local auth state handling
├── config.js       # Configuration & environment setup
├── index.js        # Entry point
```

---

## ⚙️ Setup & Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
email=your_email
name=your_name
mobileNo=your_mobile_number
githubUsername=your_github_username
rollNo=your_roll_number
accessCode=Qk####   # Replace with your actual access code
```

### 3. Run the application

```bash
node src/index.js
```

---

## 📌 Notes

- Notifications are fetched dynamically from the API (no hardcoding)
- The number of notifications returned depends on API defaults
- Logging is implemented as per evaluation requirements using middleware

---

## 🔍 Key Focus Areas

- Clean and modular code structure  
- Proper API integration and authentication flow  
- Consistent use of logging middleware  
- Correct implementation of priority-based sorting  

---

## 📈 Possible Improvements

- Add pagination and filtering support via API parameters  
- Build a frontend dashboard for visualization  
- Extend logging with monitoring/analytics features  

---

## 🙌 Conclusion

This project focuses on implementing a structured, real-world system involving API integration, middleware design, and priority-based data processing while maintaining clean and maintainable code.
