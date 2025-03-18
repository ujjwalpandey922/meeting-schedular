import { LoginButton } from '@/components/login-button';
import { MeetingDashboard } from '@/components/meeting-dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-4xl font-bold text-center">Meeting Scheduler</h1>
          <LoginButton />
          <MeetingDashboard />
        </div>
      </main>
    </div>
  );
}