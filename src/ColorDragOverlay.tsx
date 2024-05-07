import { DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { ColorSquare } from './feature/UI';
import { useState } from 'react';
import { ItemType } from './feature/ColorPalette';

export function ColorDragOverlay() {
    const [activeItem, setActiveItem] = useState<ItemType | null>(null);

    function onDragEnd() {
        setActiveItem(null);
        document.body.style.setProperty('cursor', null)
    }

    useDndMonitor({
        onDragStart({ active }) {
            if (!active?.data.current?.color) return;

            document.body.style.setProperty('cursor', 'grabbing')

            setActiveItem({
                id: active.id,
                color: active.data.current.color,
            });
        },
        onDragCancel: onDragEnd,
        onDragEnd,
    });

    return (
        <DragOverlay>
            {activeItem ? <ColorSquare isOverlay={true} color={activeItem.color} /> : null}
        </DragOverlay>
    );
}
