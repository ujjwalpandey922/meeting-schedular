/**
 * Google Calendar API integration for meeting scheduling
 * Uses OAuth2 authentication to create events in user's calendar
 */
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/config';

/**
 * POST endpoint to create a new meeting in the user's Google Calendar
 * @route POST /api/meetings
 */
export async function POST(request: Request) {
  try {
    // Get the user's session to access their OAuth token
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Extract meeting details from request body
    const { title, startTime, duration = 60 } = await request.json();
    const endTime = new Date(new Date(startTime).getTime() + duration * 60000);

    // Set up OAuth2 client with user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    // Initialize Google Calendar API with user's credentials
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
    // Prepare the calendar event
    const event = {
      summary: title,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      description: "This is a scheduled meeting.\nJoin URL: https://meet.example.com/" + Math.random().toString(36).substring(7),
    };

    console.log('Creating event with:', JSON.stringify(event, null, 2));

    // Create the event in user's primary calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',  // 'primary' refers to the user's default calendar
      requestBody: event,
      sendUpdates: 'all'      // Send email notifications to all attendees
    });
    // Check if the event was created successfully
    if(!response.data) {
      return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
    }
    // Generate a fake meeting link (this could be replaced with real meeting service integration)
    const fakeMeetLink = "https://meet.example.com/" + Math.random().toString(36).substring(7);

    return NextResponse.json({
      meetLink: fakeMeetLink
    });
  } catch (error: any) {
    console.error('Error creating meeting:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}
