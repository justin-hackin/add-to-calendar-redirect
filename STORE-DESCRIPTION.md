# Chrome Web Store Description

## Short Description (132 characters max)
Redirects Google Calendar "Add to Calendar" links to your custom event handler, enabling you to build your own event management system.

## Full Description

### Why This Extension Exists

Many websites offer "Add to Calendar" links that redirect users to Google Calendar. However, if you're building your own event management web application, you want these links to go to your app instead. This extension bridges that gap by intercepting Google Calendar links and redirecting them to your custom handler, allowing you to build a centralized event management system.

### How It Works

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

### Use Cases

- **Event Management Platforms**: Build a custom event management system that captures events from multiple sources
- **Booking Systems**: Redirect calendar events to your booking/CRM system
- **Internal Tools**: Create company-specific event handling workflows
- **Development/Testing**: Test event handling in your local development environment
- **Custom Integrations**: Integrate calendar events with your existing business systems

### Features

- ✅ Intercepts Google Calendar "Add to Calendar" links automatically
- ✅ Preserves all event parameters (title, dates, location, description, guests, etc.)
- ✅ Configurable redirect URL (point to your local dev server or production app)
- ✅ Enable/disable toggle for easy control
- ✅ No data collection - everything happens locally in your browser
- ✅ Works with any website that uses Google Calendar links

### Setup

1. Install the extension
2. Right-click the extension icon → "Open Settings"
3. Configure your redirect URL (e.g., `http://localhost:3000/event/add-to` or `https://yourapp.com/events/add`)
4. Toggle the extension on

### Technical Details

The extension uses Chrome's webNavigation API to intercept Google Calendar links (`calendar.google.com/calendar/render?action=TEMPLATE`) and redirects them to your configured handler URL with all query parameters preserved. This allows your web application to receive and process the event data using the same parameters that Google Calendar would receive.

### Privacy

This extension operates entirely locally in your browser. It does not collect, store, or transmit any data to external servers. Your settings (redirect URL and enabled/disabled state) are stored locally using Chrome's sync storage. All redirects go directly to the URL you configure.

### Open Source

This extension is open source. View the code, contribute, or report issues on GitHub.

