"use client";

import { useState } from "react";
import { request } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { EventType, Schedule } from "@/lib/types";
import EventTypesHeader from "@/components/event-types/EventTypesHeader";
import EventTypesList from "@/components/event-types/EventTypesList";
import CreateEventTypeModal from "@/components/event-types/CreateEventTypeModal";

export default function EventTypesPage() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<EventType[]>({
    queryKey: ["event-types"],
    queryFn: () => request<EventType[]>("/api/event-types"),
  });

  const { data: schedules = [] } = useQuery<Schedule[]>({
    queryKey: ["schedules"],
    queryFn: () => request<Schedule[]>("/api/availability"),
  });

  const [query, setQuery] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State for both Create and Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<{ name: string, slug: string, duration: number, color: string, scheduleId?: string }>({ name: "", slug: "", duration: 30, color: "#8a42ff" });

  const createMutation = useMutation({
    mutationFn: (newType: typeof modalPayload) =>
      request<EventType>("/api/event-types", {
        method: "POST",
        body: JSON.stringify(newType),
      }),
    onSuccess: (newItem) => {
      queryClient.setQueryData<EventType[]>(["event-types"], (old = []) => [newItem, ...old]);
      setIsModalOpen(false);
      toast.success("Event type created");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to create event type"),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedType: typeof modalPayload) =>
      request<EventType>(`/api/event-types/${editTargetId}`, {
        method: "PUT",
        body: JSON.stringify(updatedType),
      }),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<EventType[]>(["event-types"], (old = []) =>
        old.map((it) => (it.id === editTargetId ? updatedItem : it))
      );
      setIsModalOpen(false);
      toast.success("Event type updated");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update event type"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => request(`/api/event-types/${id}`, { method: "DELETE" }),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<EventType[]>(["event-types"], (old = []) =>
        old.filter((it) => it.id !== deletedId)
      );
      setMenuOpenFor(null);
      toast.success("Event type deleted");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete event type"),
  });

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleItemActive = (id: string, currentStatus: boolean | undefined) => {
    // In a real app, this should be a mutation endpoint. For now, optimistic UI update:
    const newStatus = typeof currentStatus !== "undefined" ? !currentStatus : false;
    queryClient.setQueryData<EventType[]>(["event-types"], (old = []) =>
      old.map((it) => (it.id === id ? { ...it, isActive: newStatus } : it))
    );
    setMenuOpenFor(null);
  };

  const handleCopyLink = (id: string, slug: string) => {
    const url = `${window.location.origin}/demo-user/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied!");
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
    deleteMutation.mutate(id);
  };

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editTargetId) {
      updateMutation.mutate(modalPayload);
    } else {
      createMutation.mutate(modalPayload);
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
        loading={isLoading}
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
        loading={createMutation.isPending || updateMutation.isPending}
        onClose={() => setIsModalOpen(false)}
        onChange={setModalPayload}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
