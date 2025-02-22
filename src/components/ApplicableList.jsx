import React, { useEffect, useState } from "react";
import CollapsibleTable from "./CollapsibleTable";
import { CAR_MANUFACTURERS } from "../api/constants";
import Modal from "./Modal";

const ApplicableList = ({model}) => {
  const [expandedBrands, setExpandedBrands] = useState([]);
  const [expandedModels, setExpandedModels] = useState([]);
  const [applicables, setApplicables] = useState([]);
  const [fullInfo, setFullInfo] = useState([]);
  const [isFullInfoOpen, setIsFullInfoOpen] = useState(false);

  const removePartFromString = (str, partToRemove) => {
    const regex = new RegExp(`\\b${partToRemove}\\b`, "gi");
    return str.replace(regex, "").replace(/\s+/g, " ").trim();
  };

  useEffect(() => {
    const brands = new Set(model.map((item) => {
      const description = item?.Modification?.description?.toLowerCase() || "";

      const foundManufacturer = CAR_MANUFACTURERS.find((manufacturer) =>
        description.includes(manufacturer.toLowerCase())
      );

      if (foundManufacturer) {
        return foundManufacturer;
      } else {
        return "Неизвестная марка";
      }
    }));
    const newApplicables = [...brands].map(manufacturer => (
      {
        brand: manufacturer,
        models: []
      }));

    newApplicables.forEach(applicable => {
      model.forEach(item => {
        const description = item?.Modification?.description?.toLowerCase() || "";
        const foundModel = description.includes(applicable.brand)
        if (foundModel) {
          const newModel = removePartFromString(item?.Modification?.description, applicable.brand).trim();
          var exitsModel = applicable.models.find(m => m.name === newModel);
          if (!exitsModel) {
            applicable.models.push({name: newModel, data: [item.Attributes]})
          } else {
            exitsModel.data.push(item.Attributes)
          } 
        }
      })
    });

    setApplicables(newApplicables);
  }, [model]);

  const toggleBrand = (brand) => {
    if (expandedBrands.includes(brand)) {
      setExpandedBrands(expandedBrands.filter((b) => b !== brand));
    } else {
      setExpandedBrands([...expandedBrands, brand]);
    }
  };

  const toggleModel = (model) => {
    if (expandedModels.includes(model)) {
      setExpandedModels(expandedModels.filter((m) => m !== model));
    } else {
      setExpandedModels([...expandedModels, model]);
    }
  };

  const onRowClick = (fullData) => {
    setFullInfo(fullData);
    setIsFullInfoOpen(true);
  }

  return (
    <div>
      {applicables.map((applicable) => (
        <div key={applicable.brand}>
          <div
            onClick={() => toggleBrand(applicable.brand)}
            className="flex items-center cursor-pointer bg-gray-200 p-2 rounded"
          >
            <span className="font-bold">{applicable.brand}</span>
            <span className="ml-2">{expandedBrands.includes(applicable.brand) ? "▼" : "▶"}</span>
          </div>

          {expandedBrands.includes(applicable.brand) && (
            <div>
              {applicable.models.map((model) => (
                <div key={model.name}>
                  <div
                    onClick={() => toggleModel(model.name)}
                    className="flex items-center cursor-pointer bg-gray-100 p-2 rounded"
                  >
                    <span>{model.name}</span>
                    <span className="ml-2">{expandedModels.includes(model.name) ? "▼" : "▶"}</span>
                  </div>

                  {expandedModels.includes(model.name) && (
                    <CollapsibleTable
                      rowLimit={10}
                      titles={[
                        'Тип',
                        'Изготавливался ОТ',
                        'Изготавливался ДО',
                        'Емкость (Tax)',
                        'Емкость (Technic)',
                        'Мощность (кВ)',
                        "Мощность (Л.С.)"
                      ]}
                      fullData={model.data}
                      onRowClick={onRowClick}
                      data={model.data.map(item => [
                        item[5].Value,
                        item[0].Value.replaceAll(' ', '').split('-')[0],
                        item[0].Value.replaceAll(' ', '').split('-')[1],
                        item[3].Value,
                        item[4].Value,
                        item[1].Value,
                        item[2].Value
                      ])}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <Modal isOpen={isFullInfoOpen} onClose={() => { setIsFullInfoOpen(false); }}>
        <CollapsibleTable
              rowLimit={fullInfo.length}
              titles={['Заголовок', 'Значение']}
              data={fullInfo.map(item => [item.Title, item.Value])}
          />
      </Modal>
    </div>
  );
};

export default ApplicableList;