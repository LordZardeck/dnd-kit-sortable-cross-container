import styled from 'styled-components';

export const Col = styled.div<{ width?: string }>`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;