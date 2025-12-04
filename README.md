# Calendar Chooser Extension

A Chrome extension that intercepts Google Calendar "Add to Calendar" links and redirects them to a configurable handler URL with all query parameters preserved.

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
