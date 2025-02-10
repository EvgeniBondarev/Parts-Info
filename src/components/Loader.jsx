const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-64 h-64">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-300 shadow-md">
          {Array.from({ length: 31 }).map((_, index) => {
            const rotation = index * 5 - 75;
            return (
              <div
                key={index}
                className="absolute left-1/2 top-0 h-1/2 -translate-x-1/2 origin-bottom"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="w-[1px] h-3 bg-gray-400 ml-[-1px] translate-y-1" />
              </div>
            );
          })}

          <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-gray-500 rounded-full" />

          <div className="absolute left-1/2 bottom-1/2 w-[2px] h-16 origin-bottom -translate-x-1/2 animate-spin-slow">
            <div className="w-full h-full bg-gray-600 rounded-full shadow-[0_0_10px_1px_rgba(156,163,175,0.3)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;