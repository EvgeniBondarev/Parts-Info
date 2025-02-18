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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      
      let suppliersFromJs = data.suppliersFromJs;
      let suppliersFromTd =data.suppliersFromTd;
      let suppliersFromTdAndJs = [];

      suppliersFromTd = suppliersFromTd.filter(supplierFromTd => {
        const matchIndex = suppliersFromJs.findIndex(supplierFromJs => Number(supplierFromJs.tecdocSupplierId) === supplierFromTd.id);
      
        if (matchIndex !== -1) {
          suppliersFromTdAndJs.push({ ...supplierFromTd, ...suppliersFromJs[matchIndex] });
          suppliersFromJs.splice(matchIndex, 1);
          return false;
        }
        return true;
      });

      setArticles({
        suppliersFromTd: suppliersFromTd,
        suppliersFromJs: suppliersFromJs,
        suppliersFromTdAndJs: suppliersFromTdAndJs
      });
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
      <div className="w-full pt-6 sticky top-0 bg-gray-300">
        <div className={`transition-transform duration-300 scale-90 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
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
        <div className={`transition-all duration-300 ${selectedArticle ? "w-1/5" : "w-full"} p-6`}>
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : articles ? (
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md animate-fade-in mb-8 mx-auto p-4">
              <div className="space-y-4">
                {articles?.suppliersFromTdAndJs?.map((item) => (
                  <SmallCard
                    key={item.id}
                    title={item.description}
                    splitFrom="from-red-500"
                    splitTo="to-blue-500"
                    onClick={() => {setSelectedArticle({supplierName: item.description, articleName: inputValue}); window.scrollTo({top: 0, behavior: 'smooth'});}}
                  />
                ))}

                {articles?.suppliersFromTd?.map((item) => (
                  <SmallCard
                    key={item.id}
                    title={item.description}
                    color='bg-red-500'
                    onClick={() => {setSelectedArticle({supplierName: item.description, articleName: inputValue}); window.scrollTo({top: 0, behavior: 'smooth'});}}
                  />
                ))}
                
                {articles?.suppliersFromJs?.map((item) => (
                  <SmallCard
                    key={item.id}
                    title={`${item.name}${item.marketPrefix ? " / " + item.marketPrefix : ""}`}
                    color='bg-blue-500'
                    onClick={() => {setSelectedArticle({supplierName: item.name, articleName: inputValue}); window.scrollTo({top: 0, behavior: 'smooth'});}}
                  />
                ))}                
              </div>
            </div>
          ) : null}
        </div>

        {selectedArticle && (
          <div className="flex-1 h-auto w-4/5 min-h-full p-4">
            <FullCard
              supplierName={selectedArticle.supplierName}
              articleName={selectedArticle.articleName}
              onClose={() => setSelectedArticle(null)}
            />
        </div>
        
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