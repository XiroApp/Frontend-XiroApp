import { useSelector } from "react-redux";
import { formatPrice } from "../../../Common/helpers";

export default function AccountData() {
  const clientOrders = useSelector((state) => state.clientOrders)
    .sort((a, b) => Number(b.order_number) - Number(a.order_number))
    .slice(0, 10);

  // Función para obtener el ícono y color según el estado
  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pendiente",
          icon: "⏳",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "process":
        return {
          text: "En proceso",
          icon: "🔨",
          color: "bg-blue-100 text-blue-800",
        };
      case "problems":
        return {
          text: "Problemas",
          icon: "📛",
          color: "bg-red-100 text-red-800",
        };
      case "printed":
        return {
          text: "Impreso",
          icon: "📄",
          color: "bg-purple-100 text-purple-800",
        };
      case "in_delivery":
        return {
          text: "En delivery",
          icon: "🛸",
          color: "bg-indigo-100 text-indigo-800",
        };
      case "received":
        return {
          text: "Recibido",
          icon: "✅",
          color: "bg-green-100 text-green-800",
        };
      case "distribution":
        return {
          text: "En punto de distribución",
          icon: "🏤",
          color: "bg-cyan-100 text-cyan-800",
        };
      case "pickup":
        return {
          text: "En punto de retiro",
          icon: "🏃‍♂️",
          color: "bg-orange-100 text-orange-800",
        };
      default:
        return {
          text: "Problemas",
          icon: "📛",
          color: "bg-red-100 text-red-800",
        };
    }
  };

  return (
    <section className="flex flex-col bg-white rounded-2xl p-4 md:p-6 gap-4">
      <h3 className="text-xl md:text-2xl opacity-80 mb-3 md:mb-5">
        Últimas compras
      </h3>

      {/* Versión para desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Orden
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprobante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrega
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientOrders.map((order, index) => {
              const status = getStatusStyles(order?.orderStatus);
              return (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order?.order_number}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"
                    title={order?.uid}
                  >
                    {order?.uid}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <p className="font-medium">{order?.place?.type}</p>
                    <p className="text-xs text-gray-400">
                      {order?.place?.address?.name}{" "}
                      {order?.place?.address?.number},{" "}
                      {order?.place?.address?.locality}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                    >
                      {status.text} {status.icon}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    $ {formatPrice(order?.total_price || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Versión para móvil */}
      <div className="md:hidden space-y-4">
        {clientOrders.map((order, index) => {
          const status = getStatusStyles(order?.orderStatus);
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Orden #{order?.order_number}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order?.uid.substring(0, 6)}...
                    {order?.uid.substring(order?.uid.length - 4)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${status.color}`}
                >
                  {status.icon} {status.text}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">Entrega</p>
                  <p className="text-sm">{order?.place?.type}</p>
                  <p className="text-xs text-gray-400">
                    {order?.place?.address?.name}{" "}
                    {order?.place?.address?.number},{" "}
                    {order?.place?.address?.locality}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500">Total</p>
                  <p className="text-sm font-medium">
                    $ {formatPrice(order?.total_price || 0)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
