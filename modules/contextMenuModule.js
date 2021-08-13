export default function createContextMenu(buttonsArray) {
    console.log(buttonsArray);
    let contextMenuContainer = document.createElement('div');
    contextMenuContainer.className = 'context-menu';

    for (let button of buttonsArray) {

        let newBtn = document.createElement('button');
        newBtn.className = 'context-menu__button';
        newBtn.textContent = button.name;

        newBtn.onclick = button.handler;

        contextMenuContainer.append(newBtn);


    }

    return contextMenuContainer;
}