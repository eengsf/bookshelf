const eengs = [];
const RENDER_EENG = 'render-eeng';
const SAVED_EENG = 'saved-eeng';
const STORAGE_KEY = 'EENG_APPS';

function randomId() {
   return +new Date();
}

function eengObject(id, title, author, year, isCompleted) {
   return {
      id,
      title,
      author,
      year,
      isCompleted
   }
}

function findEeng(ssId) {
   for (const eengItem of eengs) {
      if (eengItem.id === ssId) {
         return eengItem;
      }
   }
   return null;
}

function findEengIndex(ssId) {
   for (const index in eengs) {
      if (eengs[index].id === ssId) {
         return index;
      }
   }
   return -1;
}

function isStorageExist() {
   if (typeof (Storage) === undefined) {
      alert('Browsermu gaiso kanggo local storage lur');
      return false;
   }
   return true;
}

function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(eengs);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EENG));
   }
}

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      for (const todo of data) {
         eengs.push(todo);
      }
   }
   document.dispatchEvent(new Event(RENDER_EENG));
}

function makeEeng(ssObject) {
   const hslTitle = document.createElement('h3');
   hslTitle.innerText = 'Title  : ' + ssObject.title;

   const hslAuthor = document.createElement('p');
   hslAuthor.innerText = 'Author : ' + ssObject.author;

   const hslyear = document.createElement('p');
   hslyear.innerText = 'Year : ' + ssObject.year;

   const textContainer = document.createElement('div');
   textContainer.classList.add('inner');
   textContainer.append(hslTitle, hslAuthor, hslyear);

   const container = document.createElement('div');
   container.classList.add('book_item');

   container.append(textContainer);
   container.setAttribute('id', `todo-${ssObject.id}`);

   if (ssObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.innerText = 'undo';

      undoButton.addEventListener('click', function () {
         undoTaskFromCompleted(ssObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.innerText = 'remove';

      trashButton.addEventListener('click', function () {
         removeTaskFromCompleted(ssObject.id);
      });

      container.append(undoButton, trashButton);
   } else {
      const checkButton = document.createElement('button');
      checkButton.innerText = 'move shelf';
      checkButton.classList.add('check-button');

      checkButton.addEventListener('click', function () {
         addTaskToCompleted(ssObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.innerText = 'remove';

      trashButton.addEventListener('click', function () {
         removeTaskFromCompleted(ssObject.id);
      });

      container.append(checkButton, trashButton);
   }

   return container;
}

function addEeng() {
   const textTitle = document.getElementById('inputBookTitle').value;
   const textAuthor = document.getElementById('inputBookAuthor').value;
   const textYear = parseInt(document.getElementById('inputBookYear').value);
   const checkbox = document.getElementById('inputBookIsComplete').checked;

   const randomID = randomId();
   const object = eengObject(randomID, textTitle, textAuthor, textYear, checkbox);
   eengs.push(object);

   document.dispatchEvent(new Event(RENDER_EENG));
   saveData();
}

function addTaskToCompleted(ssId) {
   const target = findEeng(ssId);

   if (target == null) return;

   target.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EENG));
   saveData();
}

function removeTaskFromCompleted(ssId) {
   const target = findEengIndex(ssId);

   if (target === -1) return;

   eengs.splice(target, 1);
   document.dispatchEvent(new Event(RENDER_EENG));
   saveData();
}

function undoTaskFromCompleted(ssId) {
   const target = findEeng(ssId);

   if (target == null) return;

   target.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EENG));
   saveData();
}

document.addEventListener('DOMContentLoaded', function () {
   const submitForm = document.getElementById('inputBook');
   const search = document.getElementById('searchBook');
   const checkbox = document.getElementById('inputBookIsComplete');
   const span = document.getElementById('span');
   checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
         span.textContent = 'Selasai dibaca';
      }
      else {
         span.textContent = 'Belum selasai dibaca';
      }
   });

   submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addEeng();
   });
   search.addEventListener('submit', function (event) {
      event.preventDefault();

      const resultContainer = document.getElementById('completeSearchBook');
      resultContainer.innerHTML = '';

      const stitle = document.getElementById('searchBookTitle').value.toLowerCase();
      const filteredData = eengs.filter(item => item.title.toLowerCase().includes(stitle));
      if (stitle === '') {
         resultContainer.innerHTML = '';
         console.log('kosong');
      }
      else if (filteredData.length > 0) {

         filteredData.forEach(item => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('bookItem');

            const hslTitle = document.createElement('h3');
            hslTitle.innerText = 'Title  : ' + item.title;
            bookItem.appendChild(hslTitle);

            const hslAuthor = document.createElement('p');
            hslAuthor.innerText = 'Author  : ' + item.author;
            bookItem.appendChild(hslAuthor);

            const hslyear = document.createElement('p');
            hslyear.innerText = 'Year  : ' + item.year;
            bookItem.appendChild(hslyear);

            resultContainer.appendChild(bookItem);
         });
      }
      else {
         resultContainer.innerHTML = '';
      }

   });

   if (isStorageExist()) {
      loadDataFromStorage();
   }
});

document.addEventListener(SAVED_EENG, function () {
   console.log('Data Berhasil Ditambahkan');
});

document.addEventListener(RENDER_EENG, function () {
   const uncompletedTODOList = document.getElementById('uncompleteBookshelfList');
   uncompletedTODOList.innerHTML = '';

   const completedTODOList = document.getElementById('completeBookshelfList');
   completedTODOList.innerHTML = '';

   for (const item of eengs) {
      const todoElement = makeEeng(item);
      if (!item.isCompleted) {
         uncompletedTODOList.append(todoElement);
      }
      else {
         completedTODOList.append(todoElement);
      }
   }
});

