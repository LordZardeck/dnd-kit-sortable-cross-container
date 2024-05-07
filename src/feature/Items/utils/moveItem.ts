export const getItemParent = (item: { path: number[] }): number | null =>
    item.path.at(-2) ?? null;
export const byMatchingDepth =
    (parentId: number | null) => (item: { path: number[] }) =>
        getItemParent(item) === parentId;
export const forItem = (id: number) => (item: { id: number }) => item.id === id;

function arrayMove<T>(array: T[], from: number, to: number): T[] {
    return array
        .toSpliced(from, 1)
        .toSpliced(
            (to < 0 ? array.length + to : to) - (from > to ? 1 : 0),
            0,
            array[from],
        );
}

export function moveItem<
    T extends { id: number; path: number[]; sortOrder: number },
>(
    items: T[],
    activeId: number,
    parentId: number | null,
    overId: number,
    before = false,
) {
    // Grab the index of the item being moved
    const activeIndex = items.findIndex(forItem(activeId));
    // Grab the index of the item where active is being moved to
    let overIndex = items.findIndex(forItem(overId));

    if (
        getItemParent(items[activeIndex]) === parentId &&
        items[overIndex].sortOrder + (before ? -1 : 1) ===
            items[activeIndex].sortOrder
    )
        return items;

    overIndex += before ? -1 : 0;

    // Adjust the path of the item to match its new parent
    const updatedItem = {
        ...items[activeIndex],
        path: [
            ...(parentId ? items.find(forItem(parentId))?.path ?? [] : []),
            activeId,
        ],
    };

    // Move the active item to the calculated target
    let newSortedItems = arrayMove(
        // Replace the item with the updated path
        items.toSpliced(activeIndex, 1, updatedItem),
        activeIndex,
        overIndex,
    );

    // Fix the paths on any of the children of the changed section
    newSortedItems = newSortedItems.map((item) =>
        item.path.includes(activeId) && item.path.at(-1) !== activeId
            ? ({
                  ...item,
                  path: [
                      ...updatedItem.path,
                      ...item.path.slice(item.path.indexOf(activeId) + 1),
                  ],
              } as typeof item)
            : item,
    );

    const oldParentId = getItemParent(items[activeIndex]);
    // Grab all the previous sections at the same depth
    const oldDepthItems = (oldParentId !== parentId ? newSortedItems : [])
        .filter(byMatchingDepth(oldParentId))
        .map((item, index) => ({ ...item, sortOrder: index }));
    const newDepthItems = newSortedItems
        .filter(byMatchingDepth(parentId))
        .map((item, index) => ({
            ...item,
            sortOrder: index,
        }));

    return [
        ...newSortedItems.filter(
            (item) =>
                !byMatchingDepth(oldParentId)(item) &&
                !byMatchingDepth(parentId)(item),
        ),
        ...oldDepthItems,
        ...newDepthItems,
    ];
}
