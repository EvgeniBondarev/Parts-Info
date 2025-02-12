import { useState } from 'react';
import '../index.css'

const AdditionalFeatures = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleItems, setVisibleItems] = useState(6);
  
  const features = [
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
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setVisibleItems(isExpanded ? 6 : features.length);
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between text-cen items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Дополнительные характеристики
        </h3>
        <button
          onClick={toggleExpanded}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {features.slice(0, visibleItems).map(({ title, key }) => {
          const rawValue = article?.article_schema?.[key];
          const isBoolean = typeof rawValue === 'boolean' || ['true', 'false'].includes(String(rawValue).toLowerCase());
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
  );
};

export default AdditionalFeatures;