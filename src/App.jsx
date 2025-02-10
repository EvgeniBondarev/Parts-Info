import { useState, useEffect } from 'react';
import InputSearch from './components/InputSearch';
import Loader from './components/Loader';
import { get } from './api/baseRequests'
import Modal from './components/Modal';

function App() {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState(null);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const findArticle = async (searchQuery) => {
    try {
      setLoading(true);
      const url = `suppliers/${searchQuery}`;
      const data = await get(url);
      
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)];
        return newHistory.slice(0, 5);
      });
      
      setArticles(data);
    }
    catch {
      setArticles(null);
      setIsModalErrorOpen(true);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-300">
      <div className="w-full pt-12 sticky top-0 z-10 bg-gray-300">
        <div className={`transition-transform duration-300 scale-90`}>
          <InputSearch 
            handleClick={findArticle}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          
          {searchHistory.length > 0 && (
            <div className="mt-4 mx-auto max-w-3xl w-full transition-opacity duration-300">
              <div className="flex flex-wrap gap-2 justify-center">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(item);
                      findArticle(item);
                    }}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full">
        {loading ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader />
          </div>
        ) : articles ? (
          <div className="max-w-3xl w-full p-6 bg-white rounded-2xl shadow-md animate-fade-in mb-8 mx-auto">
            <h1 className="text-2xl font-bold mb-4">Результат поиска</h1>
            <p className="text-gray-700">{articles?.suppliersFromJs[0]?.id}</p>
          </div>
        ) : (
          <></>
        )}
      </div>

      <Modal isOpen={isModalErrorOpen} onClose={() => setIsModalErrorOpen(false)}>
        <h3 className="text-xl font-bold m-4 text-center text-red-600">
          Товары по артикулу {inputValue} не найдены
        </h3>
      </Modal>
    </div>
  );
}

export default App;