import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faCheck } from "@fortawesome/free-solid-svg-icons";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  photo?: string | null;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  photo,
  isCustomer = false,
  orderStarted = false,
  options,
  isSelected,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (isCustomer && !orderStarted) {
      alert("상단의 '메뉴 선택하기 버튼'을 눌러주세요.");
    }
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      className={`peer rounded-md px-8 py-4 border-2 cursor-pointer  transition-all ${
        isSelected ? "border-green-500" : "hover:shadow-md"
      }`}
    >
      {photo && (
        <div className="mb-4">
          <img
            src={photo}
            alt={name}
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
      )}
      <div className="mb-5 flex justify-between">
        <h3 className="text-xl font-medium flex items-center ">
          {name}{" "}
          {orderStarted && (
            <button
              className={`ml-3 py-1 px-2 focus:outline-none text-sm rounded-md  text-white ${
                isSelected && " bg-lime-600"
              }`}
            >
              {isSelected && (
                <FontAwesomeIcon icon={faCheck} className="text-sm " />
              )}
            </button>
          )}
        </h3>
        <span className="mt-1">{price} ₩</span>
      </div>
      <h4 className="font-medium">{description}</h4>

      {isCustomer && options && options?.length !== 0 && (
        <div className="">
          <div className="grid gap-2  justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};
