"use strict"

let amountOfLi = 1; //хорошо бы автоматизировать вычисление количества li
let todoList = document.getElementsByClassName('todo-list')[0];

let addingTaskBtn = document.getElementsByClassName('day__add-task-btn')[0];
let list = document.getElementsByClassName('list')[0];
let modal = document.getElementsByClassName('modal')[0];
addingTaskBtn.onclick = createTask;


function createTask(clickEvent) {
    let newLi = document.createElement('li');
    newLi.className = 'list-item';

    let newText = document.createElement('div');
    newText.className = 'list-item__text';
    // newText.textContent = modalTextArea.value;

    let newCheckbox = document.createElement('label');
    newCheckbox.className = 'checkbox';
    let newCheckboxInput = document.createElement('input');
    newCheckboxInput.setAttribute('type', 'checkbox');
    newCheckboxInput.id = `checkbox_${amountOfLi}`;
    let newCheckboxSpan = document.createElement('span');
   
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
        
            clickEvent.target.closest('.day').getElementsByClassName('list')[0].append(newLi);
            newLi.append(newText);
            newLi.append(newCheckbox);
            newCheckbox.append(newCheckboxInput);
            newCheckbox.append(newCheckboxSpan);
    
            amountOfLi++;
        }
    })
    
}


let dayContainer = document.getElementsByClassName('todo-list__day-container')[0];
let addingBlockBtnPrepend = document.getElementsByClassName('todo-list__add-block-btn--upper')[0];
let addingBlockBtnAppend = document.getElementsByClassName('todo-list__add-block-btn--down')[0];

let createBlock = function(clickEvent) {

    let newDay = document.createElement('div');
    newDay.className = 'day';

    let newDayInner = document.createElement('div');
    newDayInner.className = 'day__inner';

    let newDayTitle = document.createElement('div');
    newDayTitle.className = 'day__title';
    newDayTitle.textContent = new Date;
    newDayTitle.onclick = titleEditing;

    let newList = document.createElement('ul');
    newList.className = 'list';

    let newBtn = document.createElement('button');
    newBtn.textContent = 'Добавить';
    newBtn.className = 'day__add-task-btn';

    newBtn.onclick = createTask;
   
    newDay.append(newDayInner);
    newDayInner.append(newDayTitle);
    newDayInner.append(newList);
    newDayInner.append(newBtn);

    if (clickEvent.target.closest('.todo-list__add-block-btn--upper')) dayContainer.prepend(newDay);
    else if (clickEvent.target.closest('.todo-list__add-block-btn--down')) dayContainer.append(newDay);
    else console.log('err'); // как обработать ошибку

    recomposeDays();

}

addingBlockBtnPrepend.onclick = createBlock;
addingBlockBtnAppend.onclick = createBlock;

let titleEditingMenu = document.getElementsByClassName('title-editing-menu')[0];
let titleEditingMenuCancelBtn = document.getElementsByClassName('title-editing-menu__button--cancel')[0];
let titleEditingMenuOkBtn = document.getElementsByClassName('title-editing-menu__button--ok')[0];

function titleEditing(clickEvent) {
    let titleDiv = clickEvent.target.closest('.day__title');
    console.log(titleDiv)

    let titleWidth = parseInt(window.getComputedStyle(titleDiv).width);
    let titleHeight = parseInt(window.getComputedStyle(titleDiv).height);
    let titleText = titleDiv.textContent;

    let inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    inputText.className = 'title-editing-input';
    inputText.value = titleText;

    let titleEditingContainer = document.createElement('div');
    titleEditingContainer.className = 'title-editing-container';

    titleDiv.replaceWith(titleEditingContainer);
    titleEditingContainer.append(inputText);
    titleEditingContainer.append(titleEditingMenu);
    titleEditingMenu.style.display = 'block';
    inputText.focus();

    titleEditingMenuCancelBtn.onclick = function() {
        // document.getElementsByTagName('body')[0].append(titleEditingMenu);
        // titleEditingMenu.style.display = 'none';
        titleEditingContainer.replaceWith(titleDiv);
    }

    titleEditingMenuOkBtn.onclick = function() {
        if (inputText.value != '') titleDiv.textContent = inputText.value;

        // document.getElementsByTagName('body')[0].append(titleEditingMenu);
        // titleEditingMenu.style.display = 'none';
        titleEditingContainer.replaceWith(titleDiv);
    }

    document.addEventListener('click', function(clickEvent) {
        if (clickEvent.target.closest('.title-editing-container') || clickEvent.target == titleDiv) return;

        if (inputText.value != '') titleDiv.textContent = inputText.value;
        titleEditingContainer.replaceWith(titleDiv);
    });



}




