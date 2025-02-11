import { useState, useEffect } from 'react';
import InputSearch from './components/InputSearch';
import Loader from './components/Loader';
import { get } from './api/baseRequests'
import Modal from './components/Modal';
import SmallCard from './components/SmallCard';
import FullCard from './components/FullCard';

function App() {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState(null);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

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
      setSelectedArticle(null);
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
      <div className="w-full pt-12 sticky top-0 bg-gray-300">
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
                      setSelectedArticle(null);
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

      <div className="flex-grow flex w-full transition-all duration-300 z-10">
        <div className={`transition-all duration-300 ${selectedArticle ? "w-1/4" : "w-full"} p-6`}>
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : articles ? (
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md animate-fade-in mb-8 mx-auto p-4">
              <div className="space-y-4">
                {articles?.suppliersFromJs?.map((item) => (
                  <SmallCard
                    key={item.id}
                    title={`${item.name}${item.marketPrefix ? " / " + item.marketPrefix : ""}`}
                    color="bg-blue-500"
                    onClick={() => setSelectedArticle({supplierName: item.name, articleName: inputValue})}
                  />
                ))}

                {articles?.suppliersFromTd?.map((item) => (
                  <SmallCard
                    key={item.id}
                    title={item.description}
                    color="bg-red-500"
                    onClick={() => setSelectedArticle({supplierName: item.description, articleName: inputValue})} 
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {selectedArticle && (
          <FullCard
            supplierName={selectedArticle.supplierName}
            articleName={selectedArticle.articleName}
            onClose={() => setSelectedArticle(null)} />
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