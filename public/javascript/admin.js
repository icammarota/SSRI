//--------------------------------------------- Client Buttons -----------------------------------------------------------------\\
const bookResults = document.getElementById('book_results_container');
const clearBookResults = document.getElementById('reset_results');
// Get Requests
const getBookByName = document.getElementById('get_book_name');
const getBookByAuthor = document.getElementById('get_book_author');
const getAllBooks = document.getElementById('get_book_all');
const getBookEditForm = document.getElementById('get_book_edit_form');
const getAuthorEditForm = document.getElementById('get_author_edit_form');

// Set Requests
const addBook = document.getElementById('add_book');
const editBook = document.getElementById('edit_book');
const deleteBook = document.getElementById('delete_book');
const logout = document.getElementById('admin_logout');
const editBookForm = document.getElementById('edit_book_form');
const editBookFormByAuthor = document.getElementById('edit_book_form_by_author');

// Modals Buttons
const closeAddBook = document.getElementById('add_book_close');
const closeDeleteBook = document.getElementById('delete_book_close');
const closeGetBookByName = document.getElementById('get_book_name_close');
const closeGetBookByAuthor = document.getElementById('get_book_author_close');
const closeEditBook = document.getElementById('edit_book_modal_close');


//--------------------------------------------- Modals -----------------------------------------------------------------\\
/**
 * Opens the 'Add Book' modal.
 */
 addBook.addEventListener('click', ()=> {
    document.getElementById('add_book_modal').className = 'modal';
    document.getElementById('background_wall').classList.remove('hidden');
});

/**
 * Closes the 'Add Book' modal.
 */
closeAddBook.addEventListener('click',()=>{
    document.getElementById('add_book_modal').className = 'hidden';
    document.getElementById('background_wall').className = 'hidden';
});

/**
 * Opens the 'Delete Book' modal.
 */
deleteBook.addEventListener('click', ()=>{
    document.getElementById('delete_book_modal').className = 'modal';
    document.getElementById('background_wall').classList.remove('hidden');
});

/**
 * Closes the 'Delete Book' modal.
 */
closeDeleteBook.addEventListener('click', ()=>{
    document.getElementById('delete_book_modal').className = 'hidden';
    document.getElementById('background_wall').className = 'hidden';
});

/**
 * Opens the 'Get Book By Name' modal.
 */
getBookByName.addEventListener('click', ()=>{
    document.getElementById('get_book_name_modal').className = 'search_modal';
    document.getElementById('background_wall').classList.remove('hidden');
});

/**
 * Closes the 'Get Book By Name; modal.
 */
closeGetBookByName.addEventListener('click', ()=>{
    document.getElementById('get_book_name_modal').className = 'hidden';
    document.getElementById('background_wall').className = 'hidden';
});

/**
 * Opens the 'Get Book By Author' modal.
 */
getBookByAuthor.addEventListener('click',()=>{
    document.getElementById('get_book_author_modal').className = 'search_modal';
    document.getElementById('background_wall').classList.remove('hidden');
});

/**
 * Closes the 'Get Book By Author' modal.
 */
closeGetBookByAuthor.addEventListener('click',()=>{
    document.getElementById('get_book_author_modal').className = 'hidden';
    document.getElementById('background_wall').className = 'hidden';
});

/**
 * Removes all recent searches in the book result container.
 */
clearBookResults.addEventListener('click',()=>{
    bookResults.innerHTML = '';
});

/**
 * Logout the admin user by clearing the token and sends a logout request to the server.
 */
logout.addEventListener('click',()=>{
    Logout();
    localStorage.clear();
});

/**
 * Opens the 'Edit Book' modal.
 */
editBook.addEventListener('click', ()=>{
    document.getElementById('edit_book_modal').classList.remove('hidden');
});

/**
 * Closes the 'Edit Book' modal.
 */
closeEditBook.addEventListener('click', ()=>{
    document.getElementById('edit_book_modal').className = 'hidden';
});

//--------------------------------------------- Server Requests -----------------------------------------------------------------\\
const bookCover = document.getElementById('book_cover');
const addBookRequest = document.getElementById('add_book_form');
const deleteBookRequest = document.getElementById('delete_book_form');
const searchBookByName = document.getElementById('get_book_name_form');
const searchBookByAuthor = document.getElementById('get_book_author_form');

