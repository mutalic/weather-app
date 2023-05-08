export default function clearChildrenElements(parentNode) {
  while (parentNode.lastElementChild) {
    parentNode.removeChild(parentNode.lastElementChild);
  }
}
