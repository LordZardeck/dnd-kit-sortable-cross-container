import { PropsWithChildren } from 'react';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type SortableItemsTreeProps = {
    items: number[];
};

export function SortableItemsTree({
    children,
    items,
}: PropsWithChildren<SortableItemsTreeProps>) {
    return (
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {children}
        </SortableContext>
    );
}
