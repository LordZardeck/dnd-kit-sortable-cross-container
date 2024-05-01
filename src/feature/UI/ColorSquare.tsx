import styled, {css} from 'styled-components';

export const ColorSquare = styled.div<{ color: string, isOverlay?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    width: 50px;
    height: 50px;
    color: white;
    background-color: ${props => props.color};

    ${props => props.isOverlay ?? false ? null : css`
        &:hover {
            cursor: grab
        }
    `}
`