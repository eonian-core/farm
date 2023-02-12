import { useEffect, useMemo } from "react";
import { useCollapseContext } from "./collapse";
import { toId } from "./to-id";

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

/** Momoized verion of to id */
export const useToId = (slug?: string) => {
    return useMemo(() => toId(slug), [slug]);
}

