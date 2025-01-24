// Обновленная функция searchArticles
function searchArticles(searchNumber) {
    const apiUrl = `https://api.partsapi.ru/?method=searchArticles&key=13da941431e45112cea3264dda191863&SEARCH_NUMBER=${searchNumber}&LANG=16`;
    
    // Показываем анимацию загрузки
    $("#loading").show();

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response); // Выводим результат в консоль
            $("#partsList").empty(); // Очищаем предыдущие данные

            if (Array.isArray(response) && response.length > 0) {
                var supplierId = $("#supplierFromTd").data('supplier-id'); 
                console.log(supplierId)
                response.forEach(function(part) {
                    $("#partsList").append(
                        `<li data-article-id="${part.ART_ID}">
                            <strong>Артикул:</strong> ${part.ART_ARTICLE_NR}<br>
                            <strong>Название:</strong> ${part.ART_PRODUCT_NAME}<br>
                            <strong>Бренд:</strong> ${part.ART_SUP_BRAND}<br>
                            <strong>Найдено через:</strong> ${part.FOUND_VIA}<br>
                            <a href="#" class="get-article-media-link" data-article-id="${part.ART_ID}">Медиафайлы</a><br/>
                            <a href="#" class="get-crosses">Аналоги из CROSSBASE.RU</a><br/>
                            <a href="#" class="get-article-criteria-link" data-article-id="${part.ART_ID}">Полная информация об артикуле из TECDOC 2024</a><br/>
                            <a href="#" class="get-part-weight-link">Вес детали</a>
                        </li>`
                    );
                });                             
                $("#partsInfo").show(); // Показываем блок с информацией
            } else {
                $("#partsList").append('<li>Запчасти не найдены.</li>');
                $("#partsInfo").show(); // Показываем блок даже если нет данных
            }
        },
        error: function(xhr, status, error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        },
        complete: function() {
            // Скрываем анимацию загрузки после завершения запроса (успех или ошибка)
            $("#loading").hide();
        }
    });
}

// Функция для запроса информации о статье
function getArticle(artNum, supId) {
    const apiUrl = `https://api.partsapi.ru/?method=getArticle&key=a7ea438b2fa4a5d8101d1a2c30ae8152&LANG=16&ART_NUM=${artNum}&SUP_ID=${supId}`;
    console.log(apiUrl)
    // Показываем анимацию загрузки
    $("#loading").show();

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("Ответ от API:", response); // Выводим результат в консоль
            // Обработка ответа (если необходимо)
            // Например, вы можете обновить интерфейс или вывести данные пользователю
        },
        error: function(xhr, status, error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        },
        complete: function() {
            // Скрываем анимацию загрузки после завершения запроса (успех или ошибка)
            $("#loading").hide();
        }
    });
}

// Функция для запроса медиафайлов статьи
function getArticleMedia(artId) {
    const apiUrl = `https://api.partsapi.ru/?method=getArticleMedia&key=831ecbd71823d2827768fdcaf25e26ee&ART_ID=${artId}&LANG=16`;
    console.log(apiUrl);
    
    // Показываем анимацию загрузки
    $("#loading").show();

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("Ответ от API getArticleMedia:", response); // Выводим результат в консоль
            
            // Заменяем ссылку на медиафайлы
            displayMedia(response, artId);
        },
        error: function(xhr, status, error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        },
        complete: function() {
            // Скрываем анимацию загрузки после завершения запроса (успех или ошибка)
            $("#loading").hide();
        }
    });
}

// Функция для запроса кроссовых артикулов
function getCrosses(number, brand) {
    const apiUrl = `https://api.partsapi.ru/?method=getCrossesWithBrand&key=b19f785b5e4e2b3c2279b7e9deacfc76&number=${number}&brand=${brand}`;
    console.log(apiUrl);
    
    // Показываем анимацию загрузки
    $("#loading").show();

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("Ответ от API getCrossesWithBrand:", response); // Выводим результат в консоль
            displayCrosses(response);
        },
        error: function(xhr, status, error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        },
        complete: function() {
            // Скрываем анимацию загрузки после завершения запроса (успех или ошибка)
            $("#loading").hide();
        }
    });
}

// Пример вызова функции после успешного запроса
function getArticleCriteria(artId) {
    const apiUrl = `https://api.partsapi.ru/?method=getArticleCriteria&key=cb5871d2d395944e05d679ef5a3f3c29&ART_ID=${artId}&LANG=16`;
    console.log(apiUrl);

    // Показываем анимацию загрузки
    $("#loading").show();

    // Выполняем AJAX-запрос
    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("Ответ от API:", response);
            
            // Отображаем критерии
            displayCriteria(response);
            
            // Показываем блок информации, если скрыт
            $("#partsInfo").show();
        },
        error: function(xhr, status, error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        },
        complete: function() {
            // Скрываем анимацию загрузки
            $("#loading").hide();
        }
    });
}



function getPartWeight(brand, number) {
    const apiUrl = `https://api.partsapi.ru/?method=getPartWeight&key=3cb234cabfba9a0775b4e804420916d5&brand=${encodeURIComponent(brand)}&number=${encodeURIComponent(number)}`;
    console.log(apiUrl);

    // Показываем анимацию загрузки
    $("#loading").show();

    // Выполняем AJAX-запрос
    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("Ответ от API:", response);

            if (response && response.length > 0 && response[0].weight) {
                const weightData = response[0];
                const weightText = `<strong>Вес:</strong> ${weightData.weight} ${weightData.unit}`;
                $("#partWeight").html(weightText);
                $("#weightContainer").show();
            } else {
                $("#partWeight").html("Вес не найден");
                $("#weightContainer").show();
            }
        },
        error: function(xhr, status, error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
            $("#partWeight").html("Ошибка при получении данных");
            $("#weightContainer").show();
        },
        complete: function() {
            // Скрываем анимацию загрузки
            $("#loading").hide();
        }
    });
}