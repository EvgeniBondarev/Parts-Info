import { useState, useEffect } from "react";

const CollapsibleTable = ({
  titles,
  data,
  fullData = null,
  onRowClick = (_) => {},
  rowLimit,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleRows, setVisibleRows] = useState(rowLimit);
  const columnsCount = titles.length;
  const columnWidth = `${100 / columnsCount}%`;

  useEffect(() => {
    setIsExpanded(false);
    setVisibleRows(rowLimit);
  }, [titles, data]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setVisibleRows(isExpanded ? rowLimit : data.length);
  };

  return (
    <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-100">     
      {children} 
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <colgroup>
            {Array(columnsCount).fill().map((_, i) => (
              <col key={i} style={{ width: columnWidth }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200">
              {titles.map((title, key) => (
                <th
                  key={key}
                  className={`px-2 py-3 text-center text-base font-bold text-gray-500 bg-gray-50 ${
                    key !== 0 ? "border-l border-gray-200" : ""
                  }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.slice(0, visibleRows).map((row, index) => (
              <tr
                onClick={() => onRowClick(fullData[index])}
                key={index}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                {row.map((spec, key) => (
                  <td
                    key={key}
                    className={`px-2 py-3 text-base text-gray-700 font-medium text-center truncate ${
                      key !== 0 ? "border-l border-gray-200" : ""
                    }`}
                  >
                    {spec || 'Не указано'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > rowLimit && (
        <div className="p-1 border-t border-gray-200">
          <button
            onClick={toggleExpanded}
            className="w-full text-blue-600 hover:text-blue-800 font-bold text-base flex items-center justify-center gap-2"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
      )}
    </div>
  );
};

export default CollapsibleTable;