let id = 0;


const addElement = (location, isNested) => {
    document.getElementById(location).appendChild(createNewElement(isNested));
}

const createNewElement = isNested => {
    let container = document.createElement("div");
    container.classList.add("element-item");
    if(isNested) container.classList.add("nested");
    container.id = id++;

    let rowOne = document.createElement("div");
    rowOne.classList.add("row");
    let rowTwo = document.createElement("div");
    rowTwo.classList.add("row");

    let elementTypeInput = document.createElement("input");
    elementTypeInput.type = "text";
    elementTypeInput.classList = "element-type";
    elementTypeInput.placeholder = "Element Type";
    rowOne.appendChild(elementTypeInput);

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList = "name";
    nameInput.placeholder = "Name";
    rowOne.appendChild(nameInput);

    let classesInput = document.createElement("input");
    classesInput.type = "text";
    classesInput.classList = "classes";
    classesInput.placeholder = "Classes (separate by , or space)";
    rowOne.appendChild(classesInput);

    let idInput = document.createElement("input");
    idInput.type = "text";
    idInput.classList = "id";
    idInput.placeholder = "ID (put in quotes for string)";
    rowTwo.appendChild(idInput);

    let contentInput = document.createElement("input");
    contentInput.type = "text";
    contentInput.classList = "content";
    contentInput.placeholder = "InnerHTML (put in quotes for string)";
    rowTwo.appendChild(contentInput);

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = "X";
    deleteBtn.addEventListener("click", () => {
        removeItem(container.id);
    });
    rowOne.appendChild(deleteBtn);

    let nestBtn = document.createElement("button");
    nestBtn.classList.add("add");
    nestBtn.innerHTML = "+";
    nestBtn.addEventListener("click", () => {
        addElement(container.id, true);
    });

    container.appendChild(rowOne);
    container.appendChild(rowTwo);
    container.appendChild(nestBtn);
    return container;
}


const removeItem = id => {
    document.getElementById(id).remove();
}

//create json object from DOM
const getDocumentObject = () => {
    let elementList = [];
    console.log(document.getElementById("topLevel").childNodes);
    document.getElementById("topLevel").childNodes.forEach(child => {
        elementList.push(createJsonElement(child));

    });
    console.log(elementList);
    return elementList;
}

//Allow period seperators later
const createJsonElement = (object) => {
    let element = {
        type:     object.childNodes[0].childNodes[0].value,
        name:     object.childNodes[0].childNodes[1].value,
        classes:  object.childNodes[0].childNodes[2].value ? object.childNodes[0].childNodes[2].value.trim().split(" ") : null,
        id:       object.childNodes[1].childNodes[0].value,
        content:  object.childNodes[1].childNodes[1].value,
        children: []
    }
    for(let i = 3; i < object.childElementCount; i++) {
        element.children.push(createJsonElement(object.childNodes[i]));
    }
    return element;
}



const exportToHTML = () => {
    let documentObject = getDocumentObject();
    let html = "";
    html = documentObject;

    document.getElementById("output").innerHTML = html;
}

const exportToJS = () => {
    let js = "";


    document.getElementById("output").innerHTML = js;
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