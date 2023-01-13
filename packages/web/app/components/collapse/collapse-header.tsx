
// props
interface ColalapseHeaderProps {
    children?: React.ReactNode;
}   

export const ColalapseHeader = ({children}: ColalapseHeaderProps) => (
    <h3 className="collapse-title text-xl font-medium">{children}</h3>
)

export default ColalapseHeader;