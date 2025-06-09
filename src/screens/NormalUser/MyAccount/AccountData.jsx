import { useSelector } from "react-redux";
import { formatPrice } from "../../../Common/helpers";

export default function AccountData() {
  const clientOrders = useSelector((state) => state.clientOrders);

  return (
    <section className="flex flex-col bg-[#fff] rounded-2xl lg:h-2/3 p-6 gap-4">
      <h3 className="text-2xl opacity-80 mb-5">Historial</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientOrders.map((order, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(order.totalPaid)}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  title={order.uid}
                >
                  {shortenUid(order.uid)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.deliveryType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                `}
                  >
                    {/* {order.status} */}

                    {order.status === "pending"
                      ? "Pendiente ⏳"
                      : order.status === "process"
                      ? "En proceso 🔨"
                      : order.status === "problems"
                      ? "Con problemas 📛"
                      : order.status === "printed"
                      ? "Impreso 📄"
                      : order.status === "in_delivery"
                      ? "En delivery 🛸"
                      : order.status === "received"
                      ? "Recibido ✅"
                      : order.status === "distribution"
                      ? "En punto de distribución 🏤"
                      : order.status === "pickup"
                      ? "En punto de retiro 🏃‍♂️"
                      : "Con problemas 📛"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <span className="text-3xl opacity-80">Copa XIRO</span>
      <div className="flex flex-col text-lg gap-y-4 mt-4">
        <p>
          Copa XIRO es una iniciativa para premiar la confianza y el apoyo de
          nuestra comunidad. <br /> Próximamente más novedades.
        </p>
        <p>
          Seguinos en{" "}
          <a
            rel="noreferrer"
            className="text-green-800 hover:text-green-600 duration-75 underline"
            target="_blank"
            href="https://www.instagram.com/xiroapp.com.ar/profilecard/?igsh=aHR6aXdoNDNvbWps"
          >
            @xiroapp.com.ar
          </a>
        </p>
      </div> */}
    </section>
  );
}
