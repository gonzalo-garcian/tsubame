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
    let stack = [[startNode, []]];
    let visited = new Set();
    console.log(startNode, targetNode);
    while (stack.length > 0) {
      let [currentNodeInterface, currentPath] = stack.pop();

      if (
        currentNodeInterface.mediaAccessControlAddress ===
        targetNode.mediaAccessControlAddress
      ) {
        return currentPath.concat(currentNodeInterface);
      }

      if (!visited.has(currentNodeInterface)) {
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

              for (const eth of currentPath) {
                console.log(eth);
              }
              return currentPath.concat(gateway);
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

    return null;
  }
}
