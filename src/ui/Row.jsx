import styled from "styled-components";
import {css} from "styled-components";

const Row= styled.div`
    display:flex;

${(props) =>
    props.type === "horizontal" &&
    css`
        justify-content: space-between;
        align-items:center;
    `}  

${(props) =>
    props.type === "vertical" &&
    css`
        justify-content: column;
        gap: 1.6rem;
    `}  
`;

Row.defaultProps = {
    type: "vertical",
};
export default Row;