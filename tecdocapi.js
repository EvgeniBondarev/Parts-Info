        // Обработчик события на кнопку для получения списка
        $("#fetchData").click(function() {
            var article = $("#article").val();  // Получаем значение из поля ввода
            $("#loading").show();
            if (article) {
                $.ajax({
                    url: 'http://109.196.101.10:8000/suppliers/' + article,  // Ваш API
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        // Очищаем старые результаты
                        $("#resultList").empty();
                        $("#detailInfo").hide();

                        // Проверяем, если ответ не пустой
                        if (response) {
                            // Создаем два списка: один для suppliersFromTd и второй для suppliersFromJs
                            var tdList = '';
                            var jsList = '';

                            // Перебираем suppliersFromTd и добавляем ссылки
                            if (response.suppliersFromTd && response.suppliersFromTd.length > 0) {
                                response.suppliersFromTd.forEach(function(item) {
                                    tdList += '<li><a href="#" class="supplierLink" data-description="' + item.description + '" data-article="' + article + '">' + item.description + '</a></li>';
                                });
                            }

                            // Перебираем suppliersFromJs и добавляем ссылки
                            if (response.suppliersFromJs && response.suppliersFromJs.length > 0) {
                                response.suppliersFromJs.forEach(function(item) {
                                    jsList += '<li><a href="#" class="supplierLink" data-description="' + item.name + '" data-article="' + article + '">' + item.name + '</a> ' + item.rating +'</li>';
                                });
                            }

                            // Выводим список ссылок из suppliersFromTd
                            if (tdList) {
                                $("#resultList").append('Поставщики из TD2018:<ul class="no-padding">' + tdList + '</ul>');
                            }

                            // Выводим список ссылок из suppliersFromJs
                            if (jsList) {
                                $("#resultList").append('Поставщики из JCEtalon:<ul class="no-padding">' + jsList + '</ul>');
                            }

                            // Добавляем поле ввода вне списка
                            $("#resultList").append('<input type="text" id="customDescription" placeholder="Другой">');

                        } else {
                            $("#resultList").append('<li>Нет данных для данного артикула</li>');
                        }
                    },
                    error: function(xhr, status, error) {
                        alert("Не удалось найти записи по указанному поставщику в TD2018");
                    },
                    complete: function() {
                        // Скрываем анимацию загрузки после завершения запроса (успех или ошибка)
                        $("#loading").hide();
                    }
                });
            } else {
                alert("Пожалуйста, введите значение для артикула.");
            }
        });


        // Обработчик клика по ссылке
        $(document).on('click', '.supplierLink', function(event) {
            event.preventDefault();
            var description = $(this).data('description');
            var article = $(this).data('article');
            
            fetchDetails(description, article);  // Вызываем общую функцию
        });

        // Обработчик нажатия клавиши Enter для любого поля с id="customDescription"
        $(document).on("keypress", "#resultList #customDescription", function(event) {
            if (event.key === "Enter") {  // Проверяем, что была нажата клавиша Enter
                var article = $("#article").val();  // Получаем значение из поля ввода
                var description = $(this).val();  // Получаем значение из только что добавленного поля

                fetchDetails(description, article);  // Вызываем общую функцию
            }
        });
        


        // Общая функция для выполнения запроса
        function fetchDetails(description, article) {
            $.ajax({
                url: 'http://109.196.101.10:8000/detail-full-info/' + description + '/' + article,  // Запрос к деталям
                type: 'GET',
                dataType: 'json',
                success: function(detailResponse) {
                    console.log(detailResponse);
                    $("#loading").show();

                    $("#imgUrls").empty();
                    $("#normalizedArticle").empty();
                    $("#supplierFromJc").empty();
                    $("#supplierFromTd").empty();
                    $("#detailAttributes tbody").empty();
                    $("#substituteInfo").empty(); 

                    $("#partsList").empty();
                    $("#mediaContainer").empty();
                    $("#crossesList").empty();
                    $("#criteriaList").empty();
                    $("#partWeight").empty();

                    // Показываем изображения
                    if (detailResponse.img_urls && detailResponse.img_urls.length > 0) {
                        var imgHtml = '<h4>Изображения:</h4><div>';
                        detailResponse.img_urls.forEach(function(imgUrl) {
                            imgHtml += '<img src="' + imgUrl + '" alt="Image" class="thumbnail" style="width: 100px; height: 100px; margin-right: 10px; cursor: pointer;">';
                        });
                        imgHtml += '</div>';
                        $("#imgUrls").html(imgHtml);
                    }

                    // Модальное окно для отображения изображения в полном размере
                    var modalHtml = `
                        <div id="imgModal" class="img-modal">
                            <span class="close">&times;</span>
                            <img class="modal-content" id="imgModalContent">
                        </div>
                    `;
                    $("body").append(modalHtml); // Добавляем модальное окно в тело документа

                    // Открываем изображение в модальном окне
                    $(".thumbnail").click(function() {
                        var imgSrc = $(this).attr("src");
                        $("#imgModalContent").attr("src", imgSrc);  // Заменяем источник изображения в модальном окне
                        $("#imgModal").css("display", "block");    // Показываем модальное окно
                    });

                    // Закрыть модальное окно при клике на фон (не на картинку)
                    $(".img-modal").click(function(event) {
                        if (event.target == this) {
                            $("#imgModal").css("display", "none");    // Скрываем модальное окно, если кликнули на фон
                        }
                    });

                    // Закрыть модальное окно при клике на крестик
                    $(".close").click(function() {
                        $("#imgModal").css("display", "none");    // Скрываем модальное окно
                    });

                    // Выводим normalized_article
                    $("#normalizedArticle").html("<strong>Нормализованный артикул:</strong>  " + detailResponse.normalized_article);

                    // Выводим информацию о поставщиках
                    var jcSupplier = detailResponse.supplier_from_jc;
                    var tdSupplier = detailResponse.supplier_from_td;
                    var ean = detailResponse.article_ean?.ean || "Нет данных";
                    
                    // Проверяем, если jcSupplier и его поля не null/undefined, то выводим значения, иначе выводим "/"
                    $("#supplierFromJc").html("<strong>Поставщик JC:</strong> " + 
                        (jcSupplier && jcSupplier.name ? jcSupplier.name : '...') +
                        " (prefix - " +
                        (jcSupplier && jcSupplier.marketPrefix ? jcSupplier.marketPrefix : '...') +
                        ")");

                    // Проверяем, если tdSupplier и его поля не null/undefined, то выводим значения, иначе выводим "/"
                    $("#supplierFromTd").html("<strong>Поставщик TD:</strong> " +
                        (tdSupplier && tdSupplier.description ? tdSupplier.description : '...') +
                        " (prefix - " +
                        (tdSupplier && tdSupplier.matchcode ? tdSupplier.matchcode : '...') +
                        ")");

                    if (tdSupplier) {
                            $("#supplierFromTd").attr("data-supplier-id", tdSupplier.id);
                            $("#supplierFromTd").attr("data-brand", tdSupplier.description);
                        }

                    // Измените этот участок кода
                    $("#ean").html("<strong>Ean:</strong>" + ean + "<br/><br/><a href='#' class='ean-link' data-ean='" + ean + "'>Информация из PARTSAPI.RU</a>");

                    // Обработчик вывода атрибутов
                    if (detailResponse.article_schema) {
                        var schemaHtml = '<h4>Описание:</h4><ul>';
                        if (Object.keys(detailResponse.article_schema).length > 0) {
                            Object.entries(detailResponse.article_schema).forEach(function([key, value]) {
                                // Проверяем наличие ключа в attributeTranslations
                                if (attributeTranslations[key]) {
                                    var translatedKey = attributeTranslations[key]; // Получаем перевод ключа
                                    var translatedValue = convertBoolean(value); // Преобразуем булевые значения
                                    schemaHtml += '<li>' + translatedKey + ': <strong>' + translatedValue + '</strong></li>';
                                }
                            });
                        } else {
                            schemaHtml += '<li>Описание отсутствует</li>';
                        }
                        schemaHtml += '</ul>';
                        $("#detailAttributes1").html(schemaHtml);
                    } else {
                        $("#detailAttributes1").html('<h4>Описание:</h4><ul><li>Описание отсутствует</li></ul>');
                    }

                    // Заполняем таблицу с detail_attribute
                    if (detailResponse.detail_attribute && detailResponse.detail_attribute.length > 0) {
                        detailResponse.detail_attribute.forEach(function(attr) {
                            $("#detailAttributes tbody").append(
                                '<tr><td>' + (attr.description || 'Описание отсутствует') + '</td><td>' +
                                (attr.displaytitle || 'Заголовок отсутствует') + '</td><td>' +
                                (attr.displayvalue || 'Значение отсутствует') + '</td></tr>'
                            );
                        });
                    } else {
                        $("#detailAttributes tbody").append(
                            '<tr><td colspan="3">Детали отсутствуют</td></tr>'
                        );
                    }


                    // Показываем раздел с подробной информацией
                    $("#detailInfo").show();

                    // Добавляем ссылку для замещения
                    var substituteLinkHtml = '<br><a href="#" class="substituteLink" data-description="' + description + '" data-article="' + article + '">Применимость</a>';
                    $("#substituteInfo").html(substituteLinkHtml);
                },
                error: function(xhr, status, error) {
                    alert("Произошла ошибка при получении деталей: " + error);
                },
                complete: function() {
                    // Скрываем анимацию загрузки после завершения запроса (успех или ошибка)
                    $("#loading").hide();
                }
            });
        }

        // Обработчик клика по ссылке для замещений
        $(document).on('click', '.substituteLink', function(event) {
            event.preventDefault();
            var description = $(this).data('description');
            var article = $(this).data('article');

            // Показываем анимацию загрузки
            $("#loading").show();

            // Запрашиваем замену
            $.ajax({
                url: 'http://109.196.101.10:8000/substitute/' + description + '/' + article,  // Запрос на substitute
                type: 'GET',
                dataType: 'json',
                success: function(substituteResponse) {
                    // Очищаем старую информацию о замещениях
                    $("#substituteInfo").empty();

                    // Если есть Substitute, выводим их информацию
                    if (substituteResponse.Substitutes && substituteResponse.Substitutes.length > 0) {
                        var substituteHtml = '<h4>Применимость:</h4>';
                        substituteResponse.Substitutes.forEach(function (substitute, index) {
                            substituteHtml += `
                                <p><strong>Тип:</strong> ${substitute.Type}
                                   <strong>Имя:</strong> ${substitute.Name}
                                   <strong>Описание:</strong> ${substitute.Modification.description}
                                   <strong>Интервал:</strong> ${substitute.Modification.construction_interval}</p>
                                <table border="1">
                                    <thead>
                                        <tr><th>Заголовок</th><th>Значение</th></tr>
                                    </thead>
                                    <tbody>
                            `;

                            // Показываем первые три строки
                            substitute.Attributes.slice(0, 3).forEach(function (attr) {
                                substituteHtml += `<tr><td>${attr.Title}</td><td>${attr.Value}</td></tr>`;
                            });

                            // Скрываем оставшиеся строки
                            if (substitute.Attributes.length > 3) {
                                substitute.Attributes.slice(3).forEach(function (attr) {
                                    substituteHtml += `<tr class="expandable-rows-${index}" style="display:none;">
                                                        <td>${attr.Title}</td><td>${attr.Value}</td>
                                                       </tr>`;
                                });

                                // Кнопка "Развернуть/Свернуть"
                                substituteHtml += `
                                    <tr>
                                        <td colspan="2" style="text-align:center;">
                                            <button class="toggle-rows-btn" onclick="toggleRows(${index}, this)">Развернуть</button>
                                        </td>
                                    </tr>
                                `;
                            }

                            substituteHtml += `
                                    </tbody>
                                </table>
                            `;
                        });
                        $("#substituteInfo").html(substituteHtml);
                    } else {
                        $("#substituteInfo").html('<p>Применимости не найдены.</p>');
                    }


                },
                error: function(xhr, status, error) {
                    alert("Произошла ошибка при получении применимости: " + error);
                },
                complete: function() {
                    // Скрываем анимацию загрузки после завершения запроса
                    $("#loading").hide();
                }
            });
        });

        function toggleRows(index, button) {
            const rows = document.querySelectorAll(`.expandable-rows-${index}`);
            const isHidden = rows[0].style.display === 'none';
    
            rows.forEach(row => {
                row.style.display = isHidden ? 'table-row' : 'none';
            });
    
            button.textContent = isHidden ? 'Свернуть' : 'Развернуть';
        }
    
        const attributeTranslations = {
            DataSupplierArticleNumber: "Артикул в нормальном написании (со спецсимволами)",
            ArticleStateDisplayValue: "Статус изделия (нормальный, снят с производства и др.)",
            Description: "Дополнительное описание (примечание)",
            FlagAccessory: "Является сопутствующим товаром?",
            FlagMaterialCertification: "Сертифицированное сырье?",
            FlagRemanufactured: "Восстановленное изделие?",
            FlagSelfServicePacking: "Поставляется без упаковки?",
            FoundString: "Артикул в поисковом написании",
            HasAxle: "Имеет применяемость в осях?",
            HasCommercialVehicle: "Имеет применяемость в коммерческих ТС?",
            HasCVManuID: "Связь с серийными номерами автомобилей",
            HasEngine: "Имеет применяемость в двигателях?",
            HasLinkitems: "Имеет применяемость?",
            HasMotorbike: "Имеет применяемость в мототехнике?",
            HasPassengerCar: "Имеет применяемость в легковых ТС?",
            IsValid: "Артикул разрешен к использованию в БД?",
            NormalizedDescription: "Основное описание (наименование)",
            PackingUnit: "Упаковочная единица",
            QuantityPerPackingUnit: "Количество в упаковке"
        };
    
        // Функция для преобразования значений True/False в Да/Нет
        function convertBoolean(value) {
            if (value === "True") return "Да";
            if (value === "False") return "Нет";
            return value; // Оставляем значение без изменений, если оно не булево
        }