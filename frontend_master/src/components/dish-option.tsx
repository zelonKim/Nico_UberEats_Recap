import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  addOptionToItem,
  removeOptionFromItem,
  dishId,
}) => {
  const onClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };
  return (
    <>
      <div className="border border-1 border-gray-200 mt-6"></div>
      <h5 className="mt-4 mb-1 font-medium">추가 옵션</h5>

      <span
        onClick={onClick}
        className={`border rounded-sm px-2 py-1 ${
          isSelected ? "border-green-500" : "hover:border-gray-800"
        }`}
      >
        <span className="mr-2">{name}</span>

        {<span className="text-sm opacity-75">({extra} ₩)</span>}
        {isSelected && (
          <FontAwesomeIcon
            icon={faPlus}
            className="text-lime-600 ml-2 text-xs"
          />
        )}
      </span>
    </>
  );
};
