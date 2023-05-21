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

    while (stack.length > 0) {
      let [currentNodeInterface, currentPath] = stack.pop();

      if (
        currentNodeInterface.mediaAccessControlAddress ===
        targetNode.mediaAccessControlAddress
      ) {
        console.log(currentPath);
        return currentPath.concat(currentNodeInterface);
      }

      if (!visited.has(currentNodeInterface)) {
        visited.add(currentNodeInterface);
        console.log("Nodo visitado: ");
        console.log(currentNodeInterface.mediaAccessControlAddress);
        console.log("Nodos adyacentes al nodo visitado: ");
        console.log(currentNodeInterface.network.nodeInterfaces);
        for (const gateway of currentNodeInterface.network.nodeInterfaces) {
          console.log(gateway.mediaAccessControlAddress);
          if (
            !visited.has(gateway) &&
            (gateway.father.type === "router" ||
              gateway.mediaAccessControlAddress ===
                targetNode.mediaAccessControlAddress)
          ) {
            console.log(
              "Nodo gateway encontrado: " + gateway.mediaAccessControlAddress
            );

            if (
              gateway.mediaAccessControlAddress ===
              targetNode.mediaAccessControlAddress
            ) {
              return currentPath.concat(gateway);
            }

            visited.add(gateway);

            for (const gatewayInterface of gateway.father.interfaces.filter(
              (gatewayInterface) => gatewayInterface !== gateway
            )) {
              console.log("La interfaz saliente encontrada:");
              console.log(gatewayInterface.mediaAccessControlAddress);
              stack.push([
                gatewayInterface,
                currentPath.concat(currentNodeInterface, gateway),
              ]);
              console.log("Este es el stack en este momento: ");
              for (const eth of stack) {
                console.log(eth[0]);
                console.log(eth[1]);
              }
            }
          }
        }
      }
    }
    return null;
  }
}
