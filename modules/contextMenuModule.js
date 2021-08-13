export default function createAndShowContextMenu(clickEvent, elementClassName, buttonsArray) {
    console.log(buttonsArray);
    let contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';

    for (let button of buttonsArray) {

        let newBtn = document.createElement('button');
        newBtn.className = 'context-menu__button';
        newBtn.textContent = button.name;

        newBtn.onclick = button.handler;

        contextMenu.append(newBtn);


    }

    // return contextMenuContainer;

    let previousContextMenu = document.getElementsByClassName('context-menu')[0];
    if (previousContextMenu) previousContextMenu.remove();

    document.getElementsByTagName('body')[0].append(contextMenu);
    contextMenu.style.position = 'absolute';
    contextMenu.style.top = clickEvent.clientY + 'px';
    contextMenu.style.left = clickEvent.clientX + 'px';

    document.addEventListener('click', function(event) {
        contextMenu.remove();
    })
    
    document.addEventListener('contextmenu', function(event) {
        if (event.target.closest('.' + elementClassName)) return;
        contextMenu.remove();
    })
}