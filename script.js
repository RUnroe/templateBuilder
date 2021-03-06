let id = 0;
let tempCount = 0;
let selectedItemId = "";

const textFields = [
    { name: "element Name", description: "Alias for element"}, 
    { name: "id", description: "Unique identifier"},
    { name: "class List", description: "List of classes (separate by spaces)"},
    { name: "title", description: "Information shown on hover"},
    { name: "innerHTML", description: "Content inside of element (overrides children)"},
    { name: "src", description: "URL of a media file"},
    { name: "href", description: "URL of a page"},
    { name: "alt", description: "Alternate text when element fails to display"},
    { name: "type", description: "Type of input"},
    { name: "name", description: "Name of element (used in forms)"},
    { name: "for", description: "ID of input field corresponding to label"}
];

const elementTypes = [
  {title: "Text",      elementTypes: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "a", "input"]},
  {title: "Container", elementTypes: ["div", "header", "footer", "section", "article"]},
  {title: "Form",      elementTypes: ["form", "input", "label"]},
  {title: "Other",     elementTypes: ["img", "button"]}
];



const addElement = (location, isNested, tagName) => {
    // document.getElementById(location).appendChild(createNewElement(isNested));
    document.getElementById(location).getElementsByClassName("children")[0].appendChild(createNewElement(isNested, tagName));
    selectItem();
}

const createNewElement = (isNested, tagName) => {
    const container = document.createElement("div");
    container.dataset.tagName = tagName;
    container.classList.add("element-item");
    if(isNested) container.classList.add("nested");
    container.id = `item${id++}`;
    

    //select item after it has been created
    selectedItemId = container.id;
    const headerRow = document.createElement("div");
    headerRow.classList.add("header-row");

    const name = document.createElement("h3");
    name.classList.add("name");
    name.innerHTML = `Element (${tagName})`;
    name.title = "Click to Edit";
    headerRow.appendChild(name);
    name.addEventListener("click", () => {
        selectedItemId = container.id;
        selectItem();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.title = "Delete Element";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", () => {
        removeItem(container.id);
    });
    headerRow.appendChild(deleteBtn);

    const childrenContainer = document.createElement("div");
    childrenContainer.classList.add("children");

    const nestBtn = document.createElement("button");
    nestBtn.classList.add("add");
    nestBtn.classList.add("btn");
    nestBtn.classList.add("outline");
    nestBtn.innerHTML = "+";
    nestBtn.title = "Add Element";
    nestBtn.addEventListener("click", () => {
        
        setNewElementModal(container.id, true);
        showModal();
        //addElement(container.id, true);
    });

    container.appendChild(headerRow);
    container.appendChild(childrenContainer);
    container.appendChild(nestBtn);
    return container;
}


const removeItem = id => {
    document.getElementById(id).remove();
    selectedItemId = "";
    selectItem();
}

const selectItem = () => {
    //update selected class on element-item divs
    document.querySelectorAll(".element-item.selected").forEach(prevSelectedElement => {
        prevSelectedElement.classList.remove("selected");
    });
    //if no item is selected, disable all fields 
    if(!selectedItemId) {
        disableAllOptions(true);
        document.getElementById("elementTypeDisplay").innerHTML = "";
    
    }
    //else, filter fields by type of element
    else {
        let selectedTagName = document.getElementById(selectedItemId).dataset.tagName;
        //update attribute panel name
        document.getElementById("elementTypeDisplay").innerHTML = selectedTagName;
        //select element
        document.getElementById(selectedItemId).classList.add("selected");
        //enable all input fields
        disableAllOptions(false);
        //display proper data on side bar
        updateOptions(document.getElementById(selectedItemId).dataset.tagName);
    }
}

//true disables all option fields. false enables all option fields
const disableAllOptions = boolValue => {
    document.querySelectorAll(".option-field input").forEach(inputField => {
        inputField.disabled = boolValue;
        inputField.value = "";
    });
    document.querySelectorAll(".option-field button").forEach(button => {
        button.disabled = boolValue;
    });
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
        return ["src", "alt", "href", "type", "name", "for"];
        case "a":
        return ["src", "alt", "type", "name", "for"];
        case "button": 
        return ["src", "alt", "href", "type", "for"];
        case "img":
        return ["innerHTML", "href", "type", "name", "for"];
        case "input":
        return ["src", "href", "alt", "for"];
        case "label":
        return ["src", "alt", "href", "type"];
    }
}


