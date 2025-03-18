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
import { format } from 'date-fns';

export function MeetingDashboard() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const meetings = useSelector((state: RootState) => state.meetings.meetings);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');

  const createInstantMeeting = () => {
    const meetingId = Math.random().toString(36).substring(7);
    dispatch(
      addMeeting({
        id: meetingId,
        title: 'Instant Meeting',
        startTime: new Date().toISOString(),
        meetLink: `https://meet.google.com/${meetingId}`,
        isInstant: true,
      })
    );
  };

  const createScheduledMeeting = () => {
    if (!date || !time) return;
    
    const meetingId = Math.random().toString(36).substring(7);
    const startTime = new Date(date);
    const [hours, minutes] = time.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes));

    dispatch(
      addMeeting({
        id: meetingId,
        title: 'Scheduled Meeting',
        startTime: startTime.toISOString(),
        meetLink: `https://meet.google.com/${meetingId}`,
        isInstant: false,
      })
    );
  };

  if (!session) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Instant Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={createInstantMeeting} className="w-full">
              Create Instant Meeting
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
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <Button onClick={createScheduledMeeting} className="w-full">
              Schedule Meeting
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
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{meeting.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(meeting.startTime), "PPp")}
                  </span>
                </div>
                <a
                  href={meeting.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {meeting.meetLink}
                </a>
              </div>
            ))}
            {meetings.length === 0 && (
              <p className="text-center text-muted-foreground">
                No meetings scheduled yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}