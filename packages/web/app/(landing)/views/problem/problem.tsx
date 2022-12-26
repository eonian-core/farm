import Container from "../contrainer/container"

// Props for the Problem component
interface ProblemProps {
    children: React.ReactNode
}

export const Problem = ({children}: ProblemProps) => {
    return (
        <Container>
            <div>
                {children}
            </div>
        </Container>
    )
}

export default Problem;