"use strict"

import createAndShowContextMenu from './modules/contextMenuModule.js';

let amountOfLi = 0; //хорошо бы автоматизировать вычисление количества li
let idCounterOfBlocks = (localStorage.getItem('idCounterOfBlocks')) ? localStorage.getItem('idCounterOfBlocks') : 0;
let todoList = document.getElementsByClassName('todo-list')[0];

let list = document.getElementsByClassName('list')[0];
let modal = document.getElementsByClassName('modal')[0];


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
        
            clickEvent.target.closest('.block').getElementsByClassName('list')[0].append(newLi);
            newLi.append(newText);
            newLi.append(newCheckbox);
            newCheckbox.append(newCheckboxInput);
            newCheckbox.append(newCheckboxSpan);
    
            amountOfLi++;
        }
    })
    
}


let blockContainer = document.getElementsByClassName('todo-list__block-container')[0];
let addingBlockBtnPrepend = document.getElementsByClassName('todo-list__add-block-btn--upper')[0];
let addingBlockBtnAppend = document.getElementsByClassName('todo-list__add-block-btn--down')[0];

let createBlock = function(clickEvent) {

    let newBlock = document.createElement('div');
    newBlock.className = 'block';

    let newBlockInner = document.createElement('div');
    newBlockInner.className = 'block__inner';

    let newBlockTitle = document.createElement('div');
    newBlockTitle.className = 'block__title';
    newBlockTitle.textContent = new Date;
    newBlockTitle.onclick = titleEditing;

    let newList = document.createElement('ul');
    newList.className = 'list';

    let newBtn = document.createElement('button');
    newBtn.textContent = 'Добавить';
    newBtn.className = 'block__add-task-btn';

    newBtn.onclick = createTask;
   
    newBlock.append(newBlockInner);
    newBlockInner.append(newBlockTitle);
    newBlockInner.append(newList);
    newBlockInner.append(newBtn);

    newBlock.id = 'block-id-' + idCounterOfBlocks;
    idCounterOfBlocks++;

    if (clickEvent.target.closest('.todo-list__add-block-btn--upper')) blockContainer.prepend(newBlock);
    else if (clickEvent.target.closest('.todo-list__add-block-btn--down')) blockContainer.append(newBlock);
    else console.log('err'); // как обработать ошибку

    recomposeBlocks();

}

addingBlockBtnPrepend.onclick = createBlock;
addingBlockBtnAppend.onclick = createBlock;

let titleEditingMenu = document.getElementsByClassName('title-editing-menu')[0];
let titleEditingMenuCancelBtn = document.getElementsByClassName('title-editing-menu__button--cancel')[0];
let titleEditingMenuOkBtn = document.getElementsByClassName('title-editing-menu__button--ok')[0];

