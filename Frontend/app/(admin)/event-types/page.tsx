"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import type { EventType } from "@/lib/types";
import EventTypesHeader from "@/components/event-types/EventTypesHeader";
import EventTypesList from "@/components/event-types/EventTypesList";
import CreateEventTypeModal from "@/components/event-types/CreateEventTypeModal";

export default function EventTypesPage() {
  const [items, setItems] = useState<EventType[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createPayload, setCreatePayload] = useState({ name: "", slug: "", duration: 30, color: "#8a42ff" });
  const [createLoading, setCreateLoading] = useState(false);

  async function loadEventTypes(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const data = await request<EventType[]>("/api/event-types");
      setItems(data);
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
    // Determine active safely since it might be undefined originally
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

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setError(null);
    try {
      const newItem = await request<EventType>("/api/event-types", {
        method: "POST",
        body: JSON.stringify(createPayload),
      });
      // Add to list and close modal
      setItems((prev) => [newItem, ...prev]);
      setIsCreateModalOpen(false);
      setCreatePayload({ name: "", slug: "", duration: 30, color: "#8a42ff" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create scheduling type");
    } finally {
      setCreateLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <EventTypesHeader
        query={query}
        onQueryChange={setQuery}
        onCreateClick={() => setIsCreateModalOpen(true)}
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
      />

      <CreateEventTypeModal
        isOpen={isCreateModalOpen}
        payload={createPayload}
        loading={createLoading}
        onClose={() => setIsCreateModalOpen(false)}
        onChange={setCreatePayload}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
