import { useEffect } from "react";
import { useCollapseContext } from "./collapse";
import { useToId } from "../heading/to-id";

// props
interface ColalapseHeaderProps {
    children?: React.ReactNode;
}

/** Collapse header provide id, that can be used for anchor link */
export const ColalapseHeader = ({ children }: ColalapseHeaderProps) => {
    const { onHeaderClick, id: collapseId, setCollapseId } = useCollapseContext();
    const id = useToId(children?.toString());

    // set id if not set
    useEffect(() => {
        if (typeof id === 'string' && id !== collapseId) {
            setCollapseId(id);
        }
    }, [collapseId, id, setCollapseId]);
    

    return (
        <h3
            className="collapse-title text-xl font-medium"
            onClick={onHeaderClick}
            id={id}
        >{children}</h3>
    )
}

export default ColalapseHeader;