function titleEditing(clickEvent) {
    let titleDiv = clickEvent.target.closest('.block__title');
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




todoList.addEventListener('contextmenu', listItemRightClickHandler);
todoList.addEventListener('contextmenu', blockRightClickHandler);

function listItemRightClickHandler(clickEvent) {
    clickEvent.preventDefault();
    if(!clickEvent.target.closest('.list-item')) return;

    // contextMenu.style.display = 'block';
    // contextMenu.style.top = clickEvent.clientY + 'px';
    // contextMenu.style.left = clickEvent.clientX + 'px';

    // let contextMenuEditButton = document.getElementsByClassName('context-menu__button--edit')[0];
    // contextMenuEditButton.onclick = function() {
    //     new Promise( (resolve, reject) => {
    //         let editedText = editTextOfItem(clickEvent.target.closest('.list-item').firstChild);
    //         resolve(editedText);
    //     })
    //     .then( (editedText) => {
    //         if (!editedText) {
    //             clickEvent.target.closest('.list-item').remove();
    //         }
    //     })
    // }

    // let contextMenuRemoveButton =  document.getElementsByClassName('context-menu__button--remove')[0];
    // contextMenuRemoveButton.onclick = function() {
    //     clickEvent.target.closest('.list-item').remove();
    // }

    function editButtonHandler() {
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

    function deleteButtonHandler() {
        clickEvent.target.closest('.list-item').remove();
    }

    createAndShowContextMenu(clickEvent, 'list-item', [
        {name: 'Редактировать', handler: editButtonHandler},
        {name: 'Удалить', handler: deleteButtonHandler}
    ]);

    // let contextMenu = createContextMenu([
    //     {name: 'Редактировать', handler: editButtonHandler},
    //     {name: 'Удалить', handler: deleteButtonHandler}
    // ])

    // let previousContextMenu = document.getElementsByClassName('context-menu')[0];
    // if (previousContextMenu) previousContextMenu.remove();

    // document.getElementsByTagName('body')[0].append(contextMenu);
    // contextMenu.style.position = 'absolute';
    // contextMenu.style.top = clickEvent.clientY + 'px';
    // contextMenu.style.left = clickEvent.clientX + 'px';

    // document.addEventListener('click', function(event) {
    //     contextMenu.remove();
    // })
    
    // document.addEventListener('contextmenu', function(event) {
    //     if (event.target.closest('.list-item')) return;
    //     contextMenu.remove();
    // })
}

function blockRightClickHandler(clickEvent) {
    clickEvent.preventDefault();
    if (clickEvent.target.closest('.list-item') || !clickEvent.target.closest('.block__inner')) return;

    function deleteButtonHandler() {
        clickEvent.target.closest('.block').remove();
        recomposeBlocks();
    }

    createAndShowContextMenu(clickEvent, 'block__inner', [
        {name: 'Удалить', handler: deleteButtonHandler}
    ]);

    // // код повторяется с этого места...
    // let contextMenu = createContextMenu([
    //     {name: 'Удалить', handler: deleteButtonHandler}
    // ])

    // let previousContextMenu = document.getElementsByClassName('context-menu')[0];
    // if (previousContextMenu) previousContextMenu.remove();

    // document.getElementsByTagName('body')[0].append(contextMenu);
    // contextMenu.style.position = 'absolute';
    // contextMenu.style.top = clickEvent.clientY + 'px';
    // contextMenu.style.left = clickEvent.clientX + 'px';

    // document.addEventListener('click', function(event) {
    //     contextMenu.remove();
    // })
    
    // document.addEventListener('contextmenu', function(event) {
    //     if (event.target.closest('.block__inner')) return;
    //     contextMenu.remove();
    // })
    // // ...до этого места



}





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

const maxBlocksInRow = 4;
let recomposeBlocks = function() {
    let blocks = document.getElementsByClassName('block');
    if (!blocks.length) return;

    let block = document.getElementsByClassName('block')[0];
    let blockWidth = parseInt(window.getComputedStyle(block).width);
    console.log('dayw', blockWidth)

    let body = document.querySelector('body');
    let bodyMargins = parseInt(window.getComputedStyle(body).marginRight) + parseInt(window.getComputedStyle(body).marginLeft);

    let todoListPaddings = parseInt(window.getComputedStyle(todoList).paddingRight) + parseInt(window.getComputedStyle(todoList).paddingLeft);
    console.log('todo padd', todoListPaddings);

    let lastBlockInRowPadding = parseInt(window.getComputedStyle(block).paddingRight);
    console.log(lastBlockInRowPadding)

    let windowWidth = document.documentElement.clientWidth - bodyMargins - todoListPaddings + lastBlockInRowPadding;
    console.log('win wid', windowWidth);
    let blocksInRow = Math.trunc( windowWidth/blockWidth );
    blocksInRow = (blocksInRow >= maxBlocksInRow) ? maxBlocksInRow : blocksInRow;
    console.log(blocksInRow)
    let blocksInLastRow = blocks.length % blocksInRow;

    for (let i = 0; i < blocks.length; i++) {
        // days[i].classList.remove('day--without-padding-top');
        blocks[i].classList.remove('block--last-in-row');
        blocks[i].classList.remove('block--in-column');
        blocks[i].classList.remove('block--last-row');

        // if (i < daysInRow) {
        //     days[i].classList.add('day--without-padding-top');
        // }

        if (blocks.length - i <= blocksInLastRow && blocksInLastRow != 0) {
            blocks[i].classList.add('block--last-row');
        }

        if (blocksInRow == 1) {
            blocks[i].classList.add('block--in-column');
            continue;
        }

        if ( (i + 1) % blocksInRow == 0) {
            blocks[i].classList.add('block--last-in-row');
        }
        
    }

    if (blocksInLastRow == 0) {
        for (let i = blocks.length - 1; i >= blocks.length - blocksInRow; i--) {
            blocks[i].classList.add('block--last-row');
        }
    }

    
}

window.addEventListener('resize', recomposeBlocks);
window.addEventListener('load', recomposeBlocks);

