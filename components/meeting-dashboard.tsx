/**
 * Meeting Dashboard Component
 * Provides UI for creating instant and scheduled meetings
 * Integrates with Google Calendar for event creation
 */
'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMeeting } from '@/lib/store/meetingsSlice';
import { RootState } from '@/lib/store/store';
import { Video, Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay, isAfter, set } from 'date-fns';
import { toast } from 'sonner';

export function MeetingDashboard() {
  // Get user session for authentication status
  const { data: session } = useSession();
  const dispatch = useDispatch();
  
  // Get meetings from Redux store
  const meetings = useSelector((state: RootState) => state.meetings.meetings);
  
  // State for scheduling meetings
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Creates a meeting by calling the API
   * @param title - Meeting title
   * @param startTime - ISO string of meeting start time
   * @returns Meeting data including meet link
   */
  const createMeeting = async (title: string, startTime: string) => {
    if (!session?.user?.email) {
      throw new Error('User must be logged in to create meetings');
    }

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          startTime,
          userEmail: session.user.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  /**
   * Creates an instant meeting for immediate use
   * Adds the meeting to Redux store on success
   */
  const createInstantMeeting = async () => {
    setIsLoading(true);
    try {
      const { meetLink } = await createMeeting(
        'Instant Meeting',
        new Date().toISOString()
      );

      dispatch(
        addMeeting({
          id: Date.now().toString(),
          title: 'Instant Meeting',
          startTime: new Date().toISOString(),
          meetLink: meetLink || '',
          isInstant: true,
        })
      );
      toast.success('Instant meeting created successfully!', {
        description: 'Click the link to join the meeting.',
      });
    } catch (error) {
      toast.error('Failed to create meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Creates a scheduled meeting for a future time
   * Validates date/time and adds meeting to Redux store on success
   */
  const createScheduledMeeting = async () => {
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    // Validate that meeting is not scheduled in the past
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const selectedDateTime = set(new Date(date), { hours, minutes });

    if (isSameDay(selectedDateTime, now) && isAfter(now, selectedDateTime)) {
      toast.error('Cannot schedule a meeting in the past');
      return;
    }

    setIsLoading(true);
    try {
      const { meetLink } = await createMeeting(
        'Scheduled Meeting',
        selectedDateTime.toISOString()
      );

      dispatch(
        addMeeting({
          id: Date.now().toString(),
          title: 'Scheduled Meeting',
          startTime: selectedDateTime.toISOString(),
          meetLink: meetLink || '',
          isInstant: false,
        })
      );
      toast.success('Meeting scheduled successfully!');
      // Reset form
      setDate(new Date());
      setTime('');
    } catch (error) {
      toast.error('Failed to schedule meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Returns the minimum time for scheduling a meeting
   * If today's date is selected, returns the current time
   * Otherwise, returns 00:00
   */
  const getMinTime = () => {
    if (!date) return '00:00';
    const now = new Date();
    if (isSameDay(date, now)) {
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '00:00';
  };

  if (!session) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl space-y-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Instant Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={createInstantMeeting} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Instant Meeting'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Schedule Meeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full p-2"
                  fromDate={new Date()}
                />
              </div>
              <div className="w-full">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={time}
                  min={getMinTime()}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <Button 
              onClick={createScheduledMeeting} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex flex-col space-y-2 p-4 border rounded-lg"
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <h3 className="font-semibold">{meeting.title}</h3>
                  <span className="text-sm text-gray-600">
                    {format(new Date(meeting.startTime), 'PPp')}
                  </span>
                </div>
                <a
                  href={meeting.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Join Meeting
                </a>
              </div>
            ))}
            {meetings.length === 0 && (
              <p className="text-center text-gray-500">
                No meetings scheduled yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
