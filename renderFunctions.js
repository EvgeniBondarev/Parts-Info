// Функция для отображения критериев статьи
function displayCriteria(criteriaArray) {
    // Очищаем предыдущие критерии
    $("#criteriaList").empty();

    if (criteriaArray.length > 0) {
        criteriaArray.forEach(function(criteria) {
            const criteriaElement = `<li><strong>${criteria.CRITERIA_NAME}:</strong> ${criteria.CRITERIA_VALUE || "Нет данных"}</li>`;
            $("#criteriaList").append(criteriaElement);
        });
    } else {
        $("#criteriaList").append("<li>Критерии не найдены</li>");
    }
}

// Функция для отображения кроссовых артикулов
function displayCrosses(crossesArray) {
    // Очищаем предыдущие кроссовые артикулы
    $("#crossesList").empty();

    if (crossesArray.length > 0) {
        crossesArray.forEach(function(cross) {
            const crossElement = `<li><strong>Бренд:</strong> ${cross.brand2}, <strong>Артикул:</strong> ${cross.number2}</li>`;
            $("#crossesList").append(crossElement);
        });
    } else {
        $("#crossesList").append("<li>Кроссовые артикулы не найдены</li>");
    }
}

// Функция для отображения медиафайлов и записи их в новый блок
function displayMedia(mediaArray, artId) {
    // Очищаем предыдущие медиафайлы
    $("#mediaContainer").empty();

    mediaArray.forEach(function(media) {
        let mediaElement;
        
        // Проверяем тип медиа и создаем соответствующий элемент
        switch (media.ART_MEDIA_TYPE) {
            case "BMP":
            case "JPG":
            case "JPEG":
            case "PNG":
                // Преобразуем в WebP для отображения
                mediaElement = `<img src="${media.ART_MEDIA_SOURCE.replace(/\.(bmp|jpg|jpeg|png)$/i, '.webp')}" alt="Image" style="max-width: 200px; max-height: 150px; margin-right: 10px;"></br>`;
                break;
            case "PDF":
                mediaElement = `<a href="${media.ART_MEDIA_SOURCE}" target="_blank">PDF Файл</a></br>`;
                break;
            case "URL":
                mediaElement = `<a href="${media.ART_MEDIA_SOURCE}" target="_blank">Гиперссылка</a></br>`;
                break;
            case "GIF":
                mediaElement = `<img src="${media.ART_MEDIA_SOURCE}" alt="GIF" style="max-width: 200px; max-height: 150px; margin-right: 10px;"></br>`;
                break;
            case "ZIP":
                mediaElement = `<a href="${media.ART_MEDIA_SOURCE}" target="_blank">ZIP файл с коллекцией изображений</a></br>`;
                break;
            case "360":
                mediaElement = `<a href="${media.ART_MEDIA_SOURCE}" target="_blank">360° изображения</a></br>`;
                break;
            default:
                mediaElement = `<span>Неизвестный тип медиа</span>`;
        }

        // Добавляем медиа элемент в контейнер
        $("#mediaContainer").append(mediaElement);
    });

    // Показываем блок с информацией
    $("#partsInfo").show();
}