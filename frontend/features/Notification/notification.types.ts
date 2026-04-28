import { Feather } from '@expo/vector-icons';
import { BackendNotification } from '@/lib/notificationApi';

export type NotificationType = 'ORDER' | 'PROMO' | 'NEWS' | 'SYSTEM';

export interface NotificationItemModel {
  id: string;
  backendId: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  isOlder: boolean;
  rawData?: string | null;
  statusText?: string;
  hasCTA?: boolean;
  iconName?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  bgColor?: string;
}

export interface TabModel {
  id: NotificationType | 'ALL';
  label: string;
}

// ── Backend type → UI type mapping ──────────────────────────────────
const TYPE_MAP: Record<string, NotificationType> = {
  order_success: 'ORDER',
  order_cancelled: 'ORDER',
  order_shipping: 'ORDER',
  order_delivered: 'ORDER',
  order: 'ORDER',
  message: 'ORDER',
  promo: 'PROMO',
  voucher: 'PROMO',
  news: 'NEWS',
  system: 'SYSTEM',
};

function mapType(backendType: string): NotificationType {
  const lower = backendType.toLowerCase();
  for (const [key, val] of Object.entries(TYPE_MAP)) {
    if (lower.includes(key)) return val;
  }
  return 'SYSTEM';
}

// ── Icon/color config per UI type ───────────────────────────────────
type IconConfig = { iconName: keyof typeof Feather.glyphMap; iconColor: string; bgColor: string };

const TYPE_STYLE: Record<NotificationType, IconConfig> = {
  ORDER:  { iconName: 'box',          iconColor: '#fff', bgColor: '#1E293B' },
  PROMO:  { iconName: 'tag',          iconColor: '#fff', bgColor: '#EF4444' },
  NEWS:   { iconName: 'cpu',          iconColor: '#fff', bgColor: '#0F172A' },
  SYSTEM: { iconName: 'settings',     iconColor: '#fff', bgColor: '#64748B' },
};

// ── Status text from backend type ──────────────────────────────────
function statusTextFromType(backendType: string): string | undefined {
  const lower = backendType.toLowerCase();
  if (lower.includes('order_success')) return 'ĐẶT HÀNG THÀNH CÔNG';
  if (lower.includes('order_delivered')) return 'GIAO HÀNG THÀNH CÔNG';
  if (lower.includes('order_cancelled')) return 'ĐÃ HỦY';
  if (lower.includes('order_shipping')) return 'ĐANG GIAO HÀNG';
  if (lower.includes('payment_success')) return 'THANH TOÁN THÀNH CÔNG';
  if (lower.includes('payment_pending')) return 'CHỜ THANH TOÁN';
  return undefined;
}

// ── Time formatting ─────────────────────────────────────────────────
function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHr < 24) return `${diffHr} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  } catch {
    return dateStr;
  }
}

function isOlder(dateStr: string): boolean {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    return diffMs > 86400000; // > 24h
  } catch {
    return false;
  }
}

// ── Convert backend notification → UI model ─────────────────────────
export function toNotificationItem(n: BackendNotification): NotificationItemModel {
  const uiType = mapType(n.type);
  const style = TYPE_STYLE[uiType];
  return {
    id: String(n.id),
    backendId: n.id,
    type: uiType,
    title: n.title,
    description: n.message || '',
    time: formatTime(n.createdAt),
    isRead: n.isRead,
    isOlder: isOlder(n.createdAt),
    statusText: statusTextFromType(n.type),
    rawData: n.data,
    hasCTA: uiType === 'PROMO',
    ...style,
  };
}

export const TABS: TabModel[] = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'ORDER', label: 'Cập nhật đơn hàng' },
  { id: 'PROMO', label: 'Khuyến mãi' },
  { id: 'NEWS', label: 'Tin tức' },
  { id: 'SYSTEM', label: 'Hệ thống' },
];
