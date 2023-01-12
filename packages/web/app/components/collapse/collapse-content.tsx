//props
interface CollapseContentProps {
    children: React.ReactNode;
}

export const CollapseContent = ({ children }: CollapseContentProps) => (
    <div className="collapse-content">
        {children}
    </div>
)

export default CollapseContent;