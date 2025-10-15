import React, { useState } from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  console.log(coverImg);

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Link to={`/restaurants/${id}`}>
      <div className="flex flex-col p-3 bg-gray-50 border-gray-100 rounded-md shadow-md hover:shadow-lg border-2 hover:border-green-500">
        <div className="bg-cover bg-center mb-3 py-28 relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-400">이미지 로딩 중...</span>
            </div>
          )}
          {!imageError ? (
            <img
              src={coverImg}
              alt={name}
              className="w-full h-full object-cover absolute inset-0 rounded-md"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: imageLoading ? "none" : "block" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                이미지를 불러올 수 없습니다
              </span>
            </div>
          )}
        </div>
        <h3 className="text-xl">{name}</h3>
        <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};
