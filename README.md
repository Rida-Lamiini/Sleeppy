# Sleep Tracking App

## Overview
The **Sleep Tracking App** is designed to help university students improve their sleep quality by providing tools to track sleep, set goals, and receive reminders. The app integrates with **Supabase** for data management and **Kinde** for authentication, ensuring a seamless and secure user experience.

---

## Features
1. **Sleep Tracking**:
   - Log sleep duration and quality.
   - View daily and weekly sleep statistics.
2. **Goal Setting**:
   - Set personalized sleep goals (e.g., bedtime and wake-up time).
   - Track progress toward achieving goals.
3. **Reminders**:
   - Receive recurring notifications for bedtime and wake-up.
   - Customize reminder times and frequency.
4. **Sleep Analysis**:
   - View detailed sleep patterns and trends.
   - Download sleep reports in PDF format.
5. **Meditation**:
   - Access guided meditation sessions to relax and improve sleep.
6. **Profile and Settings**:
   - Update profile information (e.g., name, email, profile picture).
   - Customize app settings (e.g., dark mode, notification preferences).

---

## Technologies Used
- **Frontend**: React Native, Expo
- **Backend**: Supabase (Database and Authentication)
- **Authentication**: Kinde
- **Notifications**: Expo Notifications
- **Charts and Graphs**: React Native Chart Kit
- **PDF Generation**: React Native PDF Library

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (install with `npm install -g expo-cli`)
- Supabase account (for database and authentication)
- Kinde account (for social login integration)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sleep-tracking-app.git
   cd sleep-tracking-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   KINDE_CLIENT_ID=your-kinde-client-id
   KINDE_CLIENT_SECRET=your-kinde-client-secret
   ```

4. Start the development server:
   ```bash
   expo start
   ```
   - Scan the QR code with the **Expo Go** app (available on iOS and Android) to run the app on your device.

---

## Usage

### Sign Up/Log In:
- Create an account or log in using email/password or social login (Google/Facebook).

### Set Sleep Goals:
- Navigate to the **Goals** screen and set your desired bedtime and wake-up time.

### Track Sleep:
- Log your sleep duration and quality on the **Sleep Tracking** screen.

### View Sleep History:
- Check your sleep statistics and trends on the **Sleep History** screen.

### Receive Reminders:
- Set reminders for bedtime and wake-up on the **Reminders** screen.

### Explore Meditation:
- Access guided meditation sessions on the **Meditation** screen.

### Customize Profile:
- Update your profile and app settings on the **Profile** screen.

---

