/**
 * Example Refine.dev route handler for /event/add-to
 * 
 * This file should be placed in your Refine.dev application, not in the Chrome extension.
 * Place it in your app router (e.g., app/event/add-to/page.tsx for Next.js App Router)
 * or pages/event/add-to.tsx for Next.js Pages Router
 */

import { useRouter, useSearchParams } from "next/navigation"; // or "next/router" for Pages Router
import { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useCreate } from "@refinedev/core";

interface GoogleCalendarParams {
  action?: string; // TEMPLATE (required for /render endpoint)
  text?: string; // Event title
  dates?: string; // Format: YYYYMMDDTHHmmSSZ/YYYYMMDDTHHmmSSZ or YYYYMMDDTHHmmSS/YYYYMMDDTHHmmSS
  ctz?: string; // Timezone (e.g., America/New_York)
  details?: string; // Event description
  location?: string; // Event location
  crm?: "AVAILABLE" | "BUSY" | "BLOCKING"; // Free/Busy status
  trp?: "true" | "false"; // Show as busy/available
  sprop?: string; // Source properties (key-value pairs)
  add?: string; // Comma-separated email addresses for guests
  src?: string; // Email for shared calendar
  recur?: string; // RFC-5545 recurrence rule
  vcon?: "meet"; // Video meeting link
}

// Parse Google Calendar date format
function parseGoogleCalendarDate(dateStr: string): Date | null {
  try {
    // Format: YYYYMMDDTHHmmSSZ or YYYYMMDDTHHmmSS or YYYYMMDD
    if (dateStr.length === 8) {
      // All-day event: YYYYMMDD
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(dateStr.substring(6, 8));
      return new Date(year, month, day);
    } else if (dateStr.includes("T")) {
      // Has time component
      const datePart = dateStr.substring(0, 8);
      const timePart = dateStr.substring(9);
      const year = parseInt(datePart.substring(0, 4));
      const month = parseInt(datePart.substring(4, 6)) - 1;
      const day = parseInt(datePart.substring(6, 8));
      
      if (timePart.endsWith("Z")) {
        // UTC timezone
        const hour = parseInt(timePart.substring(0, 2));
        const minute = parseInt(timePart.substring(2, 4));
        const second = parseInt(timePart.substring(4, 6));
        return new Date(Date.UTC(year, month, day, hour, minute, second));
      } else {
        // Local timezone (no Z)
        const hour = parseInt(timePart.substring(0, 2));
        const minute = parseInt(timePart.substring(2, 4));
        const second = parseInt(timePart.substring(4, 6));
        return new Date(year, month, day, hour, minute, second);
      }
    }
    return null;
  } catch (e) {
    console.error("Error parsing date:", e);
    return null;
  }
}

// Parse dates parameter (format: start/end)
function parseDates(datesStr: string): { start: Date | null; end: Date | null; isAllDay: boolean } {
  const [startStr, endStr] = datesStr.split("/");
  const start = parseGoogleCalendarDate(startStr);
  const end = endStr ? parseGoogleCalendarDate(endStr) : null;
  const isAllDay = startStr.length === 8; // All-day events are YYYYMMDD format
  
  return { start, end, isAllDay };
}

export default function EventAddToPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [params, setParams] = useState<GoogleCalendarParams>({});
  const [parsedDates, setParsedDates] = useState<{ start: Date | null; end: Date | null; isAllDay: boolean }>({
    start: null,
    end: null,
    isAllDay: false,
  });

  // Parse query parameters on mount
  useEffect(() => {
    const googleParams: GoogleCalendarParams = {};
    
    // Extract all Google Calendar parameters
    searchParams.forEach((value, key) => {
      (googleParams as any)[key] = value;
    });
    
    setParams(googleParams);
    
    // Parse dates if provided
    if (googleParams.dates) {
      const dates = parseDates(googleParams.dates);
      setParsedDates(dates);
    }
  }, [searchParams]);

  // Refine form setup
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    refineCoreProps: {
      resource: "events", // Adjust to your resource name
      action: "create",
    },
  });

  // Pre-populate form fields when params are loaded
  useEffect(() => {
    if (params.text) {
      setValue("title", params.text);
    }
    if (params.details) {
      setValue("description", params.details);
    }
    if (params.location) {
      setValue("location", params.location);
    }
    if (parsedDates.start) {
      setValue("startDate", parsedDates.start.toISOString());
    }
    if (parsedDates.end) {
      setValue("endDate", parsedDates.end.toISOString());
    }
    if (parsedDates.isAllDay) {
      setValue("isAllDay", true);
    }
    if (params.ctz) {
      setValue("timezone", params.ctz);
    }
    if (params.add) {
      // Parse comma-separated emails
      const guests = params.add.split(",").map((email) => email.trim());
      setValue("guests", guests);
    }
    if (params.crm) {
      setValue("availability", params.crm);
    }
    if (params.vcon === "meet") {
      setValue("addVideoMeeting", true);
    }
  }, [params, parsedDates, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await onFinish(data);
      // Redirect to success page or calendar view
      router.push("/calendar");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>Add Event to Calendar</h1>
      
      {params.text && (
        <div style={{ marginBottom: "20px", padding: "10px", background: "#f0f0f0", borderRadius: "4px" }}>
          <p><strong>Pre-filled from Google Calendar link:</strong></p>
          <p><strong>Title:</strong> {params.text}</p>
          {params.details && <p><strong>Description:</strong> {params.details}</p>}
          {params.location && <p><strong>Location:</strong> {params.location}</p>}
          {parsedDates.start && (
            <p><strong>Start:</strong> {parsedDates.start.toLocaleString()}</p>
          )}
          {parsedDates.end && (
            <p><strong>End:</strong> {parsedDates.end.toLocaleString()}</p>
          )}
          {parsedDates.isAllDay && <p><em>All-day event</em></p>}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="title">Event Title *</label>
          <input
            id="title"
            type="text"
            {...register("title", { required: true })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
          {errors.title && <span style={{ color: "red" }}>Title is required</span>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            {...register("location")}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="startDate">Start Date/Time *</label>
          <input
            id="startDate"
            type="datetime-local"
            {...register("startDate", { required: true })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
          {errors.startDate && <span style={{ color: "red" }}>Start date is required</span>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="endDate">End Date/Time *</label>
          <input
            id="endDate"
            type="datetime-local"
            {...register("endDate", { required: true })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
          {errors.endDate && <span style={{ color: "red" }}>End date is required</span>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="checkbox"
              {...register("isAllDay")}
              style={{ marginRight: "5px" }}
            />
            All-day event
          </label>
        </div>

        {params.add && (
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="guests">Guests</label>
            <input
              id="guests"
              type="text"
              {...register("guests")}
              placeholder="Comma-separated email addresses"
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="availability">Availability</label>
          <select
            id="availability"
            {...register("availability")}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="">Default</option>
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="BLOCKING">Out of Office</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="checkbox"
              {...register("addVideoMeeting")}
              style={{ marginRight: "5px" }}
            />
            Add video meeting link
          </label>
        </div>

        <button
          type="submit"
          disabled={formLoading}
          style={{
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: formLoading ? "not-allowed" : "pointer",
          }}
        >
          {formLoading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

