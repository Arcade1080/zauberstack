import { IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import ErrorService from '../services/errors/ErrorService';

export const formatUserRole = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Admin';

    default:
      return 'Author';
  }
};

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
}

interface ShowNotificationProps {
  notificationType: NotificationType;
  title: string;
  message?: string;
  error?: any;
}

export const showNotification = ({
  notificationType = NotificationType.SUCCESS,
  error,
  title,
  message,
}: ShowNotificationProps) => {
  let notificationMessage = message;
  const icon =
    notificationType === NotificationType.SUCCESS ? (
      <IconCheck size="1.2rem" />
    ) : (
      <IconX size="1.2rem" />
    );

  const color = notificationType === NotificationType.SUCCESS ? 'green' : 'red';

  if (notificationType === NotificationType.ERROR) {
    const errors = ErrorService.getErrors(error);
    const { errorMessage } = errors;
    notificationMessage = errorMessage;
  }

  return notifications.show({
    title,
    message: notificationMessage,
    color,
    icon,
  });
};

export const getMediaUrl = (filePath: string | undefined | File) => {
  // Return undefined for falsy values (null, undefined, empty string)
  if (!filePath) {
    return undefined;
  }

  // If filePath is a File object, return an object URL
  if (filePath instanceof File) {
    return URL.createObjectURL(filePath);
  }

  // At this point, filePath should be a string
  // Explicitly check to be sure
  if (typeof filePath !== 'string') {
    console.error(
      'Invalid filePath type in getMediaUrl:',
      typeof filePath,
      filePath,
    );
    return undefined;
  }

  // If it's already a complete URL, return it as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // For Supabase storage paths
  const { VITE_SUPABASE_URL } = import.meta.env;
  if (VITE_SUPABASE_URL) {
    // Format: /storage/v1/object/public/media/path/to/file
    // This follows Supabase Storage's URL structure for public buckets
    return `${VITE_SUPABASE_URL}/storage/v1/object/public/media/${filePath}`;
  }

  // Fallback to the old method
  const { VITE_FILE_SERVER_URL } = import.meta.env;
  if (VITE_FILE_SERVER_URL) {
    return `${VITE_FILE_SERVER_URL}${filePath}`;
  }

  // If neither env var is available, try returning the path as is
  return filePath;
};
