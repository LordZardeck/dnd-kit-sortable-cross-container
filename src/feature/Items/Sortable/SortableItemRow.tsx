import { Slot } from '@radix-ui/react-slot';
import { PropsWithChildren } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItemRow({
    children,
    id,
    data,
}: PropsWithChildren<{ id: number; data: { record: { title: string } } }>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        data,
    });
    
    const slotProps = {
        style: {
            transform: CSS.Transform.toString(transform),
            transition,
        },
        activatorOptions: { ...listeners, ...attributes },
        activatorRef: setActivatorNodeRef,
    };

    return <Slot {...slotProps} ref={setNodeRef} children={children} />;
}
