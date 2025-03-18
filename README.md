# Google Meet Link Generator

## Overview

This project is a simple web application that allows users to authenticate via Google SSO using NextAuth.js, generate an instant Google Meet link, and schedule a meeting for a future date/time. The application is built using Next.js, shadcn/tailwind for styling, and Redux for state management. No database integration is required, and meeting details are displayed directly on the UI.

## Features

- **User Authentication**: Integrates Google SSO using NextAuth.js. Only authenticated users can access meeting creation features.
- **Instant Meeting**: Users can generate a Google Meet link immediately and view the link and basic meeting information on the page.
- **Scheduled Meeting**: Users can input a future date and time to generate a Google Meet link associated with the provided schedule. The link and scheduled time are displayed on the page.
- **Basic UI**: A single-page UI that clearly distinguishes between instant and scheduled meeting options with minimal form validation.

## Technologies Used

- **Frontend**: React, Next.js, shadcn/tailwind for styling, Redux for state management.
- **Backend**: Next.js API routes.
- **Authentication**: NextAuth.js for Google SSO.
- **Deployment**: Vercel or Netlify.
- **Development Tools**: AI code editors (e.g., GitHub Copilot, Cursor AI), Git for version control.

## Setup Instructions

### Prerequisites

- Node.js installed on your machine.
- A Google Cloud Platform (GCP) account with OAuth credentials set up.
- A Vercel or Netlify account for deployment.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/google-meet-link-generator.git
   cd google-meet-link-generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```  

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Visit http://localhost:3000 in your browser.

## Deployment

### Deploy to Vercel

1. Install the Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Deploy the application:
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Push your code to a Git repository.
2. Connect the repository to Netlify and deploy.

## Architectural Decisions

- **Next.js**: Chosen for its seamless integration of frontend and backend, making it ideal for full-stack applications.
- **NextAuth.js**: Simplifies the integration of Google SSO, providing a secure and easy-to-implement authentication solution.
- **Redux**: Used for state management to handle the meeting link generation and scheduling logic.
- **shadcn/tailwind**: Provides a utility-first CSS framework for rapid UI development with minimal custom CSS.
- **No Database**: Since the application does not require persistent storage, meeting details are generated and displayed directly on the UI without the need for a database.

## Limitations

- **No Persistent Storage**: Meeting details are not stored and will be lost upon page refresh.
- **Basic UI**: The UI is kept minimal to focus on core functionality, which may not be suitable for production-level applications.
- **Simulated Google Meet Links**: The application generates simulated Google Meet links and does not integrate with the actual Google Meet API.

## Future Enhancements

- Integrate with the Google Calendar API to create actual calendar events and Google Meet links.
- Add persistent storage using a database to save meeting details.
- Enhance the UI with more features and better user experience.
