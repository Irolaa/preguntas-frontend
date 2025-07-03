import { useEffect } from 'react';
import { useNotificationHandler } from '../../hooks/notificationHandler';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './styles.css';


toastr.options = {
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  progressBar: true,
  closeButton: true,
  newestOnTop: true,
  showDuration: 300,
  hideDuration: 600,
  timeOut: 5000,
  extendedTimeOut: 2000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
  tapToDismiss: false,
  closeDuration: 300
};

type NotificationType = 'error' | 'success' | 'warning' | 'info';

interface Notification {
  type: NotificationType;
  message: string;
  title?: string;
}

export const NotificationListener = () => {
  const { notification: notif, clearNotification } = useNotificationHandler() as {
    notification: Notification | null;
    clearNotification: () => void;
  };

  useEffect(() => {
    if (notif?.message) {
      const { type, message, title = '' } = notif;
      
      const messageHtml = `
        <div class="custom-notification-content">
          <div class="notification-icon ${type}"></div>
          <div class="notification-text">
            ${title ? `<div class="notification-title">${title}</div>` : ''}
            <div class="notification-message">${message}</div>
          </div>
        </div>
      `;

      toastr.clear();

      const options = {
        escapeHtml: false,
        timeOut: type === 'error' ? 5000 : 3000,
        extendedTimeOut: 2000
      };

      switch(type) {
        case 'error':
          toastr.error(messageHtml, '', options);
          break;
        case 'success':
          toastr.success(messageHtml, '', options);
          break;
        case 'warning':
          toastr.warning(messageHtml, '', options);
          break;
        case 'info':
          toastr.info(messageHtml, '', options);
          break;
      }

      setTimeout(clearNotification, 100);
    }
  }, [notif, clearNotification]);

  return null;
};