/**
 * Breaks the 'Add Book' information into an object and sends the request to the server if all information valid.
 */
addBookRequest.addEventListener('submit', (e)=>{
    e.preventDefault();
    let fileSelect = document.getElementById('book_cover').files;
    if( fileSelect.length > 0 ){
        let file = fileSelect[0];
        const fileReader = new FileReader();
        fileReader.onload = function(FileLoadEvent){
            var srcData = FileLoadEvent.target.result;
            const book = { name: addBookRequest.children[0].value,
                author: addBookRequest.children[1].value,year: addBookRequest.children[2].value,genre: addBookRequest.children[3].value,
                description: addBookRequest.children[4].value, image: srcData };
            closeAddBook.click(); addBookRequest.reset();
            if( book.name && book.author && book.year && book.genre && book.description && book.image)
                AddBook(book);
            else
                alert('Missing book information.');
        } 
        fileReader.readAsDataURL(file);
    }
    else
        alert('Missing Book Cover.')
});

/**
 * Sends a search request to the server.
 */
async function SearchBook(book)
{
    const res = await fetch('/books/search/'+ book ,{
        method: 'GET'
    });
    const data = await res.json();
    bookResults.innerHTML = '';
    if (data&&data.length>0) {
        for (let index = 0; index < data.length; index++) {            
            BookResults(data[index]);
        }
    }

}

/**
 * Sends a search request to the server.
 */
async function SearchAuthor(author)
{
    const res = await fetch('/books/search-author/'+ author ,{
        method: 'GET'
    });
    const data = await res.json();
    bookResults.innerHTML = '';
    if (data&&data.length>0) {
        for (let index = 0; index < data.length; index++) {            
            BookResults(data[index]);
        }
    }

}


/**
 * Adds a book to the data base ( Server Request ).
 */
async function AddBook(book)
{
    const res = await fetch('/books/add',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json',token: localStorage.getItem('token') },
        body: JSON.stringify(book)
    });
    const data = await res.json();
    if( data.Message){
        alert(data.Message);
        return;
    }
    SearchBook(book.name);
    alert('Libro aggiunto. Controlla i risultati.');
}

/**
 * Gets the book name from the delete form request and calls for the delete request.
 */
deleteBookRequest.addEventListener('submit',(e)=>{
    e.preventDefault();
    const bookName = deleteBookRequest.children[0].value;
    deleteBookRequest.reset();
    if( bookName )
        DeleteBook(bookName);
    else{
        const deleteModal = document.getElementById('delete_book_modal');
        const p = document.createElement('p');
        p.innerHTML = 'Missing book name.'; p.className = 'error';
        deleteModal.insertBefore(p,deleteModal.children[2]);
        setTimeout(() => {
            deleteModal.removeChild(p);
        }, 2000);
    }
});

/**
 * Sends a delete request to the server.
 */
async function DeleteBook(bookName)
{
    const res = await fetch('/books/' + bookName,{
        method: 'DELETE',
        headers: { token: localStorage.getItem('token') }
    });
    const data = await res.json();
    if( data.Message ){
        const deleteModal = document.getElementById('delete_book_modal');
        const p = document.createElement('p');
        p.innerHTML = data.Message; p.className = 'error';
        deleteModal.insertBefore(p,deleteModal.children[2]);
        setTimeout(() => {
            deleteModal.removeChild(p);
        }, 2000);
    }
    else{
        GetAllBooks();
        closeDeleteBook.click();
        alert('Book successfully deleted from DB.');
    }
}

/**
 * Gets the book name from the search form and calls for the search request.
 */
searchBookByName.addEventListener('submit', (e)=>{
    e.preventDefault();
    const bookName = searchBookByName.children[0].value;
    searchBookByName.reset();
    if( bookName )
        SearchBookName(bookName);
    else{
        const searchModal = document.getElementById('get_book_name_modal');
        const p = document.createElement('p');
        p.innerHTML = 'Missing book name.'; p.className = 'error';
        searchModal.insertBefore(p,searchModal.children[2]);
        setTimeout(() => {
            searchModal.removeChild(p);
        }, 2000);
    }
});

/**
 * Gets the book author from the search from and calls for the search request.
 */
