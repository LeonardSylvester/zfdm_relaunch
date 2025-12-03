import React, { useEffect, useState } from "react";

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const divColors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % divColors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [divColors.length]);

  return (
    <div className="bg-green-100 p-8">
      {/* Navigation Buttons */}
      <div className="flex justify-around border-b-2">
        {divColors.map((_, index) => (
          <button
            key={index}
            className={`pb-2 ${activeIndex === index
                ? "border-b-2 border-black"
                : "border-b-2 border-gray-300"
              }`}
            onClick={() => setActiveIndex(index)}
          >
            Button {index + 1}
          </button>
        ))}
      </div>

      {/* Slider Section */}
      <div className="relative mt-8 flex overflow-hidden h-64">
        {divColors.map((color, index) => (
          <div
            key={index}
            className={`absolute transition-transform duration-500 ease-in-out ${activeIndex === index
                ? "transform translate-x-0"
                : activeIndex > index
                  ? "transform -translate-x-full"
                  : "transform translate-x-full"
              }`}
            style={{
              width: "100%",
              height: "100%",
              left: `${index * 100}%`,
            }}
          >
            <div className={`w-full h-full ${color}`} />
            <p>{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
