import { Search } from "lucide-react";

const InputSearch = ({ handleClick, inputValue, setInputValue }) => {
  const handleSearch = () => {
    if (inputValue.trim()) {
      handleClick(inputValue.trim());
    }
  };

  return (
    <div className="flex items-center w-full max-w-3xl bg-gray-100 rounded-2xl shadow-md p-1 mx-auto">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
        placeholder="Введите артикул детали"
        className="w-full px-4 bg-gray-100 rounded-l-2xl text-gray-700 outline-none placeholder-gray-500 text-lg"
        onKeyPress={(e) => (e.key === 'Enter' && inputValue) && handleSearch()}
      />
      <button 
        className="bg-blue-600 text-white p-4 rounded-3xl hover:bg-blue-700 transition-all ml-2"
        onClick={handleSearch}
      >
        <Search className="w-6 h-6" />
      </button>
    </div>
  );
};

export default InputSearch;