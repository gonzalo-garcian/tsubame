export class DepthFirstSearch {
  constructor() {}

  /* startNode Interface
   * network: Network
   * targetNode Interface
   *
   * La interface inicial mira en su network que Interfaces hay, si alguna es un router o el target final,
   * se mirará para ese nodo que Interfaces tiene y si no están visitadas entonces se añaden al stack.
   */
  findPath(startNode, targetNode) {
    console.log("Aquí empieza la fiesta");
    let stack = [[startNode, []]];
    let visited = new Set();
    console.log(startNode, targetNode);
    while (stack.length > 0) {
      let [currentNodeInterface, currentPath] = stack.pop();

      if (
        currentNodeInterface.mediaAccessControlAddress ===
        targetNode.mediaAccessControlAddress
      ) {
        console.log(currentNodeInterface);
        currentPath = currentPath.concat(currentNodeInterface);
        console.log(currentPath);
        return currentPath;
      }

      if ((!visited.has(currentNodeInterface)) && (currentNodeInterface.network !== null)) {
        visited.add(currentNodeInterface);

        for (const gateway of currentNodeInterface.network.nodeInterfaces) {
          if (
            !visited.has(gateway) &&
            (gateway.father.type === "router" ||
              gateway.mediaAccessControlAddress ===
                targetNode.mediaAccessControlAddress)
          ) {
            if (
              gateway.mediaAccessControlAddress ===
              targetNode.mediaAccessControlAddress
            ) {
              console.log(gateway);
              currentPath = currentPath.concat(currentNodeInterface);
              currentPath = currentPath.concat(gateway);
              console.log(currentPath);
              return currentPath;
            }

            visited.add(gateway);

            for (const gatewayInterface of gateway.father.interfaces.filter(
              (gatewayInterface) => gatewayInterface !== gateway
            )) {
              stack.push([
                gatewayInterface,
                currentPath.concat(currentNodeInterface, gateway),
              ]);
            }
          }
        }
      }
    }
    console.log("Lo que buscas!.");
    console.log(stack);
    console.log(visited);
    return null;
  }
}
