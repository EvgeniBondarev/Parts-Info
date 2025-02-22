import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Loader from "./Loader";
import Modal from "./Modal";
import { get } from "../api/baseRequests";
import ImageGallery from "./ImageGallery";
import AdditionalFeatures from "./AdditionalFeatures";
import CollapsibleTable from "./CollapsibleTable";
import MediumCard from "./MediumCard";
import SmallCard from "./SmallCard";
import ApplicableList from "./ApplicableList";

const FullCard = ({ supplierName, articleName, onClose }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  
  const [description, setDescription] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [isDescriptionErrorOpen, setIsDescriptionErrorOpen] = useState(false);
  
  const [applicablies, setApplicablies] = useState([]);
  const [applicableLoading, setApplicableLoading] = useState(false);
  const [isApplicableErrorOpen, setIsApplicableErrorOpen] = useState(false);
  
  const [mnds, setMnds] = useState([]);
  const [mndLoading, setMndLoading] = useState(false);
  const [isMndsErrorOpen, setIsMndsErrorOpen] = useState(false);

  const [JCCross, setJCCross] = useState([]);
  const [JCCrossLoading, setJCCrossLoading] = useState(false);
  const [isJCCrossErrorOpen, setIsJCCrossErrorOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(""); 

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
    
    setArticle(null);
    setApplicablies([]);
    setMnds([]);
    setJCCross([]);
    setActiveTab('');
    setShowDescription(false);
    fetchArticle();
  }, [supplierName, articleName]);

  async function findApplicable() {
    try {
      setApplicableLoading(true);
      const data = await get(`substitute/${supplierName}/${articleName}`);
      if (data.Substitutes.length === 0) {
        setActiveTab('');
        setIsApplicableErrorOpen(true);
      } else {
        setApplicablies(data.Substitutes);
      }
    } catch (error) {
      setActiveTab('');
      setIsApplicableErrorOpen(true);
    } finally {
      setApplicableLoading(false);
    }
  }

  async function findMnd() {
    try {
      setMndLoading(true);
      const data = await get(`pr-part/?article=${articleName}`);
      setMnds(data);
    } catch (error) {
      setActiveTab('');
      setIsMndsErrorOpen(true);
    } finally {
      setMndLoading(false);
    }
  }

  async function findJCCross() {
    try {
      setJCCrossLoading(true);
      const data = await get(`cr-t-cross/maincode/${articleName}`);
      if (data.length === 0) {
        setActiveTab('');
        setIsJCCrossErrorOpen(true);
      } else {
        setJCCross(data);
      }
    } catch (error) {
      setActiveTab('');
      setIsJCCrossErrorOpen(true);
    } finally {
      setJCCrossLoading(false);
    }
  }

  async function findDescription() {
    try {
      const data = await get(`et-part/${articleName}/${article?.supplier_from_jc?.id}`);
      if (data.length > 0) {
        setShowDescription(true);
        setDescription([
          {name: 'Код детали', value: data[0]?.code},
          {name: 'Литературный код детали', value: data[0]?.longcode},
          {name: 'Вес детали', value: data[0]?.weight},
          {name: 'Объем детали', value: data[0]?.V},
          {name: 'Флаг неизменности (кода) детали', value: data[0]?.nochangeflag ? 'Да': 'Нет'},
          {name: 'Флаг старой детали', value: data[0]?.old ? 'Да': 'Нет'},
          {name: 'Флаг удаленности детали', value: data[0]?.deleted ? 'Да': 'Нет'},
          {name: 'Флаг разрешенности детали', value: data[0]?.accepted ? 'Да': 'Нет'},
        ]);
      } else {
        setIsDescriptionErrorOpen(true);
      }
    } catch (error) {
      setIsDescriptionErrorOpen(true);
    }
  }

  return (
    <div className="relative w-full p-6 my-2 flex flex-col bg-white rounded-2xl shadow-md animate-fade-in z-10">
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
              <h2 className="text-xl text-center font-bold text-gray-900 mb-4">
                Основная информация
              </h2>

              <div className="max-h-[300px] overflow-y-auto pr-4 text-sm">
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

                  {showDescription ? (
                    <>
                      {description.map((item, key) => (
                        <div className="py-2 border-b border-gray-200" key={key}>
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-600 capitalize">{item.name}</span>
                            {item.value == null ? (
                              <Loader />
                            ) : (
                              <span className="text-gray-800">{item?.value ?? "Не указано"}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="pb-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-600 capitalize"></span>
                        <SmallCard
                          title={"Дополнительно"}
                          color="bg-blue-500"
                          textCenter={true}
                          padding="p-2"
                          onClick={findDescription}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <AdditionalFeatures article={article} />

          {article.detail_attribute.length !== 0 && (
            <CollapsibleTable
              rowLimit={4}
              titles={['Описание', 'Заголовок', 'Значение']}
              data={article.detail_attribute.map(item => [item.description, item.displaytitle, item.displayvalue])}
            />
          )}

         <div className="flex border-b border-gray-200 mt-4">
            <button
              onClick={() => {setActiveTab("section1"); findApplicable();}}
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === "section1"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Применимость
            </button>
            <button
              onClick={() => {setActiveTab("section2"); findMnd();}}
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === "section2"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Данные из MNK
            </button>
            <button
              onClick={() => {setActiveTab("section3"); findJCCross();}}
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === "section3"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Кросскоды из JCCross
            </button>
          </div>

          {activeTab === "section1" && (
            <div className="mt-4">
              {applicableLoading ? (
                <Loader />
              ) : (
                <ApplicableList model={applicablies} />
              )}
            </div>
          )}

          {activeTab === "section2" && (
            <div className="mt-4">
              {mndLoading ? (
                <Loader />
              ) : (
                mnds.map((mnd, index) => (
                    <div className="m-1" key={index}>
                      <MediumCard model={mnd}/>
                    </div>
                ))
              )}
            </div>
          )}

          {activeTab === "section3" && (
            <div className="mt-4">
              {JCCrossLoading ? (
                <Loader />
              ) : (
                  <CollapsibleTable
                    rowLimit={4}
                    titles={['Кросскод', 'Производитель', 'Префикс']}
                    data={JCCross.map(item => [item?.cr_bycode, item?.et_producer?.name, item?.et_producer?.marketPrefix])}
                  />
              )}
            </div>
          )}

          <Modal isOpen={isApplicableErrorOpen} onClose={() => { setIsApplicableErrorOpen(false); }}>
            <h3 className="text-xl font-bold m-4 text-center text-red-600">
              Применимость не найдена
            </h3>
          </Modal>
          <Modal isOpen={isMndsErrorOpen} onClose={() => { setIsMndsErrorOpen(false); }}>
            <h3 className="text-xl font-bold m-4 text-center text-red-600">
              MND не найден
            </h3>
          </Modal>
          <Modal isOpen={isJCCrossErrorOpen} onClose={() => { setIsJCCrossErrorOpen(false); }}>
            <h3 className="text-xl font-bold m-4 text-center text-red-600">
              JCCross не найден
            </h3>
          </Modal>
          <Modal isOpen={isDescriptionErrorOpen} onClose={() => { setIsDescriptionErrorOpen(false); }}>
            <h3 className="text-xl font-bold m-4 text-center text-red-600">
              Описание не найдено
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