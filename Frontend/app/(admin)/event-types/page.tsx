"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import type { EventType, Schedule } from "@/lib/types";
import EventTypesHeader from "@/components/event-types/EventTypesHeader";
import EventTypesList from "@/components/event-types/EventTypesList";
import CreateEventTypeModal from "@/components/event-types/CreateEventTypeModal";

export default function EventTypesPage() {
  const [items, setItems] = useState<EventType[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State for both Create and Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<{ name: string, slug: string, duration: number, color: string, scheduleId?: string }>({ name: "", slug: "", duration: 30, color: "#8a42ff" });
  const [modalLoading, setModalLoading] = useState(false);

  async function loadEventTypes(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const [data, schedulesData] = await Promise.all([
        request<EventType[]>("/api/event-types"),
        request<Schedule[]>("/api/availability")
      ]);
      setItems(data);
      setSchedules(schedulesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load event types");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEventTypes();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleItemActive = (id: string, currentStatus: boolean | undefined) => {
    const newStatus = typeof currentStatus !== "undefined" ? !currentStatus : false;
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isActive: newStatus } : it
      )
    );
    setMenuOpenFor(null);
  };

  const handleCopyLink = (id: string, slug: string) => {
    const url = `${window.location.origin}/demo-user/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCreateModal = () => {
    setEditTargetId(null);
    setModalPayload({ name: "", slug: "", duration: 30, color: "#8a42ff" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: EventType) => {
    setEditTargetId(item.id);
    setModalPayload({
      name: item.name,
      slug: item.slug,
      duration: item.duration,
      color: item.color,
      scheduleId: item.scheduleId || undefined
    });
    setIsModalOpen(true);
    setMenuOpenFor(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event type?")) return;
    try {
      await request(`/api/event-types/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it.id !== id));
      setMenuOpenFor(null);
    } catch (err) {
      alert("Failed to delete the event type.");
    }
  };

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setModalLoading(true);
    setError(null);
    try {
      if (editTargetId) {
        const updatedItem = await request<EventType>(`/api/event-types/${editTargetId}`, {
          method: "PUT",
          body: JSON.stringify(modalPayload),
        });
        setItems((prev) => prev.map(it => it.id === editTargetId ? updatedItem : it));
      } else {
        const newItem = await request<EventType>("/api/event-types", {
          method: "POST",
          body: JSON.stringify(modalPayload),
        });
        setItems((prev) => [newItem, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scheduling type");
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <EventTypesHeader
        query={query}
        onQueryChange={setQuery}
        onCreateClick={openCreateModal}
      />

      <EventTypesList
        items={filteredItems}
        loading={loading}
        error={error}
        menuOpenFor={menuOpenFor}
        copiedId={copiedId}
        onToggleActive={toggleItemActive}
        onMenuToggle={setMenuOpenFor}
        onCopyLink={handleCopyLink}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <CreateEventTypeModal
        isOpen={isModalOpen}
        isEdit={!!editTargetId}
        payload={modalPayload}
        schedules={schedules}
        loading={modalLoading}
        onClose={() => setIsModalOpen(false)}
        onChange={setModalPayload}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
