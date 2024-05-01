import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core';
import styled from 'styled-components';
import { ItemType } from '../ColorPalette';
import { Dispatch, SetStateAction, useState } from 'react';

const Box = styled.div<{ color: string }>`
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: ${(props) => props.color};
`;

type TrashProps = {
    onChange: Dispatch<SetStateAction<ItemType[]>>;
};

export function Trash({ onChange }: TrashProps) {
    const [activeItem, setActiveItem] = useState<ItemType | null>(null);
    const { setNodeRef, isOver } = useDroppable({
        id: 'trash',
    });

    useDndMonitor({
        onDragStart({ active }) {
            console.log('onDragStart', active);
            if (!active?.data.current?.color) return;
            setActiveItem({
                id: active.id,
                color: active.data.current.color,
            });
        },
        onDragCancel: () => setActiveItem(null),
        onDragEnd({ active, over }: DragEndEvent) {
            setActiveItem(null);
            if (over?.id !== 'trash') return;

            onChange((previousItems) => {
                const previousIndex = previousItems.findIndex(
                    (item) => item.id === active.id,
                );

                if (previousIndex < 0) return previousItems;

                return previousItems.toSpliced(previousIndex, 1);
            });
        },
    });
    
    const active =  Boolean(activeItem) &&
        activeItem?.id !== 'favorite' &&
        activeItem?.id !== 'current'

    return (
        <Box ref={setNodeRef} color={isOver && active ? 'red' : 'grey'}>
            Trash
        </Box>
    );
}
