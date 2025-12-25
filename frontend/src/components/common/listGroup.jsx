import React from "react";

const ListGroup = ({
  items,
  textProperty = "name",
  valueProperty = "_id",
  selectedItem,
  onItemSelect,
}) => {
  return (
    <div className="card shadow-sm">
    <ul className="list-group shadow-sm">
      {items.map((item) => (
        <li
          onClick={() => onItemSelect(item)}
          key={item[valueProperty]}
          className={
            item[valueProperty] === selectedItem?.[valueProperty]
            ? "list-group-item active"
            : "list-group-item"   
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
   </div>
  );
};

export default ListGroup;
