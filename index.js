"use strict"

let amountOfLi = 0;
let todoList = document.getElementsByClassName('todo-list')[0];

let addingElem = document.getElementsByClassName('list-item--add')[0];
let modal = document.getElementsByClassName('modal')[0];
addingElem.onclick = function() {
    let newLi = document.createElement('li');
    newLi.className = 'list-item';

    let newText = document.createElement('div');
    newText.className = 'list-item__text';
    // newText.textContent = modalTextArea.value;

    let newCheckbox = document.createElement('div');
    newCheckbox.className = 'checkbox';
    let newCheckboxLabel = document.createElement('label');
    newCheckboxLabel.setAttribute('for', `checkbox_${amountOfLi}`);
    let newCheckboxInput = document.createElement('input');
    newCheckboxInput.setAttribute('type', 'checkbox');
    newCheckboxInput.id = `checkbox_${amountOfLi}`;

    newCheckboxInput.onclick = function() {
        if (newCheckboxInput.checked) {
            newLi.classList.add('list-item--done');
        } else {
            newLi.classList.remove('list-item--done');
        }
    }

    new Promise((resolve, reject) => {
        let editedText = editTextOfItem(newText);
        resolve(editedText)
    })
    .then( (editedText) => {
        if (editedText) {
        
            addingElem.before(newLi);
            newLi.append(newText);
            newLi.append(newCheckbox);
            newCheckbox.append(newCheckboxLabel);
            newCheckboxLabel.append(newCheckboxInput);
    
            amountOfLi++;
        }
    })
    
}






let contextMenu = document.getElementsByClassName('context-menu')[0];
todoList.oncontextmenu = listItemRightClickHandler;

function listItemRightClickHandler(clickEvent) {
    // if(clickEvent.which != 3) return;
    if(!clickEvent.target.closest('.list-item') || clickEvent.target.closest('.list-item--add')) return false;

    contextMenu.style.display = 'block';
    contextMenu.style.top = clickEvent.clientY + 'px';
    contextMenu.style.left = clickEvent.clientX + 'px';

    let contextMenuEditButton = document.getElementsByClassName('context-menu__button--edit')[0];
    contextMenuEditButton.onclick = function() {
        new Promise( (resolve, reject) => {
            let editedText = editTextOfItem(clickEvent.target.closest('.list-item').firstChild);
            resolve(editedText);
        })
        .then( (editedText) => {
            if (!editedText) {
                clickEvent.target.closest('.list-item').remove();
            }
        })
    }

    let contextMenuRemoveButton =  document.getElementsByClassName('context-menu__button--remove')[0];
    contextMenuRemoveButton.onclick = function() {
        clickEvent.target.closest('.list-item').remove();
    }

    return false;
}

document.addEventListener('click', function(event) {
    contextMenu.style.display = 'none';
})

document.addEventListener('contextmenu', function(event) {
    if (event.target.closest('.list-item--add')) contextMenu.style.display = 'none';
    if (event.target.closest('.list-item')) return;
    contextMenu.style.display = 'none';
})





let blocker = document.getElementsByClassName('block-interface')[0];
async function editTextOfItem(textDiv) {

    modal.style.display = 'block';
    blocker.style.display = 'block';
    let modalTextArea = document.getElementsByClassName('modal__input')[0];
    let editedText = textDiv.textContent;
    if (editedText) modalTextArea.value = editedText;

    await new Promise( (res, rej) => {

        let modalSaveButton = document.getElementsByClassName('modal__button--save')[0];
        modalSaveButton.onclick = function() {
            editedText = modalTextArea.value
            textDiv.textContent = editedText;
    
            res();
        }
    
        blocker.onclick = function() {
            res();
        }

        let modalCancelButton = document.getElementsByClassName('modal__button--cancel')[0];
        modalCancelButton.onclick = function() {
            res();
        }
    })

    modal.style.display = 'none';
    modalTextArea.value = '';
    blocker.style.display = 'none';
    return editedText;
    
}