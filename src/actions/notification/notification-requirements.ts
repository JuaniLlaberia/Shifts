export const notificationDataRequirements = {
  // ## REQUESTS ##
  // Vacations
  REQUEST_VACATION_APPROVED: ['startDate', 'endDate'],
  REQUEST_VACATION_REJECTED: ['startDate', 'endDate'],
  // Shift swap
  REQUEST_SHIFT_SWAP_APPROVED: ['shiftDate'],
  REQUEST_SHIFT_SWAP_REJECTED: ['shiftDate'],
  // Unavailable
  REQUEST_UNAVAILABLE_APPROVED: ['date'],
  REQUEST_UNAVAILABLE_REJECTED: ['date'],

  // ## SHIFTS ##
  // Published
  SHIFT_PUBLISHED_SINGLE: ['date'],
  SHIFT_PUBLISHED_MULTIPLE: ['count', 'startDate', 'endDate'],
  // Modified
  SHIFT_MODIFIED_SINGLE: ['date'],
  SHIFT_MODIFIED_MULTIPLE: ['count'],
  // Deleted
  SHIFT_DELETED_SINGLE: [],
  SHIFT_DELETED_MULTIPLE: [],

  // ## EVENTS ##
  EVENT_CREATED: ['eventName', 'eventDate'],
  EVENT_UPDATED: ['eventName', 'eventDate'],
  EVENT_CANCELED: ['eventName', 'eventDate'],

  // # GENERAL ##
  GENERAL_MESSAGE: ['message'],
};
