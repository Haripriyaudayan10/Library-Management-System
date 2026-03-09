import { useEffect, useMemo, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import NotificationCard from '../../components/common/NotificationCard';
import { Button } from '../../components/ui/Button';
import {
  getMemberNotifications,
  type MemberNotificationItem,
} from '../../services/memberNotificationService';

interface Props {
  onClose: () => void;
}

export default function Notifications({ onClose }: Props) {
  const [notifications, setNotifications] = useState<MemberNotificationItem[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getMemberNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications', error);
      }
    };
    void loadNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const toMeta = (createdAt: string): string => {
    const created = new Date(createdAt);
    if (Number.isNaN(created.getTime())) return '-';
    const diffMs = Date.now() - created.getTime();
    const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    if (minutes < 60) return `${minutes}M AGO`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}H AGO`;
    const days = Math.floor(hours / 24);
    return `${days}D AGO`;
  };

  return (
    <ModalShell cardClassName="max-w-md p-4 sm:p-5" overlayClassName="bg-slate-900/35" zIndexClassName="z-40">

        <div className="mb-4 flex items-start justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2 text-white">
              <BellRing size={16} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                My Alerts • {unreadCount} Actions Required
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Pending Resolutions
              </h1>
            </div>
          </div>

          {/* CLOSE ICON */}
          <button
            className="text-slate-500"
            onClick={onClose}
            type="button"
          >
            <X size={15} />
          </button>
        </div>

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Recent Priority Notifications
        </p>

        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            title={notification.title}
            description={notification.message}
            meta={toMeta(notification.createdAt)}
          />
        ))}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">

          {/* CLOSE BUTTON */}
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close Action Center
          </Button>

          <Button>
            Mark All as Read
          </Button>

        </div>
    </ModalShell>
  );
}
