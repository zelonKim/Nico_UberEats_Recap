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
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dish.id, name);
    }
  };
  return (
    <span
      onClick={onClick}
      className={`flex border items-center ${
        isSelected ? "border-gray-800" : ""
      }`}
      key={index}
    >
      <h6 className="mr-2">{option.name}</h6>
      <h6 className="text-sm opacity-75">(${option.extra})</h6>
    </span>
  );
};
