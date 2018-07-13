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
function updateNode(oldNode, newNode) {
    //如不不值得对比 则直接替换
    if (!sameNode(oldNode, newNode)) {
        oldNode.parentElement.replaceChild(newNode.cloneNode(true), oldNode);

        //如果该元素是一个region 占位元素 则不更新该元素及后代元素
    } else if (oldNode.hasAttribute('region')) {
        return oldNode;
        //如果值得比较 则开始对比
    } else {
        //更新 id
        oldNode.id === newNode.id || (oldNode.id = newNode.id);
        //更新 className
        oldNode.className === newNode.className || (oldNode.className = newNode.className);
        //更新 textContent
        if (!oldNode.children.length && !newNode.children.length && newNode.textContent !== oldNode.textContent) {
            oldNode.textContent = newNode.textContent
        }
        //更新 attribute 属性
        if (oldNode.attributes.length || newNode.attributes.length) {
            let oldJSON = attributeToJSON(oldNode);
            let newJSON = attributeToJSON(newNode);
            _.each(oldJSON, function (value, key) {
                if (newJSON[key] === value) {
                    delete newNode[key]
                } else if (!newJSON.hasOwnProperty(key)) {
                    oldNode.removeAttribute(key);
                } else {
                    oldNode.setAttribute(key, newJSON[key]);
                    delete newJSON[key]
                }
            });
            _.each(newJSON, function (value, key) {
                oldNode.setAttribute(key, value);
            })
        }
        //更新 子元素
        updateChildrens(oldNode.children, newNode.children);
    }

}
//更新子元素 暂时没有考虑list形式的数据更新。。。。
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
