// Обработчик клика по ссылке EAN
$(document).on('click', '.ean-link', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    var eanValue = $(this).data('ean'); // Получаем значение EAN из атрибута data-ean
    searchArticles(eanValue); // Вызываем метод с EAN
});

// Обработчик клика по ссылке для получения информации о статье
$(document).on('click', '.get-article-link', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    var articleId = $(this).data('article-id'); // Получаем article-id
    var supplierId = $(this).data('supplier-id'); // Получаем supplier-id
    getArticle(articleId, supplierId); // Вызываем метод getArticle
});

// Обработчик клика по ссылке для получения медиафайлов статьи
$(document).on('click', '.get-article-media-link', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    var articleId = $(this).data('article-id'); // Получаем article-id
    getArticleMedia(articleId); // Вызываем метод getArticleMedia
});

// Обработчик клика по ссылке для получения кроссовых артикулов
$(document).on('click', '.get-crosses', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    var brand = $("#supplierFromTd").data('brand'); // Получаем brand
    var article = $("#article").val(); // Получаем article
    console.log(brand);
    console.log(article);
    getCrosses(article, brand); // Вызываем метод getCrosses
});

// Обработчик клика на ссылку "Получить критерии статьи"
$(document).on('click', '.get-article-criteria-link', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    const artId = $(this).data('article-id'); // Получаем ART_ID из data-атрибута
    getArticleCriteria(artId); // Вызываем функцию getArticleCriteria
});

// Обработчик клика на ссылку "Получить вес детали"
$(document).on('click', '.get-part-weight-link', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    var brand = $("#supplierFromTd").data('brand'); // Получаем brand
    var number = $("#article").val(); // Получаем номер статьи
    getPartWeight(brand, number); // Вызываем метод getPartWeight
});
