import React from "react";

const SmallCard = ({ title, color = "bg-gray-200" }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md text-center ${color} text-white 
        transition-all duration-200 transform hover:-translate-y-1 hover:brightness-95`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export default SmallCard;