function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function UI(){}

UI.prototype.addBookToList = function(book){
const list = document.getElementById('book-list');
//create tr element
const row = document.createElement('tr');
//Insert cols
row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a hred="#" class="delete">X</a></td>
`;
list.appendChild(row);
}

UI.prototype.showAlert = function(message, className) {
//Create div
const div = document.createElement('div');
//Add classes
div.className = `alert ${className}`
//Add text
div.appendChild(document.createTextNode(message));
//Get parent
const container = document.querySelector('.container');
//Get form
const form = document.querySelector('#book-form');
//Insert alert
container.insertBefore(div, form);
//Timeout after
setTimeout(function(){
    document.querySelector('.alert').remove();
}, 3000);
}

UI.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

UI.prototype.deleteBook = function(target){
 if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
    } 
}


function Store(){}

Store.prototype.getBooks = function(){
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}

Store.prototype.displayBooks = function(){
    const store = new Store();
    const books = store.getBooks();
    console.log(books)
    books.forEach(function(book) {
        const ui = new UI;

        //add book to UI
        ui.addBookToList(book);
    });
    console.log(books)
}

Store.prototype.addBook = function(book){
    const store = new Store();
    const books = store.getBooks();
    books.push(book);   
    localStorage.setItem('books', JSON.stringify(books));
}

Store.prototype.removeBook = function(isbn) {
    const store = new Store();
    const books = store.getBooks();

    books.forEach(function(book, index){
        if(book.isbn === isbn) {
        books.splice(index, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));
}


//Event Listeners

//Check local storage for books when page loads
document.addEventListener('DOMContentLoaded', function(){
    const store = new Store();
    store.displayBooks();
});

//Add books to list
document.getElementById('book-form').addEventListener('submit', function(e){

//Get form values
const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value

//Instantiate new book
const book = new Book(title, author, isbn);

//Instantiate UI
const ui = new UI();

 //Instantiate Store
 const store = new Store(book);

//Validate
if (title === '' || author === '' || isbn === '') {
    //Error alert
    ui.showAlert('Please fill in all fields', 'error');
} else {
//Add book to list
ui.addBookToList(book);

 // Add to LS
store.addBook(book);

//Show success
ui.showAlert('Book added!', 'success');

//clear fields
ui.clearFields();
}

e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function(e){
    const ui = new UI();
    const store = new Store();
    ui.deleteBook(e.target);
    // Remove from LS
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});