//Have all fields. Disable as needed.
const updateOptions = (tag) => {
    const tagType = convertTagType(tag);
    const restrictedFields = getRestrictedFields(tagType);
    //elementName, id, classlist, title, innerHTML, src, href, alt, type, name, for, eventListener
    //Make innerHTML => value for inputs
    if(tag == "input") document.getElementById("innerHTMLInput").previousSibling.innerHTML = "value";
    else document.getElementById("innerHTMLInput").previousSibling.innerHTML = "innerHTML";

    restrictedFields.forEach(restrictedField => {
        document.getElementById(`${restrictedField}Input`).disabled = true;
    });

}

const createOptions = () => {
    let optionsString = "";
    textFields.forEach(field => {
        let id = field.name.replaceAll(" ", "");
        optionsString += `
        <div class="option-field" title="${field.description}">
            <label for="${id}Input">${field.name}:</label>
            <input type="text" id="${id}Input" />
        </div>`;
    });
    optionsString += `
    <div class="option-field">
        <button class="btn outline" id="eventListenerBtn">Event Listener</button>
    </div>
    <div class="option-field">
        <button class="btn outline" id="datasetBtn">Dataset</button>
    </div>`;
    document.getElementById("optionSection").innerHTML = optionsString;
    selectItem();
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
    let string = `const ${element.name} = document.createElement("${element.type}");<br>`;
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


const setNewElementModal = (location, isNestedFlag) => {
    const modalBody = document.getElementById("modalBody");
    elementTypes.forEach(obj => {
        const modalSection = document.createElement("div");
        modalSection.classList.add("modal-body-section");

        const sectionHeader = document.createElement("div");
        sectionHeader.classList.add("modal-section-header");

            const sectionTitle = document.createElement("h4");
            sectionTitle.innerHTML = obj.title;
            sectionHeader.appendChild(sectionTitle);

            const rule = document.createElement("hr");
            sectionHeader.appendChild(rule);

        modalSection.appendChild(sectionHeader);

        const typeList = document.createElement("div");
        typeList.classList.add("element-type-list");
        modalSection.appendChild(typeList);

        obj.elementTypes.forEach(type => {
            const button = document.createElement("div");
            button.classList.add("btn");
            button.classList.add("outline");
            button.innerHTML = type;
            button.addEventListener("click", () => {
                addElement(location, isNestedFlag, type);
                closeModal();
            });
            typeList.appendChild(button);
        });
        modalBody.appendChild(modalSection);
    });


    const modalHeader = document.createElement("h2");
    modalHeader.innerHTML = "Select Element Type";
    document.getElementById("modalHeader").appendChild(modalHeader);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", () => {
        closeModal();
    });
    document.getElementById("modalHeader").appendChild(deleteBtn);
    
}

const setDatasetModal = (currList) => {
    document.getElementById("modalHeader").innerHTML = `<h2>Dataset</h2>`;

}

const setEventListenerModal = (currList) => {
    document.getElementById("modalHeader").innerHTML = `<h2>Event Listeners</h2>`;

}




const showModal = () => {
    if(document.getElementById("modal").classList.contains("hidden"))  document.getElementById("modal").classList.remove("hidden");
}
const closeModal = () => {
    if(!document.getElementById("modal").classList.contains("hidden")) {
        document.getElementById("modal").classList.add("hidden");
        //clear modal
        document.getElementById("modalHeader").innerHTML = "";  
        document.getElementById("modalBody").innerHTML = "";  
    }
}

document.getElementById("addElement").addEventListener("click", () => {
    setNewElementModal("topLevel", false);
    showModal();
    //addElement("topLevel", false);
});

document.getElementById("exportHTML").addEventListener("click", () => {
    exportToHTML();
});

document.getElementById("exportJS").addEventListener("click", () => {
    exportToJS();
});

document.getElementById("modalScreen").addEventListener("click", () => {
    closeModal();
});

createOptions();
