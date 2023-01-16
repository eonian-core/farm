import { useCollapseContext } from "./collapse";

// props
interface ColalapseHeaderProps {
    children?: React.ReactNode;
}

export const ColalapseHeader = ({ children }: ColalapseHeaderProps) => {
    const { onHeaderClick } = useCollapseContext();
    return (
        <h3 className="collapse-title text-xl font-medium" onClick={onHeaderClick}>{children}</h3>
    )
}

export default ColalapseHeader;