searchBookByAuthor.addEventListener('submit', (e)=>{
    e.preventDefault();
    const bookAuthor = searchBookByAuthor.children[0].value;
    searchBookByAuthor.reset();
    if( bookAuthor )
        SearchBookAuthor(bookAuthor);
    else{
        const searchModal = document.getElementById('get_book_author_modal');
        const p = document.createElement('p');
        p.innerHTML = 'Missing book author.'; p.className = 'error';
        searchModal.insertBefore(p,searchModal.children[2]);
        setTimeout(() => {
            searchModal.removeChild(p);
        }, 2000);
    }
});

/**
 * Get all books existing in the data base.
 */
getAllBooks.addEventListener('click', ()=>{
    GetAllBooks();
});

/**
 * Sends a requests to the server for all existing books.
 */
async function GetAllBooks()
{
    const res = await fetch('/books',{
        method: 'GET',
    });
    const data = await res.json();
    clearBookResults.click();
    for(let i = 0; i < data.length; i++)
        BookResults(data[i]);
}

/**
 * Sends a search request to the server and returns the book.
 */
async function SearchBookName(searchValue)
{
    const res = await fetch('/books/name/' + searchValue,{
        method: 'GET'
    });
    const data = await res.json();
    if( data.Message ){
        const searchModal = document.getElementById('get_book_name_modal');
        const p = document.createElement('p');
        p.innerHTML = data.Message; p.className = 'error';
        searchModal.insertBefore(p,searchModal.children[2]);
        setTimeout(() => {
            searchModal.removeChild(p);
        }, 2000);
    }
    else
    {
        bookResults.innerHTML = '';
        BookResults(data);
    }
}

/**
 * Sends a search request to the server and returns the book.
 */
async function SearchBookAuthor(searchValue)
{
    const res = await fetch('/books/author/' + searchValue,{
        method: 'GET'
    });
    const data = await res.json();
    if( data.Message ){
        const searchModal = document.getElementById('get_book_author_modal');
        const p = document.createElement('p');
        p.innerHTML = data.Message; p.className = 'error';
        searchModal.insertBefore(p,searchModal.children[2]);
        setTimeout(() => {
            searchModal.removeChild(p);
        }, 2000);
    }
    else
    {
        bookResults.innerHTML = '';
        for(let i = 0; i < data.length; i++ )
            BookResults(data[i]);
    } 
}

/**
 * Inserts a book from the data base to the result container with information included.
 */
function BookResults(book)
{
    const container = document.createElement("div");
    container.className = 'book_result';
    const img = document.createElement("img");
    img.src = book.image;
    const bookInfo = document.createElement("div");
    const title = document.createElement('p');
    title.innerHTML = '<b>Nome:</b> ' + book.name + ' , <b>Autore:</b> ' + book.author + ' , <b>Anno:</b> ' + book.year + ' , <b>Genere:</b> ' + book.genre;
    const description = document.createElement('p');
    description.innerHTML = book.description;
    
    bookInfo.appendChild(title);
    bookInfo.appendChild(description);
    container.appendChild(img);
    container.appendChild(bookInfo);
    bookResults.appendChild(container);

    document.getElementById('get_book_name_modal').className = 'hidden';
    document.getElementById('get_book_author_modal').className = 'hidden';
    document.getElementById('background_wall').className = 'hidden';
}

/**
 * Sends a logout request to the server.
 */
async function Logout()
{
    await fetch('/admin/logout', {
        method: 'GET',
        headers: { token: localStorage.getItem('token') }
    });
    window.location.href = 'login';
}

/**
 * Sends a search request to get the book to edit and fill the edit form.
 */
getBookEditForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if( getBookEditForm.children[0].value.length === 0 )
        return;
    SearchBookToEdit(getBookEditForm.children[0].value);
});

/*
getAuthorEditForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if( getAuthorEditForm.children[0].value.length === 0 )
        return;
        console.log(getAuthorEditForm.children[0].value);
    SearchBookToEditByAuthor(getAuthorEditForm.children[0].value);
});
*/




/**
 * Edits the book if exist according to the user input.
 */
