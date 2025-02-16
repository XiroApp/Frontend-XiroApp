import { useState, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { OrdersAdapter } from "../../../Infra/Adapters/orders.adatper";

const OrdersPool = () => {
  const [batchOrders, setBatchOrders] = useState([]);
  const fetchOrders = async () => {
    const response = await OrdersAdapter.getUnassignedOrders();
    const batchOrders = clasificarPedidos(response);
    setBatchOrders(batchOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  console.log("sin asignar", batchOrders);

  function determinarColor(fecha) {
    const diaSemana = fecha.getDay(); // 0 (Domingo) - 6 (Sábado)
    const hora = fecha.getHours();

    if (diaSemana === 1 && hora < 17) {
      // Lunes antes de las 17h
      return "verde";
    } else if (diaSemana === 4 && hora >= 17) {
      // Jueves a partir de las 17h
      return "verde";
    } else if (diaSemana >= 1 && diaSemana <= 3) {
      // Martes, Miércoles, Jueves antes de las 17h
      return "amarillo";
    } else if (diaSemana >= 5 || diaSemana === 0) {
      // Viernes, Sábado, Domingo, Lunes después de las 17h
      return "verde";
    } else {
      return "amarillo"; // Jueves antes de las 17h
    }
  }

  function clasificarPedidos(pedidos) {
    const pedidosPorSemana = [];
    let semanaActual = [];
    let fechaInicioSemana = null;

    pedidos.forEach((pedido) => {
      const fechaPedido = new Date(pedido.created_at);

      // Si es el primer pedido de la semana, establece la fecha de inicio
      if (!fechaInicioSemana) {
        fechaInicioSemana = new Date(fechaPedido);
        fechaInicioSemana.setHours(0, 0, 0, 0); // Inicio de la semana a las 00:00:00
      }

      // Si el pedido es de una semana diferente, guarda la semana anterior y comienza una nueva
      if (
        fechaPedido.getTime() < fechaInicioSemana.getTime() ||
        (fechaPedido.getDay() === 1 && fechaPedido.getHours() < 17)
      ) {
        pedidosPorSemana.push(semanaActual);
        semanaActual = [];
        fechaInicioSemana = new Date(fechaPedido);
        fechaInicioSemana.setHours(0, 0, 0, 0);
      }

      const color = determinarColor(fechaPedido);
      pedido.color = color; // Añade el color al pedido
      semanaActual.push(pedido);
    });

    // Guarda la última semana
    pedidosPorSemana.push(semanaActual);

    return pedidosPorSemana;
  }

  return (
    <section className="w-full h-full text-balance flex flex-col justify-start items-start p-4 gap-2">
      <Typography className="">Lotes disponibles para retirar</Typography>

      <div className="flex flex-col gap-1">
        {batchOrders?.map(
          (batch, index) => (
            <div key={index}>
           
              - Lote AA:
              - Cantidad de pedidos {batch.length}
            </div>
          )

          // batch?.map((order, index) => (
          //   <div key={index} className="flex flex-col">
          //     <span>número{order.order_number}</span>
          //     <span>precio ${order.shipment_price}</span>
          //     <span>precio ${order.shipment_price}</span>
          //   </div>
          // ))
        )}
      </div>
    </section>
  );
};

export default OrdersPool;
