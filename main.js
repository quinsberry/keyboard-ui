let dataB = {
  "accounts": [
    {
      "title": "lorem ipsum 1",
      "img": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    },
    {
      "title": "lorem ipsum 2",
      "img": "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    },
    {
      "title": "lorem ipsum 3",
      "img": "https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    }
  ]
}

let state = {
  localData: null,
  screen1: {
    selectedFirstScreen: true,
    selectedItem: null,
    indexCounter: 0
  },
  screen2: {
    inputValue: '',
    lastButton: 'input'
  }
}

let { localData } = state
let { selectedFirstScreen, selectedItem, indexCounter } = state.screen1

// ------- Creating constants for html elements -------
const accountsContainer = document.querySelector('[data-accounts]')
const addBtn = document.querySelector('[data-add-btn]')
const accountItems = document.querySelector('[data-accounts-items]')

const screen1 = document.querySelector('[data-screen-1]')
const screen2 = document.querySelector('[data-screen-2]')

const input = document.querySelector('[data-input]')
const add = document.querySelector('[data-add-title]')
const cancel = document.querySelector('[data-cancel]')



//  ------- utils functions -------

const handleChange = (value) => {
  state.screen2.inputValue = value
}

// --------------------------------

// ------- Switching screens function -------

const screensToggle = () => {
  if (selectedFirstScreen) {
    screen1.classList.add('hidden')
    screen2.classList.remove('hidden')
    selectedFirstScreen = false
    return
  }

  screen1.classList.remove('hidden')
  screen2.classList.add('hidden')
  selectedFirstScreen = true
}

// ------- Adding new account function  -------
// Adding new account to localData => Sending localData to database 

const addNewAccount = () => {
  const obj = {
    title: state.screen2.inputValue,
    img: 'https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
  }

  localData.accounts = [...localData.accounts, obj]
  sendData(localData)
  state.screen2.inputValue = ''
}

// ------- Sending payload to database
const sendData = (payload) => {
  dataB = payload
}

// ------- Deleting account funciton -------
// Filtrating all not selected accounts to localData => Sending localData to database 

const deleteAccountItem = () => {
  localData.accounts = localData.accounts.filter((account, index) => {
    if (index !== indexCounter)
      return account
  })
  sendData(localData)
}



// ------- Keys Logic -------

const logKey = e => {
  MovingLogic(e.code)
}

const MovingLogic = (keyName) => {

  if (selectedItem === 'add') {

    if (keyName === 'Enter') {
      if (state.screen2.inputValue.length) {
        add.onclick = addNewAccount()
        render()
        screensToggle()
        selectedItem = 'addBtn'
        input.classList.remove('active')
        addBtn.classList.add('active')
        addBtn.focus()
        return
      }
    }

    if (keyName === 'ArrowUp') {
      selectedItem = 'input'
      add.classList.remove('active')
      input.classList.add('active')
      input.focus()
      state.screen2.lastButton = 'add'
    }

    if (keyName === 'ArrowRight') {
      selectedItem = 'cancel'
      add.classList.remove('active')
      cancel.classList.add('active')
      cancel.focus()
    }
  }

  if (selectedItem === 'cancel') {

    if (keyName === 'Enter') {
      screensToggle()
      selectedItem = 'addBtn'
      cancel.classList.remove('active')
      addBtn.classList.add('active')
      addBtn.focus()
      state.screen2.inputValue = ''
      state.screen2.lastButton = 'add'

      return
    }

    if (keyName === 'ArrowUp') {
      selectedItem = 'input'
      cancel.classList.remove('active')
      input.classList.add('active')
      input.focus()
      state.screen2.lastButton = 'cancel'
    }

    if (keyName === 'ArrowLeft') {
      selectedItem = 'add'
      cancel.classList.remove('active')
      add.classList.add('active')
      add.focus()
    }
  }

  if (selectedItem === 'input') {
    input.value = state.screen2.inputValue
    input.oninput = () => handleChange(input.value)

    if (keyName === 'ArrowDown') {
      if (state.screen2.lastButton !== 'cancel') {
        selectedItem = 'add'
        input.classList.remove('active')
        add.classList.add('active')
        add.focus()
        return
      }
      selectedItem = 'cancel'
      input.classList.remove('active')
      cancel.classList.add('active')
      cancel.focus()
    }
  }

  if (selectedItem === 'addBtn') {

    if (keyName === 'ArrowLeft') {

      if (accountItems.childElementCount === 0) {
        return
      }

      selectedItem = 'accountItems'
      accountItems.children[indexCounter].classList.add('active')
      accountItems.children[indexCounter].focus()
      addBtn.classList.remove('active')
      return
    }


    if (keyName === 'Enter') {
      input.value = ''
      screensToggle()
      selectedItem = 'input'
      add.classList.remove('active')
      input.classList.add('active')
      input.focus()
      return
    }
  }

  if (selectedItem === 'accountItems') {


    if (keyName === 'ArrowLeft') {
      deleteAccountItem()
      render()
      indexCounter = 0
      if (accountItems.childElementCount === 0) {
        selectedItem = 'addBtn'
        addBtn.classList.add('active')
        addBtn.focus()
        return
      }
      accountItems.children[indexCounter].classList.add('active')
      accountItems.children[indexCounter].focus()
      return
    }


    if (keyName === 'ArrowDown') {
      if (indexCounter === accountItems.childElementCount - 1) {
        accountItems.children[indexCounter].classList.remove('active')
        indexCounter = 0
        accountItems.children[indexCounter].classList.add('active')
        accountItems.children[indexCounter].focus()
        return
      }


      accountItems.children[indexCounter].classList.remove('active')
      indexCounter = indexCounter + 1
      accountItems.children[[indexCounter]].classList.add('active')
      accountItems.children[[indexCounter]].focus()
      return
    }


    if (keyName === 'ArrowUp') {
      if (indexCounter === 0) {
        accountItems.children[indexCounter].classList.remove('active')
        indexCounter = accountItems.childElementCount - 1
        accountItems.children[indexCounter].classList.add('active')
        accountItems.children[indexCounter].focus()
        return
      }

      accountItems.children[indexCounter].classList.remove('active')
      indexCounter = indexCounter - 1
      accountItems.children[indexCounter].classList.add('active')
      accountItems.children[indexCounter].focus()
      return
    }

    if (keyName === 'ArrowRight') {

      selectedItem = `addBtn`
      accountItems.children[indexCounter].classList.remove('active')

      addBtn.classList.add('active')
      addBtn.focus()
      return
    }
  }
}

// --------------------------



// Rendering account elements function
const setAccounts = () => {
  while (document.querySelector('.mainSection__sidebar--item')) {
    document.querySelector('.mainSection__sidebar--item').remove()
  }

  if (!localData.accounts.length) {
    return
  }

  localData.accounts.forEach(item => {
    const accountElement = document.createElement('button')
    accountElement.classList.add(`mainSection__sidebar--item`)
    const img = new Image(45, 45)
    const title = document.createElement('span')

    img.src = item.img
    title.innerText = item.title

    accountElement.appendChild(img)
    accountElement.appendChild(title)
    accountItems.appendChild(accountElement)
  })
}

// ------- Setting funtion -------
// "Fetching" data from database and setting it to localData
const setData = () => {
  localData = dataB
}



// ------- Starts when application was loaded -------
const mounted = () => {
  setData()
  setAccounts()
  addBtn.focus()
  selectedItem = 'addBtn'
}

// ------- Rendering page function -------
const render = () => {
  setAccounts()
}


// ------- Starting point -------
document.addEventListener('keydown', logKey)
mounted()




