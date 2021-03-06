import firebase from "firebase/app";

import "firebase/firestore";

import React, { useContext, useState } from "react";

import { getFirestore } from "../firebase";

import { CartContext } from "../context/CartContext";

import { useRouteMatch } from "react-router-dom";

function ProductosEnCarrito({ clase }) {
  const { mostrarProductos, productos, valorTotal, removeTodo } =
    useContext(CartContext);

  let match = useRouteMatch("/carrito");

  const [orderCreatedId, setOrderCreatedId] = useState(null);

  const [confirmEmail, setConfirmEmail] = useState("");

  const [usuario, setUsuario] = useState({
    nombreCliente: "",
    telefonoCliente: "",
    emailCliente: "",
  });

  const finDeLaCompra = () => {
    const newItems = productos.filter(({ detalle, cantidad }) => {
      if (cantidad !== 0) {
        return {
          item: {
            id: detalle.id,
            title: detalle.nombre,
            price: detalle.precio,
          },
          cantidad: cantidad,
        };
      }
    });

    const newOrder = {
      buyer: usuario,
      items: newItems,
      valorTotal: valorTotal(),
      fechaHora: firebase.firestore.Timestamp.fromDate(new Date()),
    };

    const db = getFirestore();
    const orders = db.collection("orders");
    const batch = db.batch();

    orders
      .add(newOrder)
      .then((response) => {
        productos.forEach(({ detalle, cantidad }) => {
          const docRef = db
            .collection("productosDeIndumentaria")
            .doc(detalle.id);
          batch.update(docRef, { stock: detalle.stock - cantidad });
        });
        batch.commit();
        setOrderCreatedId(response.id);
      })
      .catch((error) => alert("Ocurrio un error " + error));

    removeTodo();
  };

  const compraTerminada = () => {
    return (
      <div className="divOrdenDeCompra">
        <h4 className="tituloOrdenDeCompra">GRACIAS POR SU COMPRA!</h4>
        <p className="parrafoOrdenDeCompra">
          {usuario.nombreCliente.toUpperCase()} su orden de compra por es:
        </p>
        <h5 className="keyOrdenDeCompra">{orderCreatedId}</h5>
      </div>
    );
  };

  const agregarUsuario = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const confirmarEmail = (e) => {
    setConfirmEmail(e.target.value);
  };
  const validarEmail = () => {
    if (confirmEmail === usuario.emailCliente) {
      return true;
    } else {
      return false;
    }
  };
  const habilitarBoton = () => {
    return !(
      usuario.nombreCliente !== "" &&
      usuario.telefonoCliente !== "" &&
      usuario.emailCliente !== "" &&
      validarEmail()
    );
  };

  const inputDatosCliente = () => {
    return (
      <div className="datosDeCompra">
        <h4 className="tituloDeDatosDeCompra">
          Complete los datos para finalizar su compra.
        </h4>
        <form className="divDeInput">
          <input
            className="inputDatos"
            name="nombreCliente"
            onChange={agregarUsuario}
            type="text"
            placeholder="Nombre"
          />
          <input
            className="inputDatos"
            name="telefonoCliente"
            onChange={agregarUsuario}
            type="number"
            placeholder="Telefono"
          />
          <input
            className="inputDatos"
            name="emailCliente"
            onChange={agregarUsuario}
            type="email"
            placeholder="correo@correo.com"
          />
          <input
            className="inputDatos"
            onChange={confirmarEmail}
            type="email"
            placeholder="Repita su correo@correo.com"
          />
        </form>
        <div>
          <button
            className="botonTerminarCompra"
            disabled={habilitarBoton()}
            onClick={finDeLaCompra}
          >
            Terminar compra
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={clase}>
        {mostrarProductos()}
        {valorTotal() !== 0 && match && inputDatosCliente()}
        {orderCreatedId != null && compraTerminada()}
      </div>
    </>
  );
}

export default ProductosEnCarrito;
