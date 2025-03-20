/**
 * Home Page Component
 * Main landing page of the Meeting Scheduler application
 * Displays login button and meeting dashboard
 */
import { LoginButton } from '@/components/login-button';
import { MeetingDashboard } from '@/components/meeting-dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page structure: main container */}
      <main className="container mx-auto px-4 py-8">
        {/* Page structure: centered content container */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Application title */}
          <h1 className="text-4xl font-bold text-center">Meeting Scheduler</h1>
          
          {/* Authentication component: handles user login */}
          <LoginButton />
          
          {/* Main dashboard component: displays meeting information */}
          <MeetingDashboard />
        </div>
      </main>
    </div>
  );
}