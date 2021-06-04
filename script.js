let id = 0;
let tempCount = 0;
let selectedItemId = "";

const addElement = (location, isNested) => {
    // document.getElementById(location).appendChild(createNewElement(isNested));
    document.getElementById(location).getElementsByClassName("children")[0].appendChild(createNewElement(isNested));
    selectItem();
}

const createNewElement = isNested => {
    let container = document.createElement("div");
    container.classList.add("element-item");
    if(isNested) container.classList.add("nested");
    container.id = `item${id++}`;
    

    //select item after it has been created
    selectedItemId = container.id;
    let headerRow = document.createElement("div");
    headerRow.classList.add("header-row");
    

    // let elementTypeInput = document.createElement("input");
    // elementTypeInput.type = "text";
    // elementTypeInput.classList = "element-type";
    // elementTypeInput.placeholder = "Element Type";
    // headerRow.appendChild(elementTypeInput);

    // let nameInput = document.createElement("input");
    // nameInput.type = "text";
    // nameInput.classList = "name";
    // nameInput.placeholder = "Name";
    // headerRow.appendChild(nameInput);

    // let classesInput = document.createElement("input");
    // classesInput.type = "text";
    // classesInput.classList = "classes";
    // classesInput.placeholder = "Classes (separate space)";
    // headerRow.appendChild(classesInput);

    // let idInput = document.createElement("input");
    // idInput.type = "text";
    // idInput.classList = "id";
    // idInput.placeholder = "ID (put in quotes for string)";
    // rowTwo.appendChild(idInput);

    // let contentInput = document.createElement("input");
    // contentInput.type = "text";
    // contentInput.classList = "content";
    // contentInput.placeholder = "InnerHTML (put in quotes for string)";
    // rowTwo.appendChild(contentInput);

    const name = document.createElement("h3");
    name.classList.add("name");
    name.innerHTML = "Element";
    name.title = "Click to Edit";
    headerRow.appendChild(name);
    name.addEventListener("click", () => {
        selectedItemId = container.id;
        selectItem();
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.title = "Delete Element";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", () => {
        removeItem(container.id);
    });
    headerRow.appendChild(deleteBtn);

    const childrenContainer = document.createElement("div");
    childrenContainer.classList.add("children");

    let nestBtn = document.createElement("button");
    nestBtn.classList.add("add");
    nestBtn.classList.add("btn");
    nestBtn.classList.add("outline");
    nestBtn.innerHTML = "+";
    nestBtn.title = "Add Element";
    nestBtn.addEventListener("click", () => {
        addElement(container.id, true);
    });

    container.appendChild(headerRow);
    container.appendChild(childrenContainer);
    container.appendChild(nestBtn);
    return container;
}


const removeItem = id => {
    document.getElementById(id).remove();
}

const selectItem = () => {
    //update selected class on element-item divs
    document.querySelectorAll(".element-item.selected").forEach(prevSelectedElement => {
        prevSelectedElement.classList.remove("selected");
    });
    document.getElementById(selectedItemId).classList.add("selected");

    //display proper data on side bar
}

const convertTagType = tag => {
    switch(tag) {
        case "p":
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
        case "span":
        return "text";
        
        case "div":
        case "header":
        case "footer":
        case "section":
        case "article":
        return "container";
    }
    return tag;
}

const getRestrictedFields = tag => {
    switch(tag) {
        case "form":
        case "container":
        case "text": 
        return ["src", "alt", "href", "type", "name"];
        case "a":
        return ["src", "alt", "type", "name"];
        case "button": 
        return ["src", "alt", "href", "type"];
        case "img":
        return ["innerHTML", "href", "type", "name"];
        case "input":
        return ["src", "href", "alt"];
    }
}


//Have all fields. Disable as needed.
const updateOptions = (tag) => {
    const tagType = convertTagType(tag);
    const restrictedFields = getRestrictedFields(tagType);
    
    //enable all fields


    //elementName, id, classlist, title, innerHTML, src, href, alt, type, name, eventListener
    //Make innerHTML => value for inputs

    //All => name, id, classlist, title
    //Text (p, h1-6, span) => innerHTML
    //a => innerHTML, href
    //div, footer, header => innerHTML
    //button => innerHTML  
    //img => src, alt
    //form => 
    //input => type, name, innerHTML

}

const createOptions = () => {
    const options = [
        {name: "elementName",}
    ]
}


//create json object from DOM
const getDocumentObject = () => {
    let elementList = [];
    console.log(document.getElementById("topLevel").childNodes);
    document.getElementById("topLevel").childNodes[0].childNodes.forEach(child => {
        console.log(child);
        elementList.push(createJsonElement(child));

    });
    console.log(elementList);
    return elementList;
}

//Allow period seperators later
const createJsonElement = (object) => {
    let element = {
        type:     object.childNodes[0].childNodes[0].value.trim(),
        name:     object.childNodes[0].childNodes[1].value.trim(),
        classes:  object.childNodes[0].childNodes[2].value ? object.childNodes[0].childNodes[2].value.trim().split(" ") : null,
        id:       object.childNodes[1].childNodes[0].value.trim(),
        content:  object.childNodes[1].childNodes[1].value,
        children: []
    }
    for(let i = 0; i < object.childNodes[2].childElementCount; i++) {
        element.children.push(createJsonElement(object.childNodes[2].childNodes[i]));
    }
    return element;
}



const exportToHTML = () => {
    let documentObject = getDocumentObject();
    let html = "";
    

    document.getElementById("output").innerHTML = html;
}

const exportToJS = () => {
    tempCount = 0;
    let documentObject = getDocumentObject();
    let js = "";
    documentObject.forEach(element => {
        js += createJsElement(element);
    });
    

    document.getElementById("output").innerHTML = js;
}

const createJsElement = (element, parentName) => {
    //Replace name if it start 
    const nameRegex = /^[a-zA-Z].*/;
    let name = element.name.trim();
    if(name) {
        if(!nameRegex.test(name)) {
        name = `temp${tempCount++}`;
      }
    } 
    else name = `temp${tempCount++}`;


    console.log(name);
    let string = `let ${element.name} = document.createElement("${element.type}");<br>`;
    if(element.classes) element.classes.forEach(className => {
        string += `${element.name}.classList.add("${className}");<br>`;
    });
    if(element.id) string += `${element.name}.id = ${element.id};<br>`;
    if(element.content) string += `${element.name}.innerHTML = ${element.content};<br>`;
    string += "<br>";

    if(element.children) {
        element.children.forEach(child => {
            string += createJsElement(child, element.name);
        });
    }
    if(parentName) string += `${parentName}.appendChild(${element.name});<br>`;

    return string;
}




document.getElementById("addElement").addEventListener("click", () => {
    addElement("topLevel", false);
});

document.getElementById("exportHTML").addEventListener("click", () => {
    exportToHTML();
});

document.getElementById("exportJS").addEventListener("click", () => {
    exportToJS();
});

createOptions();