import { DateTime } from 'luxon';

export default class DateService {
  static getReadableDate(dateOrDateTime: string): string {
    const dateTime = DateTime.fromISO(dateOrDateTime);
    return dateTime.toFormat('dd.MM.yyyy');
  }

  static getReadableDateTime(timeOrDate: string): string {
    const dateTime = DateTime.fromISO(timeOrDate);
    return `${dateTime.toFormat('dd.MM.yyyy, HH:mm')} Uhr`;
  }

  static getReadableTime(timeOrDateTime: string): string {
    const dateTime = DateTime.fromISO(timeOrDateTime);
    return `${dateTime.toFormat('HH:mm')} Uhr`;
  }

  static toISOString(date: string): string | null {
    const dateTime = DateTime.fromISO(date);
    return dateTime.toISO();
  }

  static getReadableDateWithMonthName(dateOrDateTime: string): string {
    const dateTime = DateTime.fromISO(dateOrDateTime);
    return dateTime.toFormat('d.MM.yyyy');
  }

  static getReadableDateTimeWithMonthName(dateOrDateTime: string): string {
    return this.getReadableDateWithMonthName(dateOrDateTime);
  }

  static getReadableDateTimeInNearPast(dateTime: string): string {
    const dateTimeValue = DateTime.fromISO(dateTime);
    const currentDateTime = DateTime.now();
    const diff = Math.floor(
      currentDateTime.diff(dateTimeValue, 'hours').as('hours'),
    );

    if (dateTimeValue.hasSame(currentDateTime, 'day')) {
      if (diff < 1) {
        const minutesDiff = Math.floor(
          currentDateTime.diff(dateTimeValue, 'minutes').minutes,
        );
        return ` ${minutesDiff} m ago`;
      }
      return ` ${diff} h ago`;
    }
    if (dateTimeValue.hasSame(currentDateTime.minus({ days: 1 }), 'day')) {
      return 'Yesterday';
    }
    if (dateTimeValue.hasSame(currentDateTime.minus({ days: 2 }), 'day')) {
      return '2 d ago';
    }
    return this.getReadableDateWithMonthName(dateTime);
  }
}
