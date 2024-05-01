import styled from 'styled-components';

import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable';
import {
    Active,
    DragEndEvent,
    DragMoveEvent,
    UniqueIdentifier,
    useDndMonitor,
} from '@dnd-kit/core';

import { PaletteDragType, SortableItem } from './SortableItem';
import { Item } from '../UI';
import { Dispatch, SetStateAction } from 'react';

const List = styled.ul`
    min-width: 200px;
    padding: 20px 10px;
    border: 1px solid black;
    border-radius: 5px;
    list-style-type: none;
`;

export type ItemType = { id: UniqueIdentifier; color: string };

type ColorPaletteProps = {
    items: ItemType[];
    onChange: Dispatch<SetStateAction<ItemType[]>>;
};

function removeActive(activeId: UniqueIdentifier) {
    return (items: ItemType[]) => {
        const activeIndex = items.findIndex((item) => item.id === activeId);

        if (activeIndex < 0) return items;

        return items.toSpliced(activeIndex, 1);
    };
}

export const generateId = (() => {
    let id = 0;
    return () => id++;
})();

const withTempId = (item: Active) =>
    item.data.current?.type === PaletteDragType ? item.id : `${item.id}-temp`;

export function ColorPalette({ items, onChange }: ColorPaletteProps) {
    useDndMonitor({
        onDragOver({ over, active, collisions }: DragMoveEvent) {
            if (!over) {
                if (active.data.current?.type === PaletteDragType) return;

                return onChange(removeActive(withTempId(active)));
            }

            onChange((previousItems) => {
                const activeIndex = previousItems.findIndex(
                    (x) => x.id === withTempId(active),
                );
                const overIndex = previousItems.findIndex(
                    (x) => x.id === over.id,
                );

                if (activeIndex !== -1 && overIndex !== -1) {
                    if (activeIndex === overIndex) return previousItems;

                    return arrayMove(previousItems, activeIndex, overIndex);
                }

                if (!collisions || collisions.length <= 0) return previousItems;

                const [target] = collisions;
                const targetIndex = previousItems.findIndex(
                    (item) => item.id === target.id,
                );

                if (targetIndex < 0) return previousItems;
                if (!active.data.current?.color) return previousItems;

                return previousItems.toSpliced(targetIndex, 0, {
                    id: withTempId(active),
                    color: active.data.current.color,
                });
            });
        },
        onDragEnd({ over, active }: DragEndEvent) {
            if (over?.data.current?.type !== PaletteDragType) return;

            onChange((previousItems) => {
                const activeIndex = previousItems.findIndex(
                    (item) => item.id === withTempId(active),
                );

                if (activeIndex < 0) return previousItems;

                const activeItem = previousItems[activeIndex];
                return previousItems.toSpliced(
                    activeIndex,
                    1,
                    active.data.current?.type === PaletteDragType
                        ? activeItem
                        : {
                              ...activeItem,
                              id: generateId(),
                          },
                );
            });
        },
    });

    return (
        <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
        >
            <List>
                {items.map(({ id, color }) => (
                    <Item key={id}>
                        <SortableItem color={color} id={id} />
                    </Item>
                ))}
            </List>
        </SortableContext>
    );
}
