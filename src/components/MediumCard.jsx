import React from "react";
import ImageGallery from "./ImageGallery";
import CollapsibleTable from "./CollapsibleTable";

const MediumCard = ({ model }) => {
  return (
    <div className="flex flex-col w-full rounded-2xl shadow-md animate-fade-in borderd border-gray-500">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="md:w-1/4 flex flex-col gap-4">
          <div className="flex-1">
            {model.images.length === 0 ? (
              <ImageGallery />
            ) : (
              <ImageGallery images={model.images} />
            )}
          </div>
        </div>
        <div className="md:w-3/4 flex flex-col gap-6">
          <h2 className="text-xl text-center font-bold text-gray-900">
            {model.article} - {model.brand}
          </h2>
          <div className="max-h-[300px] overflow-y-auto pr-4 text-sm">
            <div className="space-y-4">
              <div className="py-2 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600 capitalize">Код вендора</span>
                  <span className="text-gray-800">{model?.Vendor_Code ?? 'Не указано'}</span>
                </div>
              </div>
              <div className="py-2 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600 capitalize">Код OEM</span>
                  <span className="text-gray-800">{model?.OEM_Code ?? 'Не указано'}</span>
                </div>
              </div>
              <div className="pt-2 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600 capitalize">Название категории</span>
                  <span className="text-gray-800">{model?.Vendor_Category_Name ?? 'Не указано'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mr-2 mb-2">
            <CollapsibleTable
              rowLimit={4}
              titles={['Заголовок', 'Значение']}
              data={model.attributes.map(item => [item.name, item.value])}
            >
              <div className="bg-gray-50 p-2 rounded-t-xl border-b border-gray-200 text-gray-500 font-bold text-center">
                Атрибуты
              </div>
            </CollapsibleTable>
          </div>
        </div>
      </div>
      <div className="mx-2 mb-2">
            <CollapsibleTable
              rowLimit={4}
              titles={['Применимость']}
              data={model.models.map(item => [item])}
            />
          </div>
    </div>
  );
};

export default MediumCard;