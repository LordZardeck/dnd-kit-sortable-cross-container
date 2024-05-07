import { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function getItemDepth(item: { path: number[] }) {
    return item.path.length - 1;
}

function getDragDepth(offset: number, indentationWidth: number) {
    return Math.round(offset / indentationWidth);
}

function getItemParent(item: { id: number; path: number[] }): number | null {
    return item.path[item.path.indexOf(item.id) - 1] ?? null;
}

function getParentId(
    items: { id: number; path: number[] }[],
    depth: number,
    targetIndex: number,
    previousItem: { id: number; path: number[] },
) {
    if (depth === 0 || !previousItem) {
        return null;
    }

    if (depth === getItemDepth(previousItem)) {
        return getItemParent(previousItem);
    }

    if (depth > getItemDepth(previousItem)) {
        return previousItem.id;
    }

    const sibling = items
        .slice(0, targetIndex)
        .reverse()
        .find((item) => getItemDepth(item) === depth);

    return sibling ? getItemParent(sibling) : null;
}

export function getProjection<T extends { id: number; path: number[] }>(
    items: T[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    dragOffset: number,
    indentationWidth: number,
) {
    const overItemIndex = items.findIndex(({ id }) => id === overId);
    const activeItemIndex = items.findIndex(({ id }) => id === activeId);
    const activeItem = items[activeItemIndex];
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];
    const dragDepth = getDragDepth(dragOffset, indentationWidth);
    const projectedDepth = getItemDepth(activeItem) + dragDepth;
    const maxDepth = Math.min(
        previousItem ? getItemDepth(previousItem) + 1 : 0,
        1,
    );
    const minDepth = nextItem ? getItemDepth(nextItem) : 0;
    const depth = Math.max(Math.min(projectedDepth, maxDepth), minDepth);

    return {
        depth,
        maxDepth,
        minDepth,
        parentId: getParentId(newItems, depth, overItemIndex, previousItem),
    };
}
