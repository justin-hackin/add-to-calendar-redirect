# Event Add-To Route Implementation

This document explains how to implement the `/event/add-to` route in your Refine.dev application.

## Overview

The Chrome extension redirects Google Calendar "Add to Calendar" links to your configured redirect URL (default: `http://localhost:3000/event/add-to`) with all the Google Calendar query parameters preserved.

## Google Calendar Parameters

Based on the [official documentation](https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/google.html), the following parameters are supported:

### Required Parameters
- `action`: Always `TEMPLATE` for the `/render` endpoint
- `text`: Event title
- `dates`: Start and end dates in format `YYYYMMDDTHHmmSSZ/YYYYMMDDTHHmmSSZ` or `YYYYMMDD/YYYYMMDD` for all-day events

### Optional Parameters
- `ctz`: Timezone (e.g., `America/New_York`)
- `details`: Event description
- `location`: Event location
- `crm`: Availability status (`AVAILABLE`, `BUSY`, `BLOCKING`)
- `trp`: Show as busy/available (`true`/`false`)
- `sprop`: Source properties (key-value pairs)
- `add`: Comma-separated email addresses for guests
- `src`: Email for shared calendar
- `recur`: RFC-5545 recurrence rule
- `vcon`: Video meeting (`meet`)

## Implementation Steps

1. **Copy the example file**: Copy `event-add-to-example.tsx` to your Refine.dev application
   - For Next.js App Router: `app/event/add-to/page.tsx`
   - For Next.js Pages Router: `pages/event/add-to.tsx`
   - For other frameworks: Adapt to your routing structure

2. **Install required dependencies** (if not already installed):
   ```bash
   npm install @refinedev/react-hook-form @refinedev/core
   ```

3. **Configure your resource**: Update the `resource` prop in `useForm` to match your events resource name in Refine.dev

4. **Customize the form**: Adjust the form fields to match your event data model

5. **Handle the create action**: Ensure your Refine.dev data provider handles the `create` action for events

## Example URL

When a user clicks a Google Calendar link, they'll be redirected to:
```
http://localhost:3000/event/add-to?action=TEMPLATE&text=Event%20Title&dates=20251204T180000%2F20251204T200000&ctz=America%2FNew_York&location=Some%20Location
```

The route handler will:
1. Parse all query parameters
2. Convert Google Calendar date format to JavaScript Date objects
3. Pre-populate the form with the parsed data
4. Allow the user to review and submit the event

## Date Format Handling

The example includes a `parseGoogleCalendarDate` function that handles:
- UTC times (with `Z` suffix)
- Local times (without `Z` suffix)
- All-day events (YYYYMMDD format)
- Timezone-aware dates (using `ctz` parameter)

## Testing

Test the route by visiting:
```
http://localhost:3000/event/add-to?action=TEMPLATE&text=Test%20Event&dates=20251204T180000Z%2F20251204T200000Z&location=Test%20Location&details=Test%20Description
```

