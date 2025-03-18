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

const generateMeetingCode = () => {
  // Google Meet codes are typically 3 groups of 4 lowercase letters
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const groups = Array(3)
    .fill(0)
    .map(() =>
      Array(4)
        .fill(0)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('')
    );
  return groups.join('-');
};

export function MeetingDashboard() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const meetings = useSelector((state: RootState) => state.meetings.meetings);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');

  const createInstantMeeting = () => {
    const meetingCode = generateMeetingCode();
    dispatch(
      addMeeting({
        id: meetingCode,
        title: 'Instant Meeting',
        startTime: new Date().toISOString(),
        meetLink: `https://meet.google.com/${meetingCode}`,
        isInstant: true,
      })
    );
  };

  const createScheduledMeeting = () => {
    if (!date || !time) return;

    const meetingCode = generateMeetingCode();
    const startTime = new Date(date);
    const [hours, minutes] = time.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes));

    dispatch(
      addMeeting({
        id: meetingCode,
        title: 'Scheduled Meeting',
        startTime: startTime.toISOString(),
        meetLink: `https://meet.google.com/${meetingCode}`,
        isInstant: false,
      })
    );
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
                  min={new Date().toISOString().slice(11, 16)}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
              </div>
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
                  className="text-blue-600 hover:underline break-all"
                >
                  {meeting.meetLink}
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
