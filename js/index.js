const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const textBook = document.getElementById("title").value;
  const writer = document.getElementById("author").value;
  const timestamp = document.getElementById("year").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    textBook,
    writer,
    timestamp,
    false
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year :parseInt(year),
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h1");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("h2");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("number");
  textYear.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  const trashButton = document.createElement("button");
  trashButton.classList.add("trash-button");

  trashButton.addEventListener("click", function () {
    removeTaskFromCompleted(bookObject.id);
  });

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(bookObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });

    container.append(checkButton, trashButton);
  }
  return container;

  function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
  const uncompletedBOOKList = document.getElementById("books");
  uncompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completed-books");
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) uncompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
