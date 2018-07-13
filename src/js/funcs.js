var filterArray = ['id', 'class', 'style'];
//设置DOM元素 class 名
function setClassName(node, classNameString) {
    node.className = classNameString;
}
//设置DOM元素 ID 名
function setId(node, idString) {
    node.id = idString;
}
//设置DOM元素 文本内容
function setTextValue(node, textValue) {
    node.textContent = textValue;
}
//DOM元素 行内属性转换成json 不包含 id  class style
function attributeToJSON(node) {
    let json = {};
    for (let i = 0; i < node.attributes.length; i++) {
        let name = node.attributes[i]['name'];
        if (filterArray.indexOf(name) == -1) {
            json[name] = node.getAttribute(name);
        }
    };
    return json;
}
//设置行内属性
function setAttribute(node, attributeName, attributeValue) {
    node.setAttribute(attributeName, attributeValue);
}
//删除行内属性
function removeAttribute(node, attributeName) {
    node.removeAttribute(attributeName);
}
//判断两个DOM元素是否值得比较
function sameNode(oldNode, newNode) {
    return oldNode.tagName === newNode.tagName && oldNode.id === newNode.id
}
// 一个DOM元素 只比较如下类型：
//      tagName
//      id
//      className
//      attribute
//      textConttent
//      children

function updateChildrens(oldNodeChildrens, newNodeChildrens) {
    let oldStartIdx = 0,
        newStartIdx = 0;
    let oldLength = oldNodeChildrens.length;
    let newLength = newNodeChildrens.length;
    let oldStartNode = oldNodeChildrens[oldStartIdx];
    let newStartNode = newNodeChildrens[newStartIdx];
    while (oldStartIdx < oldLength && newStartIdx < newLength) {
        if (oldStartNode !== undefined && oldStartNode !== undefined) {
            updateNode(oldStartNode, newStartNode);
            oldStartNode = oldNodeChildrens[++oldStartIdx];
            newStartNode = newNodeChildrens[++newStartIdx];
        } else if (oldStartNode) {
            oldStartNode.parentElement.removeChild(oldStartNode);
            oldStartNode = oldNodeChildrens[oldStartIdx];
            --oldLength;
        } else if (newStartNode) {
            oldStartNode.parentElement.appendChild(newStartNode);
            newStartNode = newNodeChildrens[newStartIdx];
        }
    }
}