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

export const getMediaUrl = (filePath: string | undefined) => {
  if (!filePath) {
    return undefined;
  }
  const { VITE_FILE_SERVER_URL } = import.meta.env;
  return `${VITE_FILE_SERVER_URL}${filePath}`;
};
