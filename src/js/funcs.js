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
        if(oldNode.children.length && newNode.children.length){
            let result = isList(oldNode.children,newNode.children);
            result
            ? 
            updateChildrenByList(oldNode.children,newNode.children,oldNode,result)
            :
            updateChildrens1(oldNode.children, newNode.children,oldNode);
        }else if(oldNode.children.length){
            while (oldNode.removeChild(oldNode.children[0])) {
            }
        }else if(newNode.children.length){
            while (newNode.children.length) {
                oldNode.appendChild(newNode.children[0])
            }
        }
    }

}
function isList(oldNodeChildrens) {
    let oldJSON = {};
    let newJSON = {};
    let isList = true;
    for (let i = 0; i < oldNodeChildrens.length; i++) {
        if(!oldNodeChildrens[i].hasAttribute('key')){
            isList = false;
            break;
        }else{
            oldJSON[oldNodeChildrens[i].getAttribute('key')] = oldNodeChildrens[i];
        }
    };
    if(!isList){
        return false;
    }else{
        return oldJSON;
    }
}
function updateChildrenByList(oldNodeChildrens, newNodeChildrens, oldParentNode,oldKeyJSON) {
    let oldStartIdx = 0,
        newStartIdx = 0;
    let oldLength = oldNodeChildrens.length;
    let newLength = newNodeChildrens.length;
    let oldStartNode = oldNodeChildrens[oldStartIdx];
    let newStartNode = newNodeChildrens[newStartIdx];
    let indexNode;
    while (oldStartIdx < oldLength || newStartIdx < newLength) {
        console.log(oldStartIdx,oldLength,newStartIdx,newLength);
        if (oldStartNode !== undefined && newStartNode !== undefined) {
            if(isSameNode(oldStartNode,newStartNode)){
                updateNode(oldStartNode,newStartNode);
                oldStartNode = oldNodeChildrens[++oldStartIdx];
                newStartNode = newNodeChildrens[++newStartIdx];
            }else if(indexNode = oldKeyJSON[newStartNode.getAttribute('key')]){
                updateNode(indexNode,newStartNode);
                oldParentNode.insertBefore(indexNode,oldStartNode);
                ++oldStartIdx;
                newStartNode = newNodeChildrens[++newStartIdx];
            }else{
                oldParentNode.insertBefore(newStartNode,oldStartNode);
                ++oldStartIdx;
                ++oldLength;
                newStartNode = newNodeChildrens[newStartIdx];
                --newLength;
            }
        }else if(oldStartNode){
            oldParentNode.removeChild(oldStartNode);
            oldStartNode = oldNodeChildrens[oldStartIdx];
            --oldLength;
        }else if(newStartNode){
            oldParentNode.appendChild(newStartNode);
            newStartNode = newNodeChildrens[newStartIdx];
            --newLength;
        }
    }
}
//更新子元素 暂时没有考虑list形式的数据更新。。。。
function updateChildrens(oldNodeChildrens, newNodeChildrens, oldParentNode) {
    let oldStartIdx = 0,
        newStartIdx = 0;
    let oldLength = oldNodeChildrens.length;
    let newLength = newNodeChildrens.length;
    let oldStartNode = oldNodeChildrens[oldStartIdx];
    let newStartNode = newNodeChildrens[newStartIdx];
    while (oldStartIdx < oldLength || newStartIdx < newLength) {
        console.log(oldStartIdx, newStartIdx)
        if (oldStartNode !== undefined && newStartNode !== undefined) {
            updateNode(oldStartNode, newStartNode);
            oldStartNode = oldNodeChildrens[++oldStartIdx];
            newStartNode = newNodeChildrens[++newStartIdx];
        } else if (oldStartNode) {
            oldParentNode.removeChild(oldStartNode);
            oldStartNode = oldNodeChildrens[oldStartIdx];
            --oldLength;
        } else if (newStartNode) {
            oldParentNode.appendChild(newStartNode);
            newStartNode = newNodeChildrens[newStartIdx];
            --newLength;
        }
    }
}
//主要通过key判断是否是同一个元素
function isSameNode(oldNode, newNode) {
    return oldNode.getAttribute('key') !== undefined 
    && 
    newNode.getAttribute('key') !== undefined 
    && 
    oldNode.getAttribute('key') === newNode.getAttribute('key');
}
