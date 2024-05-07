import { ItemRow } from './UI';
import { UiTree } from './hooks';
import { ComponentPropsWithoutRef } from 'react';
import { SortableItemsTree } from './Sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CollisionDescriptor, useDndMonitor } from '@dnd-kit/core';
import { getItemParent } from './utils';

type BaseItem = UiTree<{
    id: number;
    path: number[];
    type: string;
    sortOrder: number;
    record: { title: string };
}>;
type ItemsTreeProps<T extends BaseItem> = {
    item: T;
    onChange: (
        activeId: number,
        parentId: number | null,
        overId: number,
        before?: boolean,
    ) => void;
};

export function ItemsTree<T extends BaseItem>({
    item,
    onChange,
    ...props
}: ItemsTreeProps<T> &
    Omit<
        ComponentPropsWithoutRef<typeof ItemRow.Root>,
        'isDragging' | 'onChange'
    >) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        isDragging,
    } = useSortable({
        id: item.id,
        data: item,
    });

    useDndMonitor({
        onDragMove({ active, collisions, activatorEvent, delta }) {
            const [nearestCollision] = collisions ?? [];
            if (!nearestCollision) return;
            
            const container = (nearestCollision as CollisionDescriptor).data
                .droppableContainer;
            const collisionRect =
                container.node.current?.getBoundingClientRect();

            const sideDistances = [
                collisionRect?.top ?? 0,
                (collisionRect?.top ?? 0) + (collisionRect?.height ?? 0),
            ].map((side) =>
                Math.abs(
                    (activatorEvent as PointerEvent).clientY + delta.y - side,
                ),
            );

            // User is dragging active item to our position at our depth
            return onChange(
                Number(active.id),
                getItemParent(container.data.current as T),
                Number(nearestCollision.id),
                sideDistances[0] < sideDistances[1],
            );
        },
    });

    return (
        <ItemRow.Root
            ref={setNodeRef}
            {...props}
            isDragging={isDragging}
            style={{
                ...(item.type === 'section' ? { paddingBottom: '20px' } : {}),
            }}
        >
            {isDragging && <ItemRow.Indicator />}
            <ItemRow.Content
                style={{
                    ...(isDragging ? { display: 'none' } : {}),
                }}
            >
                <ItemRow.DragHandle
                    {...listeners}
                    {...attributes}
                    ref={setActivatorNodeRef}
                >
                    ⠿
                </ItemRow.DragHandle>
                {item.type} #{item.id} SortOrder: {item.sortOrder}
            </ItemRow.Content>
            {!isDragging && item.nodes.length > 0 && (
                <SortableItemsTree items={item.nodes.map((item) => item.id)}>
                    {item.nodes.map((nodeItem) => (
                        <ItemsTree
                            key={nodeItem.id}
                            item={nodeItem}
                            onChange={onChange}
                        />
                    ))}
                </SortableItemsTree>
            )}
        </ItemRow.Root>
    );
}
