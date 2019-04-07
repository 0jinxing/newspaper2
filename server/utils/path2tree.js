// @TODO
const path2tree = pathList => {
  const rootList = pathList.filter(val => pathList.findIndex(i => i.descendant === val) < 0);
  if (rootList.length === pathList.length) return pathList;
  else {
    rootList.map(ri => {
      pathList.filter(pi => pi.ancestor);
    });
  }
};
