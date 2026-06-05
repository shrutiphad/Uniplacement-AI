'use client';
import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/lib/api';

export function useNotifications(pollInterval = 30000) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await notificationApi.getAll({ limit: 20 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (_) {
      // silently fail — don't break UI
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const id = setInterval(refetch, pollInterval);
    return () => clearInterval(id);
  }, [refetch, pollInterval]);

  const markRead = useCallback(async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(p => p.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(p => Math.max(0, p - 1));
    } catch (_) {}
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(p => p.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (_) {}
  }, []);

  const deleteNotif = useCallback(async (id) => {
    try {
      await notificationApi.delete(id);
      setNotifications(p => p.filter(n => n._id !== id));
    } catch (_) {}
  }, []);

  return { notifications, unreadCount, loading, markRead, markAllRead, deleteNotif, refetch };
}