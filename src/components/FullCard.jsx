import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Loader from "./Loader";
import Modal from "./Modal";
import { get } from "../api/baseRequests";
import ImageGallery from "./ImageGallery";

const FullCard = ({ supplierName, articleName, onClose }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await get(`detail-full-info/${supplierName}/${articleName}`);
        setArticle(data);
      } catch (error) {
        setIsModalErrorOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [supplierName, articleName]);

  return (
    <div className="relative w-full max-w-6xl p-6 my-2 flex flex-col bg-white rounded-2xl shadow-md animate-fade-in z-10">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-5"
      >
        <X size={24} />
      </button>

      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <Loader />
        </div>
      ) : article ? (
        <div className="flex flex-col w-full">
          {/* Верхняя часть с двумя колонками */}
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Левая колонка - Галерея */}
            <div className="md:w-1/4 flex flex-col gap-4">
              <div className="flex-1">
                {article.img_urls.length === 0 ? (
                  <ImageGallery />
                ) : (
                  <ImageGallery images={article.img_urls} />
                )}
              </div>
            </div>

            {/* Правая колонка - Основная информация */}
            <div className="md:w-3/4 flex flex-col gap-6">
              <h2 className="text-2xl text-center font-bold text-gray-900 mb-4">
                Основная информация
              </h2>

              {/* Основные поля */}
              <div className="max-h-[300px] overflow-y-auto pr-4">
                <div className="space-y-4">
                  <div className="py-2 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-600 capitalize">Нормализованный артикул</span>
                      <span className="text-gray-800">{article?.normalized_article ?? 'Не указано'}</span>
                    </div>
                  </div>

                  {/* Остальные поля */}
                  <div className="py-2 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-600 capitalize">Поставщик JC</span>
                      <span className="text-gray-800">
                        {article?.supplier_from_jc
                          ? `${article?.supplier_from_jc?.name}${article?.supplier_from_jc?.marketPrefix ? ' / ' + article?.supplier_from_jc?.marketPrefix : ''}`
                          : 'Не указано'}
                      </span>
                    </div>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-600 capitalize">Поставщик TD</span>
                      <span className="text-gray-800">{article?.supplier_from_td?.description ?? 'Не указано'}
                      </span>
                    </div>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-600 capitalize">EAN</span>
                      <span className="text-gray-800">{article?.article_ean?.ean ?? 'Не указано'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Дополнительные характеристики
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { title: 'Артикул в нормальном написании (со спецсимволами)', key: 'DataSupplierArticleNumber' },
                { title: 'Статус изделия', key: 'ArticleStateDisplayValue' },
                { title: 'Дополнительное описание (примечание)', key: 'Description' },
                { title: 'Является сопутствующим товаром?', key: 'FlagAccessory' },
                { title: 'Сертифицированное сырье?', key: 'FlagMaterialCertification' },
                { title: 'Восстановленное изделие?', key: 'FlagRemanufactured' },
                { title: 'Поставляется без упаковки?', key: 'FlagSelfServicePacking' },
                { title: 'Артикул в поисковом написании', key: 'FoundString' },
                { title: 'Имеет применяемость в осях?', key: 'HasAxle' },
                { title: 'Имеет применяемость в коммерческих ТС?', key: 'HasCVManuID' },
                { title: 'Связь с серийными номерами автомобилей', key: 'HasCommercialVehicle' },
                { title: 'Имеет применяемость в двигателях?', key: 'HasEngine' },
                { title: 'Имеет применяемость?', key: 'HasLinkitems' },
                { title: 'Имеет применяемость в мототехнике?', key: 'HasMotorbike' },
                { title: 'Имеет применяемость в легковых ТС?', key: 'HasPassengerCar' },
                { title: 'Артикул разрешен к использованию в БД?', key: 'IsValid' },
                { title: 'Основное описание (наименование)', key: 'NormalizedDescription' },
                { title: 'Упаковочная единица', key: 'PackingUnit' },
                { title: 'Количество в упаковке', key: 'QuantityPerPackingUnit' },
              ].map(({ title, key }) => {
                const rawValue = article?.article_schema?.[key];
                const isBoolean = typeof rawValue === 'boolean' || 
                                  ['true', 'false'].includes(String(rawValue).toLowerCase());
                
                const formattedValue = isBoolean 
                  ? (rawValue === true || String(rawValue).toLowerCase() === 'true' ? 'Да' : 'Нет')
                  : rawValue || '—';
          
                return (
                  <div 
                    key={key}
                    className="group p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">
                          {title}
                        </h4>
                        <span className={`text-lg font-medium ${
                          isBoolean 
                            ? formattedValue === 'Да' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                            : 'text-gray-800'
                        }`}>
                          {formattedValue}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Modal isOpen={isModalErrorOpen} onClose={() => { setIsModalErrorOpen(false); onClose(); }}>
          <h3 className="text-xl font-bold m-4 text-center text-red-600">
            Ошибка загрузки данных
          </h3>
        </Modal>
      )}
    </div>
  );
};

export default FullCard;