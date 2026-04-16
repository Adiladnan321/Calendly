import { EventTypesListProps } from "./utils/EventTypes.types";
import EventTypeItem from "./EventTypeItem";
import { EventTypesSkeleton } from "@/components/SkeletonLoaders";

export default function EventTypesList({
  items,
  loading,
  menuOpenFor,
  copiedId,
  onToggleActive,
  onMenuToggle,
  onCopyLink,
  onEdit,
  onDelete,
}: EventTypesListProps) {
  if (loading) {
    return <EventTypesSkeleton />;
  }

  return (
    <section className="space-y-4 pb-20">
      {items.map((item) => {
        // Default isActive to true if undefined. 
        const isActive = item.isActive !== false;

        return (
          <EventTypeItem
            key={item.id}
            item={item}
            isActive={isActive}
            menuOpenFor={menuOpenFor}
            copiedId={copiedId}
            onToggleActive={onToggleActive}
            onMenuToggle={onMenuToggle}
            onCopyLink={onCopyLink}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}

      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
          No matching event types found. You can fake create one to see it list here.
        </p>
      )}
    </section>
  );
}
