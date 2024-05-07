import { DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { ItemRow } from '../UI';

export function SortableOverlay() {
    const [activeItem, setActiveItem] = useState<{
        id: number;
        record: { title: string };
    } | null>(null);

    function onDragEnd() {
        setActiveItem(null);
        document.body.style.setProperty('cursor', null);
    }

    useDndMonitor({
        onDragStart({ active }) {
            document.body.style.setProperty('cursor', 'grabbing');

            setActiveItem(
                (active?.data.current as {
                    id: number;
                    record: { title: string };
                }) ?? null,
            );
        },
        onDragCancel: onDragEnd,
        onDragEnd,
    });

    return (
        <DragOverlay>
            {activeItem ? (
                <ItemRow.Root
                    isDragging={false}
                    style={{
                        boxShadow: '0px 15px 15px 0 rgba(34, 33, 81, 0.1)',
                    }}
                >
                    <ItemRow.Content>
                        <ItemRow.DragHandle>⠿</ItemRow.DragHandle>
                        {activeItem.record.title}
                    </ItemRow.Content>
                </ItemRow.Root>
            ) : null}
        </DragOverlay>
    );
}
