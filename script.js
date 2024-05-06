// Получаем ссылку на кнопку "Поиск" и результаты поиска
var searchButton = document.getElementById("searchButton");
var searchResultsDiv = document.getElementById("searchResults");

// Добавляем обработчик события для клика по кнопке "Поиск"
searchButton.addEventListener("click", function() {
    var bookTitle = document.getElementById("bookTitle").value;
    var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(bookTitle);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.totalItems > 0) {
                searchResultsDiv.innerHTML = ""; // Очищаем предыдущие результаты поиска

                data.items.forEach(item => {
                    var bookInfo = item.volumeInfo;
                    var title = bookInfo.title;
                    var authors = bookInfo.authors ? bookInfo.authors.join(", ") : "Автор не указан";
                    
                    var bookElement = document.createElement("div");
                    bookElement.classList.add("book");
                    bookElement.innerHTML = `
                        <p>Название книги: ${title}</p>
                        <p>Автор(ы): ${authors}</p>
                        <button class="buyButton" onclick="showBuyForm('${title}', '${authors}')">Купить</button>
                    `;

                    searchResultsDiv.appendChild(bookElement);
                });
            } else {
                searchResultsDiv.innerHTML = "<p>Книги не найдены</p>";
            }
        })
        .catch(error => {
            console.error("Ошибка при выполнении запроса:", error);
            searchResultsDiv.innerHTML = "<p>Произошла ошибка при выполнении запроса</p>";
        });
});

function showBuyForm(title, author) {
    // Показываем форму для покупки
    var buyForm = document.getElementById("buyForm");
    buyForm.style.display = "block";

    // Устанавливаем название книги и автора в скрытые поля формы
    document.getElementById("bookTitleHidden").value = title;
    document.getElementById("bookAuthorHidden").value = author;
}

function submitForm() {
    var formData = new FormData(document.getElementById("myForm"));
    var data = {};
    formData.forEach(function(value, key){
        data[key] = value;
    });

    fetch("https://script.google.com/macros/s/AKfycbwGYgF1iBd1zF2GPOdFaU67U2SkWqZfUx3byZ-bjfp5WEHiHsL1H7840uu6qhLgUOmX/exec", {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert("Данные успешно отправлены");
            document.getElementById("myForm").reset();
            document.getElementById("buyForm").style.display = "none"; // Скрываем форму после отправки данных
        } else {
            alert("Произошла ошибка при отправке данных");
        }
    })
    .catch(error => {
        console.error("Ошибка при отправке данных:", error);
        alert("Произошла ошибка при отправке данных");
    });
}


