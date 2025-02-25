import React from "react";
import SingleItem from "./SingleItem";
import { Link, useLocation } from "react-router-dom";

const ItemList = ({ title, items, itemsArray, path, idPath }) => {
  const { pathname } = useLocation();
  const isArtist = idPath === "/artist";
  const isHome = pathname === "/";
  const finalItems = isHome ? items : itemsArray.length;

  return (
    <div className="item-list">
      <div className="item-list__header">
        <h2>{title}</h2>
        {isHome && <Link className="item-list__link" to={path}>Mostrar Tudo</Link>}
      </div>

      <div className="item-list__container">
        {itemsArray
          .slice(0, finalItems)
          .map((currentValue, index) => (
            <SingleItem
              {...currentValue}
              idPath={idPath}
              isArtist={isArtist}
              key={`${title}-${index}`}
            />
          ))}
      </div>
    </div>
  );
};

export default ItemList;
