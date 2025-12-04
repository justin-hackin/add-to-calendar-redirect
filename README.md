# Calendar Chooser Extension

A Chrome extension that intercepts Google Calendar "Add to Calendar" links and redirects them to a configurable handler URL with all query parameters preserved.

## Why This Extension Exists

Many websites offer "Add to Calendar" links that redirect users to Google Calendar. However, if you're building your own event management web application, you want these links to go to your app instead. This extension bridges that gap by intercepting Google Calendar links and redirecting them to your custom handler, allowing you to build a centralized event management system.

## How It Works

**Build Your Own Event Management System**

This extension enables you to create a custom web application for managing events. Instead of events being added directly to Google Calendar, they're redirected to your application where you can:

- Store events in your own database
- Apply custom business logic
- Integrate with your existing systems
- Provide a unified event management interface
- Add events from any website that uses Google Calendar links

**How It Works with "Add to Calendar" Links**

1. **User clicks "Add to Calendar"** on any website (event listings, booking systems, etc.)
2. **Extension intercepts** the Google Calendar link before it loads
3. **Extracts all event data** (title, date, time, location, description, etc.)
4. **Redirects to your web app** with all parameters preserved
5. **Your app receives the event data** and can process it however you need

## Features

- Intercepts Google Calendar `calendar.google.com/calendar/render?action=TEMPLATE` links
- Redirects to a configurable handler URL (default: `http://localhost:3000/event/add-to`)
- Preserves all Google Calendar query parameters in the redirect
- Enable/disable toggle in settings
- Accessible settings page via extension icon context menu

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension directory

## Configuration

1. Right-click the extension icon → "Open Settings"
2. Configure your redirect URL (e.g., `http://localhost:3000/event/add-to`)
3. Toggle the extension on/off as needed

## How It Works

When a user clicks a Google Calendar "Add to Calendar" link:

1. The extension intercepts the navigation using `webNavigation.onBeforeNavigate`
2. Extracts all query parameters from the Google Calendar URL
3. Redirects to your configured handler URL with all parameters preserved

## Google Calendar Parameters

The extension supports all Google Calendar parameters as documented in the [official documentation](https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/google.html):

- `action`: TEMPLATE (required)
- `text`: Event title
- `dates`: Start and end dates
- `ctz`: Timezone
- `details`: Event description
- `location`: Event location
- `crm`: Availability status (AVAILABLE, BUSY, BLOCKING)
- `add`: Comma-separated guest emails
- And more...

## Files

- `background.js`: Main extension logic, handles redirects
- `settings.html/js`: Settings page for configuration
- `manifest.json`: Extension manifest
- `icons/`: Extension icons

## License

MIT
