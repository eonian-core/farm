import Container from "../contrainer/container"

// Props for the Problem component
interface ProblemProps {
    title: string
    category: string
    children: React.ReactNode
}

export const Problem = ({title, category, children}: ProblemProps) => {
    return (
        <Container>
            <div>
                <div>
                    <span>{category}</span>
                    <h2>{title}</h2>
                </div>
                
                {children}
            </div>
        </Container>
    )
}

export default Problem;