async function SearchBookToEdit(book)
{
    const res = await fetch('/books/name/'+book,{
        method: 'GET'
    });
    const data = await res.json();
    if( data.Message ){
        const editModal = document.getElementById('edit_book_modal');
        if( editModal.children[2].className === 'hidden'){
            editModal.children[2].innerHTML = data.Message;
            editModal.children[2].className = 'error';
        }
        setTimeout(() => {
            editModal.children[2].className = 'hidden';
            editModal.children[2].innerHTML = '';
        }, 2000);
        return;
    }  
    console.log(editBookForm);
    const name = editBookForm.children[0].children[0];
    const author = editBookForm.children[0].children[1];
    const year = editBookForm.children[0].children[2];
    const genre = editBookForm.children[0].children[3];
    const description = editBookForm.children[1];
    for( let i = 0; i < editBookForm.children[0].children.length; i++)
        editBookForm.children[0].children[i].disabled = false;
    editBookForm.children[1].disabled = false; editBookForm.children[2].disabled = false;
    name.value = data.name; author.value = data.author; year.value = data.year; genre.value = data.genre;
    description.value = data.description;
}
/*
async function SearchBookToEditByAuthor(Author)
{
    const res = await fetch('/books/author/'+Author,{
        method: 'GET'
    });
    const data = await res.json();
    if( data.Message ){
        const editModal = document.getElementById('edit_book_modal');
        if( editModal.children[2].className === 'hidden'){
            editModal.children[2].innerHTML = data.Message;
            editModal.children[2].className = 'error';
        }
        setTimeout(() => {
            editModal.children[2].className = 'hidden';
            editModal.children[2].innerHTML = '';
        }, 2000);
        return;
    }  
    const name = editBookFormByAuthor.children[0].children[0];
    const author = editBookFormByAuthor.children[0].children[1];
    const year = editBookFormByAuthor.children[0].children[2];
    const genre = editBookFormByAuthor.children[0].children[3];
    const description = editBookFormByAuthor.children[1];
    for( let i = 0; i < editBookFormByAuthor.children[0].children.length; i++)
        editBookFormByAuthor.children[0].children[i].disabled = false;
    editBookFormByAuthor.children[1].disabled = false; editBookFormByAuthor.children[2].disabled = false;
    name.value = data.name; author.value = data.author; year.value = data.year; genre.value = data.genre;
    description.value = data.description;
}
*/

/**
 * Breaks the book data into an object and sends an edit request to the server.
 */
editBookForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = editBookForm.children[0].children[0].value;
    const author = editBookForm.children[0].children[1].value;
    const year = editBookForm.children[0].children[2].value;
    const genre = editBookForm.children[0].children[3].value;
    const description = editBookForm.children[1].value;
    EditBook(name, {name,author,year,genre,description} );
});

/*
editBookFormByAuthor.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = editBookFormByAuthor.children[0].children[0].value;
    const author = editBookFormByAuthor.children[0].children[1].value;
    const year = editBookFormByAuthor.children[0].children[2].value;
    const genre = editBookFormByAuthor.children[0].children[3].value;
    const description = editBookFormByAuthor.children[1].value;
    EditBook(editBookFormByAuthor.children[0].value, {name,author,year,genre,description} );
});
*/

/**
 * Sends an edit request to the server.
 */
async function EditBook(bookName, bookInfo)
{
    const res = await fetch('/books/edit/'+bookName,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',token: localStorage.getItem('token') },
        body: JSON.stringify(bookInfo)
    });
    const data = await res.json();
    const editModal = document.getElementById('edit_book_modal');
    if( data.Message ){
        if( editModal.children[5].className === 'hidden'){
            editModal.children[5].innerHTML = data.Message;
            editModal.children[5].className = 'error';
        }
        setTimeout(() => {
            editModal.children[5].className = 'hidden';
            editModal.children[5].innerHTML = '';
        }, 5000);
        return;
    }
    if( editModal.children[5].className === 'hidden'){
        editModal.children[5].innerHTML = 'Edited book successfully.'
        editModal.children[5].className = 'success';
    }
    setTimeout(() => {
        editModal.children[5].className = 'hidden';
        editModal.children[5].innerHTML = '';
    }, 3000);
    getBookEditForm.reset();
    editBookForm.reset();
   // editBookFormByAuthor.reset();
}








// setInterval(  () => {
//     CheckAuthAdmin();
// },1000);

// async function CheckAuthAdmin()
// {
//     const res = await fetch('/admin-verify-token', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' }
//     });
//     const data = await res.json();
//     console.log(data)
//     if( data.Message ){
//         window.location.href = 'login';
//         alert('No Authentication');
//     }
// }