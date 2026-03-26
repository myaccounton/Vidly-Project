import React from "react";

const ListGroup = ({
  items,
  textProperty = "name",
  valueProperty = "_id",
  selectedItem,
  onItemSelect,
}) => {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          onClick={() => onItemSelect(item)}
          key={item[valueProperty]}
          className={
            item[valueProperty] === selectedItem?.[valueProperty]
              ? "clickable rounded-lg bg-blue-600/20 px-3 py-2 text-sm font-medium text-blue-200 transition"
              : "clickable rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-700"
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
