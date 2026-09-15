"use client";

import React from "react";
import Link from "next/link";
import { Bell, Check, Sparkles, ShieldCheck, Clock, X } from "lucide-react";
import { useNotificationStore, NotificationItem } from "@/lib/store/wishlistStore";

export const NotificationPopover: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearNotification = useNotificationStore((s) => s.clearNotification);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#b9975b]" />
          <h4 className="text-xs font-bold uppercase tracking-widest font-mono">Notifications</h4>
          {unreadCount > 0 && (
            <span className="bg-[#b9975b] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[10px] text-slate-300 hover:text-white font-mono flex items-center gap-1 underline"
            >
              <Check className="w-3 h-3 text-[#b9975b]" /> Read all
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono">
            No notifications in registry.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors relative group ${
                item.read ? "bg-white" : "bg-slate-50/80 border-l-2 border-l-[#b9975b]"
              }`}
              onClick={() => !item.read && markAsRead(item.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 cursor-pointer">
                  {item.type === "exclusive" && <Sparkles className="w-4 h-4 text-[#b9975b] flex-shrink-0 mt-0.5" />}
                  {item.type === "system" && <ShieldCheck className="w-4 h-4 text-[#0e3a5d] flex-shrink-0 mt-0.5" />}
                  {item.type === "order" && <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                  <div>
                    <h5 className={`text-xs font-bold leading-snug ${item.read ? "text-slate-500" : "text-slate-900"}`}>{item.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[9px] font-mono text-slate-400 mt-1.5 block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity p-1 flex-shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
