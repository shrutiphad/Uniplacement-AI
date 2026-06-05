'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Bell, Check, CheckCheck, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const TYPE_COLORS = {
  selected:           'text-green-400  bg-green-500/10',
  shortlisted:        'text-purple-400 bg-purple-500/10',
  application_update: 'text-blue-400   bg-blue-500/10',
  new_drive:          'text-brand-400  bg-brand-500/10',
  ai_complete:        'text-brand-400  bg-brand-500/10',
  system:             'text-dark-400   bg-dark-700',
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen]         = useState(false);
  const [notifs, setNotifs]     = useState([]);
  const [unread, setUnread]     = useState(0);
  const [loading, setLoading]   = useState(false);
  const ref = useRef(null);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications?limit=15');
      setNotifs(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs(p => p.map(n => n._id === id ? { ...n, read: true } : n));
      setUnread(p => Math.max(0, p - 1));
    } catch (_) {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifs(p => p.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch (_) {}
  };

  const deleteNotif = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifs(p => p.filter(n => n._id !== id));
    } catch (_) {}
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(p => !p); if (!open) fetchNotifs(); }}
        className="relative p-2 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-all">
        <Bell className="w-5 h-5"/>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 rounded-full text-dark-950 text-xs font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800">
            <span className="font-medium text-white text-sm">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                <CheckCheck className="w-3.5 h-3.5"/>Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-dark-800">
            {loading && notifs.length === 0 ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-brand-400 animate-spin"/></div>
            ) : notifs.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="w-8 h-8 text-dark-700 mx-auto mb-2"/>
                <p className="text-dark-500 text-sm">No notifications yet</p>
              </div>
            ) : notifs.map(n => (
              <div key={n._id}
                onClick={() => { if (!n.read) markRead(n._id); if (n.link) window.location.href = n.link; }}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-dark-800/50 transition-colors group',
                  !n.read && 'bg-brand-500/5'
                )}>
                <div className={cn('w-2 h-2 rounded-full shrink-0 mt-1.5', n.read ? 'bg-transparent' : 'bg-brand-500')}/>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium leading-tight', n.read ? 'text-dark-400' : 'text-dark-200')}>{n.title}</p>
                  <p className="text-dark-500 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-dark-700 text-xs mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <button onClick={(e) => deleteNotif(n._id, e)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded text-dark-600 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}