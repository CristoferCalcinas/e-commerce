import clsx from "clsx";

import type { Size } from "@/interfaces";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];

  onSizeChange: (size: Size) => void;
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChange,
}: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            onClick={() => onSizeChange(size)}
            key={size}
            className={clsx("mx-2 hover:underline text-lg", {
              "bg-blue-600 hover:bg-blue-800 text-white rounded transition-all px-2 py-1":
                size === selectedSize,
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