let contextMenu = document.getElementsByClassName('context-menu')[0];
todoList.oncontextmenu = listItemRightClickHandler;

function listItemRightClickHandler(clickEvent) {
    if(!clickEvent.target.closest('.list-item')) return false;

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


/* wrapping */
// let day = document.getElementsByClassName('day')[0];
// let dayWidth = parseInt(window.getComputedStyle(day).width);
// console.log('dayw', dayWidth)


// let body = document.querySelector('body');
// let bodyMargins = parseInt(window.getComputedStyle(body).marginRight) + parseInt(window.getComputedStyle(body).marginLeft);

// let todoListPaddings = parseInt(window.getComputedStyle(todoList).paddingRight) + parseInt(window.getComputedStyle(todoList).paddingLeft);

// let windowWidth = document.documentElement.clientWidth - bodyMargins - todoListPaddings;
// let daysInRow = Math.trunc( windowWidth/dayWidth );
// console.log(daysInRow)


// let days = document.getElementsByClassName('day');
// for (let i = 0; i < days.length; i++) {
//     if (i < daysInRow) {
//         days[i].classList.add('day--without-padding-top');
//     }
//     else {
//         days[i].classList.remove('day--without-padding-top');
//     }

//     if ( (i + 1) % daysInRow != 0 ) {
//         days[i].classList.remove('day--last');
//         continue;
//     };

//     days[i].classList.add('day--last');
// }

const maxDaysInRow = 4;
let recomposeDays = function() {
    let days = document.getElementsByClassName('day');

    let day = document.getElementsByClassName('day')[0];
    let dayWidth = parseInt(window.getComputedStyle(day).width);
    console.log('dayw', dayWidth)

    let body = document.querySelector('body');
    let bodyMargins = parseInt(window.getComputedStyle(body).marginRight) + parseInt(window.getComputedStyle(body).marginLeft);

    let todoListPaddings = parseInt(window.getComputedStyle(todoList).paddingRight) + parseInt(window.getComputedStyle(todoList).paddingLeft);
    console.log('todo padd', todoListPaddings);

    let lastDayInRowPadding = parseInt(window.getComputedStyle(day).paddingRight);
    console.log(lastDayInRowPadding)

    let windowWidth = document.documentElement.clientWidth - bodyMargins - todoListPaddings + lastDayInRowPadding;
    console.log('win wid', windowWidth);
    let daysInRow = Math.trunc( windowWidth/dayWidth );
    daysInRow = (daysInRow >= maxDaysInRow) ? maxDaysInRow : daysInRow;
    console.log(daysInRow)
    let daysInLastRow = days.length % daysInRow;

    for (let i = 0; i < days.length; i++) {
        // days[i].classList.remove('day--without-padding-top');
        days[i].classList.remove('day--last-in-row');
        days[i].classList.remove('day--in-column');
        days[i].classList.remove('day--last-row');

        // if (i < daysInRow) {
        //     days[i].classList.add('day--without-padding-top');
        // }

        if (days.length - i <= daysInLastRow && daysInLastRow != 0) {
            days[i].classList.add('day--last-row');
        }

        if (daysInRow == 1) {
            days[i].classList.add('day--in-column');
            continue;
        }

        if ( (i + 1) % daysInRow == 0) {
            days[i].classList.add('day--last-in-row');
        }
        
    }

    if (daysInLastRow == 0) {
        for (let i = days.length - 1; i >= days.length - daysInRow; i--) {
            days[i].classList.add('day--last-row');
        }
    }

    
}

window.addEventListener('resize', recomposeDays);
window.addEventListener('load', recomposeDays);

