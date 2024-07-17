"use client";

import clsx from "clsx";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChanged: (value: number) => void;
}

export const QuantitySelector = ({
  quantity,
  onQuantityChanged: onQuantityChange,
}: Props) => {
  const onValueChanged = (value: number) => {
    if (quantity + value < 1) return;
    if (quantity + value > 5) return;
    onQuantityChange(quantity + value);
  };

  return (
    <div className="flex">
      <button
        disabled={quantity === 1}
        onClick={() => onValueChanged(-1)}
        className={clsx("", {
          "opacity-25": quantity === 1,
        })}
      >
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-200 text-center text-xl rounded">
        {quantity}
      </span>

      <button
        disabled={quantity === 5}
        onClick={() => onValueChanged(+1)}
        className={clsx("", {
          "opacity-25": quantity === 5,
        })}
      >
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
