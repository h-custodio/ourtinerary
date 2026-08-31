import { Activity } from "@/types/activity";
import { isValid } from "date-fns";

export const formatDateToInput = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseInputToDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

enum TimeValidationMessage {
  TOO_SHORT = "Time interval is too short",
  INVALID_START_END = "Starting time and ending time must be within 00:00 and 23:59",
  START_AFTER_EQUAL_END = "Starting time cannot be after ending time",
  OVERLAP = "Time interval overlaps with another",
  VALID = "Time interval is valid",
}

type TimeValidation = {
  isValid: boolean,
  message: TimeValidationMessage;
}

export const validateTimeInterval = (
  activities: Activity[],
  startTime: string,
  endTime: string,
  activityIdToIgnore?: string
): TimeValidation => {
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  // must be within 00:00 - 23:59
  if (
    newStart < 0 ||
    newStart > 1439 || 
    newEnd < 0 ||
    newEnd > 1439
  ) {
    return {
      isValid: false,
      message: TimeValidationMessage.INVALID_START_END
    }
  }

  // starting time must be before end
  if (newStart >= newEnd) {
    return {
      isValid: false,
      message: TimeValidationMessage.START_AFTER_EQUAL_END
    };
  }

  // minimum time interval is 15 minutes for UI scaling purposes
  if (newEnd - newStart < 15) {
    return {
      isValid: false,
      message: TimeValidationMessage.TOO_SHORT
    };
  }

  const hasOverlap = activities.some((activity) => {
    // Ignore the activity currently being updated
    if (activity.activity_id === activityIdToIgnore) {
      return false;
    }

    const existingStart = timeToMinutes(activity.start_time);
    const existingEnd = timeToMinutes(activity.end_time);

    // Intervals overlap if they share any actual time
    return newStart <= existingEnd && newEnd >= existingStart;
  });

  if (hasOverlap) {
    return {
      isValid: false,
      message: TimeValidationMessage.OVERLAP
    };
  }

  return {
    isValid: true,
    message: TimeValidationMessage.VALID
  }
};
