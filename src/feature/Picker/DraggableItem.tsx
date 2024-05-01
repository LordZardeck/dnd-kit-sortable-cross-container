import { ColorSquare } from '../UI';
import { useDraggable } from '@dnd-kit/core';

type DraggableItemProps = {
    id: string | number;
    color: string;
};

export function DraggableItem({ id, color }: DraggableItemProps) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
        data: {
            type: id,
            color,
        },
    });

    const style = {
        color: 'white',
        border: '1px dashed black',
    };

    return (
        <ColorSquare
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            color={color}
        >
            {id}
        </ColorSquare>
    );
}
