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
    rowOne.appendChild(idInput);

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
    container.appendChild(nestBtn);
    return container;
}


const removeItem = id => {
    document.getElementById(id).remove();
}


document.getElementById("addElement").addEventListener("click", () => {
    addElement("topLevel", false);
});