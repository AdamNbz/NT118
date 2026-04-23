import { apiClient } from './apiClient';
import { NotificationItemModel, NotificationType } from '../features/Notification/notification.types';

export interface BackendNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: string | null;
  isRead: boolean;
  createdAt: string;
}

const mapBackendTypeToFrontend = (type: string): NotificationType => {
  const upperType = type?.toUpperCase();
  if (['ORDER', 'PROMO', 'NEWS', 'SYSTEM'].includes(upperType)) {
    return upperType as NotificationType;
  }
  return 'SYSTEM';
};

const getIconConfig = (type: NotificationType) => {
  switch (type) {
    case 'ORDER':
      return { iconName: 'box' as const, bgColor: '#1E293B' };
    case 'PROMO':
      return { iconName: 'tag' as const, bgColor: '#EF4444' };
    case 'NEWS':
      return { iconName: 'cpu' as const, bgColor: '#0F172A' };
    case 'SYSTEM':
    default:
      return { iconName: 'settings' as const, bgColor: '#64748B' };
  }
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffDays === 1) {
    return 'Hôm qua';
  } else if (diffDays < 7) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  } else {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }
};

/**
 * Fetch notifications from the backend
 */
export async function getNotifications(unreadOnly = false): Promise<NotificationItemModel[]> {
  try {
    const response = await apiClient.get<BackendNotification[]>('/api/notifications', {
      params: { unreadOnly }
    });

    return response.data.map(item => {
      const type = mapBackendTypeToFrontend(item.type);
      const iconConfig = getIconConfig(type);
      
      const createdAt = new Date(item.createdAt);
      const now = new Date();
      const isOlder = (now.getTime() - createdAt.getTime()) > 24 * 60 * 60 * 1000;

      return {
        id: item.id.toString(),
        type,
        title: item.title,
        description: item.message || '',
        time: formatTime(item.createdAt),
        isOlder,
        ...iconConfig,
        iconColor: '#fff',
      };
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return []; // Return empty list on error for now, or could throw
  }
}
