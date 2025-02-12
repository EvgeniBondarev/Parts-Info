import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Loader from "./Loader";
import Modal from "./Modal";
import { get } from "../api/baseRequests";
import ImageGallery from "./ImageGallery";
import AdditionalFeatures from "./AdditionalFeatures";
import CollapsibleTable from "./CollapsibleTable";
import SmallCard from "./SmallCard";

const FullCard = ({ supplierName, articleName, onClose }) => {
  const [article, setArticle] = useState(null);
  const [applicablies, setApplicablies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  
  const [applicableLoading, setApplicableLoading] = useState(false);
  const [isApplicableErrorOpen, setIsApplicableErrorOpen] = useState(false);

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

  async function findApplicable() {
    try {
      setApplicableLoading(true);
      const data = await get(`substitute/${supplierName}/${articleName}`);
      if (data.Substitutes.length === 0) {
        setIsApplicableErrorOpen(true);
      } else {
        setApplicablies(data.Substitutes);
      }
    } catch (error) {
      setIsApplicableErrorOpen(true);
    } finally {
      setApplicableLoading(false);
    }
  }

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
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="md:w-1/4 flex flex-col gap-4">
              <div className="flex-1">
                {article.img_urls.length === 0 ? (
                  <ImageGallery />
                ) : (
                  <ImageGallery images={article.img_urls} />
                )}
              </div>
            </div>

            <div className="md:w-3/4 flex flex-col gap-6">
              <h2 className="text-2xl text-center font-bold text-gray-900 mb-4">
                Основная информация
              </h2>

              <div className="max-h-[300px] overflow-y-auto pr-4">
                <div className="space-y-4">
                  <div className="py-2 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-600 capitalize">Нормализованный артикул</span>
                      <span className="text-gray-800">{article?.normalized_article ?? 'Не указано'}</span>
                    </div>
                  </div>

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
          <AdditionalFeatures article={article} />

          {article.detail_attribute.length !== 0 && (
            <CollapsibleTable
              rowLimit={4}
              titles={['Описание', 'Заголовок', 'Значение']}
              data={article.detail_attribute.map(item => [item.description, item.displaytitle, item.displayvalue])}/>
          )}
          <SmallCard
            className='w-48 mt-4'
            textCenter={true}
            padding="p-2"
            title='Применимость'
            color="bg-blue-500"
            onClick={findApplicable}
          />

          <div className="mt-4">
            {applicableLoading
              ? <Loader />
              : (applicablies.map((applicable, index) => (
                <CollapsibleTable
                  key={index}
                  rowLimit={4}
                  titles={['Заголовок', 'Значение']}
                  data={applicable.Attributes.map(item => [item.Title, item.Value])}
                >
                  <div className="bg-gray-50 p-2 rounded-t-xl border-b border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm justify-items-start">
                      <div className="space-y-2 mx-6">
                        <div className="flex items-center">
                          <span className="text-gray-500">Тип:</span>
                          <span className="ml-4 font-medium">{applicable?.Type?.trim() || "Не указано"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500">Имя:</span>
                          <span className="ml-4 font-medium">{applicable?.Name?.trim() || "Не указано"}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mx-6">
                        <div className="flex items-center">
                          <span className="text-gray-500">Описание:</span>
                          <span className="ml-4 font-medium">{applicable?.Modification?.description?.trim() || "Не указано"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500">Интервал:</span>
                          <span className="ml-4 font-medium">{applicable?.Modification?.construction_interval?.trim() || "Не указано"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTable>
            )))}
          </div>
         
          <Modal isOpen={isApplicableErrorOpen} onClose={() => { setIsApplicableErrorOpen(false);}}>
            <h3 className="text-xl font-bold m-4 text-center text-red-600">
              Применимость не найдена
            </h3>
          </Modal>    
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