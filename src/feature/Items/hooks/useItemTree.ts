import { useMemo } from 'react';

export type Tree<T extends object> = {
    row: T;
    nodes: Record<string, Tree<T>>;
};

export type UiTree<T extends object> = T & {
    nodes: UiTree<T>[];
};

export function childrenToArray<T extends { sortOrder: number }>(
    children: Tree<T>['nodes'],
): UiTree<T>[] {
    return Object.values(children)
        .map<UiTree<T>>(({ row, nodes }, index) => ({
            ...row,
            sortOrder: row.sortOrder ?? index,
            nodes: childrenToArray(nodes),
        }))
        .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function useItemTree<T extends { sortOrder: number; path: number[] }>(
    rows: T[],
): UiTree<T>[] {
    return useMemo(
        () =>
            childrenToArray(
                rows.reduce<Tree<T>>(
                    (tree, row) => {
                        let leaf: Tree<T> = tree;

                        // Initialize all the leafs
                        for (const id of row.path) {
                            leaf.nodes[id] ??= { nodes: {} } as Tree<T>;
                            leaf = leaf.nodes[id];
                        }

                        leaf.row = row;

                        return tree;
                    },
                    { nodes: {} } as Tree<T>,
                ).nodes,
            ),
        [rows],
    );
}
