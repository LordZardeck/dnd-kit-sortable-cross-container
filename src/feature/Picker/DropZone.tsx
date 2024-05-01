import type { PropsWithChildren } from 'react';
import {
    DragEndEvent,
    UniqueIdentifier,
    useDndMonitor,
    useDroppable,
} from '@dnd-kit/core';

type DropZoneProps = PropsWithChildren<{ id: UniqueIdentifier, onChange: (color: string) => void }>;

export function DropZone({ children, id, onChange }: DropZoneProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    useDndMonitor({
        onDragEnd({ active, over }: DragEndEvent) {
            // Only handle events when dragged over this item
            if (over?.id !== id || !active?.data.current?.color) return;
            
            onChange(active.data.current.color)
        },
    });

    const style = {
        listStyleType: 'none',
        border: '1px solid red',
        backgroundColor: isOver ? 'grey' : 'inherit',
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}
