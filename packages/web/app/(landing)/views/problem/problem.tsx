import Container from "../contrainer/container"

// Props for the Problem component
interface ProblemProps {
    category: string
    children: React.ReactNode
}

export const Problem = ({category, children}: ProblemProps) => {
    return (
        <Container>
            <div>
                <span>{category}</span>
                
                {children}
            </div>
        </Container>
    )
}

export default Problem;