/*
window.onload = () => {
    const children = document.getElementById('options').children
    for (const child of children) {
        const tabTitle = child.querySelector('p').innerHTML

        child.addEventListener('click', () => {
            setActiveCategory(tabTitle)
            colorActiveTabBtn(children)
            child.classList.add('bg-gray-100')
        })
    }
}

function setActiveCategory (name) {
    if (name === 'Create new board') {
        disableAllCategoryTabsBut('planning-widget')
    } else if (name === 'Communication') {
        disableAllCategoryTabsBut('communication-widget')
    } else if (name === 'Writing') {
        disableAllCategoryTabsBut('writing-widget')
    } else if (name === 'Version control') {
        disableAllCategoryTabsBut('version-control-widget')
    } else if (name === 'UML/Tools') {
        disableAllCategoryTabsBut('uml-tools-widget')
    } else if (name === 'File sharing') {
        disableAllCategoryTabsBut('file-sharing-widget')
    }
}

function disableAllCategoryTabsBut(id) {
    const widgetContainers = document.getElementById('dynamic').children
    for (const widgetContainer of widgetContainers) {
        if (widgetContainer.id === id) {
            widgetContainer.classList.remove('hidden')
        } else {
            widgetContainer.classList.add('hidden')
        }
    }
}

function colorActiveTabBtn(btns) {
    for (const btn of btns) {
        btn.classList.remove('bg-gray-100')
    }
}*/