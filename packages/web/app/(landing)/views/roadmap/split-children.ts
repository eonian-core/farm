import { Children, isValidElement } from "react";

/**
 * Extracts checkpoint components from the passed "children" props (required to work with MDX)
 * @param children the children prop content
 * @returns two groups - checkpoints and other components
 */
export function splitChildren(children: React.ReactNode, Component: React.FC<any>) {
    return Children.toArray(children).reduce(
      (groups, node: React.ReactNode) => {
        console.log(node, isValidElement(node), isValidElement(node) && node.type === Component)
        if(isValidElement(node) && node.type === Component) {
          groups.target.push(node);
          return groups;
        }
  
        groups.rest.push(node);
        return groups;
      },
      {
        rest: [] as React.ReactNode[],
        target: [] as React.ReactNode[],
      }
    );
  }