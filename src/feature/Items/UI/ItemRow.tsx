import styled, { css } from 'styled-components';

export const Root = styled.div<{ isDragging: boolean }>`
    border: 1px solid gray;
    padding: 4px 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;

    ${({ isDragging }) =>
        isDragging &&
        css`
            padding: 0;
            border: none;
            background: transparent;
            position: relative;
            z-index: 1;
        `}
`;

export const Indicator = styled.div`
    background: red;
    height: 4px;

    &:before, &:after {
        content: ' ';
        display: block;
        top: -3px;
        width: 10px;
        height: 10px;
        background: red;
        border-radius: 100%;
        position: absolute;
        left: -5px;
    }

    &:after {
        left: initial;
        right: -5px;
    }
`

export const Content = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 0 8px;
    gap: 8px;
`;

export const DragHandle = styled.button`
    font-size: 18px;
    padding: 2px 4px 0;
`;
