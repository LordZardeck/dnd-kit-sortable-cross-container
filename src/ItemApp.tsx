import { useState } from 'react';
import { ItemsTree, sampleItems, useItemTree } from './feature/Items';
import {
    CollisionDescriptor,
    CollisionDetection,
    DndContext,
    MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableItemsTree, SortableOverlay } from './feature/Items/Sortable';
import { moveItem } from './feature/Items/utils';
import { ClientRect } from '@dnd-kit/core/dist/types';

const measuring = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
};

function sortCollisionsAsc(
    { data: { value: a } }: CollisionDescriptor,
    { data: { value: b } }: CollisionDescriptor,
) {
    return a - b;
}

function cornersOfRectangle({ top, height }: ClientRect) {
    return [top, top + height];
}

const closestPointerSide: CollisionDetection = ({
    droppableContainers,
    droppableRects,
    pointerCoordinates,
    active,
}) => {
    if (!pointerCoordinates) {
        return [] as CollisionDescriptor[];
    }

    const collisions: CollisionDescriptor[] = [];

    for (const droppableContainer of droppableContainers) {
        const { id } = droppableContainer;

        if (id === active?.id) {
            continue;
        }

        const rect = droppableRects.get(id);

        if (rect) {
            /* There may be more than a single rectangle intersecting
             * with the pointer coordinates. In order to sort the
             * colliding rectangles, we measure the distance between
             * the pointer and the corners of the intersecting rectangle
             */
            const corners = cornersOfRectangle(rect);

            for (const corner of corners) {
                collisions.push({
                    id,
                    data: {
                        droppableContainer,
                        value: Math.abs(pointerCoordinates.y - corner),
                    },
                });
            }
        }
    }

    return collisions.sort(sortCollisionsAsc);
};

export function ItemApp() {
    const [items, setItems] = useState(sampleItems);
    const itemTree = useItemTree(items);

    const sensors = useSensors(useSensor(PointerSensor));

    function handleItemsChange(
        activeId: number,
        parentId: number | null,
        overId: number,
        before = false,
    ) {
        setItems((previousItems) =>
            moveItem(previousItems, activeId, parentId, overId, before),
        );
    }

    return (
        <DndContext
            sensors={sensors}
            measuring={measuring}
            collisionDetection={closestPointerSide}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                <SortableItemsTree items={itemTree.map((item) => item.id)}>
                    {itemTree.map((item) => (
                        <ItemsTree
                            key={item.id}
                            item={item}
                            onChange={handleItemsChange}
                        />
                    ))}
                </SortableItemsTree>
            </div>
            <SortableOverlay />
        </DndContext>
    );
}
