import React from "react";

import { NavLink } from "react-router-dom";

import ".././style.css";

import ItemDetailContainer from "./ItemDetailContainer";

function Item({ producto }) {
  const { imagen, nombre, precio } = producto;
  return (
    <>
      <div className="divImg">
        <img
          className="imgDivImg"
          src={imagen}
          alt={`ERROR AL CARGAR IMG DE: ${nombre}`}
        />
      </div>
      <div className="margen">{nombre}</div>
      <div className="margen">{"$ " + precio}</div>

      <NavLink to={`/item/${producto.id}`} activeClassName="" className="">
        <button className="margen botonVerDetalle botonHover">
          ver detalle
        </button>
      </NavLink>

      <ItemDetailContainer producto={producto} />
    </>
  );
}

export default Item;
