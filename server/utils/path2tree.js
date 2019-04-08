// @TODO
const path2tree = pathList => {
  // 根节点
  const rootList = pathList.filter(val => pathList.findIndex(i => i.descendant === val) < 0);
  if (rootList.length === pathList.length) return pathList;
  else {
    rootList.map(ri => {
      // 获得子节点
      const childrenNode = pathList
        .filter(pi => pi.ancestor === ri.folderId)
        .map(pi => pi.folderId);
      // 获得子节点路径
      const childrenNodePath = pathList.filter(pi => childrenNode.indexOf(pi.folderId) >= 0);
      return { ...ri, children: path2tree(childrenNodePath) };
    });
  }
};
