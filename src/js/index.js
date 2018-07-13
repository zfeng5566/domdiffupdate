var contrastKeys = ['nodeName','attributes'];
function contrastJSON(j1,j2) {
    let result = true;
    if(Object.keys(j1).length == Object.keys(j2).length){
        for (const key in j1) {
            if(j1[key]!== j2[key]){
                result = false;
                break;
            }
        }
    }else{
        result = false;
    }  
    return result; 
}
//行内属性 变成json
function nameNodeMapToJSON(NamedNodeMap) {
    let json = {};
    for (let i = 0; i < NamedNodeMap.length; i++) {
        json[NamedNodeMap[i].nodeName] = NamedNodeMap[i].nodeValue;
    };
    return json;
}
function update(el1,el2) {
    console.dir(el1);
    console.dir(el2);
    let leng1 = el1.childNodes.length;
    let leng2 = el2.childNodes.length;
    let maxlength = leng1>leng2?leng1:leng2;
    console.log(maxlength)
    if(maxlength> 0){
        for (let i = 0; i < maxlength; i++) {
            if(el1.childNodes[i] && el2.childNodes[i]){
                if(el1.childNodes[i].nodeType == 3 || el2.childNodes[i].nodeType == 3){
                    console.log('replace')
                    el1.replaceChild(el2.childNodes[i],el1.childNodes[i]);
                }else{
                    update(el1.childNodes[i],el2.childNodes[i]);
                }
            }else if(el1.childNodes[i]){
                el1.removeChild(el1.childNodes[i]);
                i--;
            }else if(el2.childNodes[i]){
                el1.appendChild(el2.childNodes[i]);
            }
        }
    };
    let json1 = nameNodeMapToJSON(el1.attributes);
    let json2 = nameNodeMapToJSON(el2.attributes)
    console.log(el1.nodeType)
    if(el1.nodeName !== el2.nodeName || !contrastJSON(json1,json2)){
        for (const key in json2) {
            if(json2[key] == json1[key]){
            }else{
                console.log(key,json2[key]);
                el1.setAttribute(key,json2[key])
            }
            delete json1[key];
        };
        for (const key in json1) {
            el1.removeAttribute(key);
        }
    }
}

var abc = document.getElementById('abc');
var id2 = document.getElementById('id2');


update(abc,id2);
console.log(abc);