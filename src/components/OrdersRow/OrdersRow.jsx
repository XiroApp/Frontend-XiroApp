import { Autocomplete, Button, Input, TextField, Tooltip } from "@mui/material";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch } from "react-redux";
import { changeOrderStatus } from "../../redux/actions/adminActions";
import {
  Close,
  Diversity3,
  Inventory2Outlined,
  MopedOutlined,
  PermIdentity,
  WarehouseOutlined,
} from "@mui/icons-material";
import propTypes from "prop-types";
import { formatPrice, len } from "../../Common/helpers";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function OrdersRow({
  value,
  column,
  printingUsers = [],
  deliveryUsers = [],
  distributionUsers = [],
  pickupUsers = [],
  orderId,
  order,
  editor,
  fetchOrders,
  classes,
}) {
  const dispatch = useDispatch();
  /* VIEW FILES MODAL */
  const [open, setOpen] = useState(false);

  const handleOpenFilesModal = () => setOpen(true);

  /* VIEW ASSIGNED MODAL */
  const [openAssignedModal, setOpenAssignedModal] = useState(false);

  const handleOpenAssignedModal = async () => {
    setOpenAssignedModal(true);
  };
  /* VIEW CLIENT MODAL */
  const [openClientModal, setOpenClientModal] = useState(false);

  const handleOpenClientModal = () => setOpenClientModal(true);

  /* FILES ACCORDION */
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  /* STATUS ACCORDION */
  const [editStatus, setEditStatus] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [placeModal, setPlaceModal] = useState(false);
  const [printingSelectStatus, setPrintingSelectStatus] = useState(null);
  const [deliverySelectStatus, setDeliverySelectStatus] = useState(null);
  const [problemsSelectStatus, setProblemsSelectStatus] = useState(null);

  function handleSetEdiStatus() {
    setEditStatus(false);
    setPrintingSelectStatus(false);
    setDeliverySelectStatus(false);
    setProblemsSelectStatus(false);
  }

  /* STATUS PRINTING */
  const [input, setInput] = useState({
    orderId: orderId,
    uidPrinting: order.uidPrinting || null,
    uidDelivery: order.uidDelivery || null,
    uidDistribution: order.uidDistribution || null,
    uidPickup: order.uidPickup || null,
    clientUid: order.clientUid || null,
    orderStatus: order.orderStatus || null,
    report: order.report || null,
  });

  /* AUTOCOMPLETE STATE */
  const printingProps = {
    options: printingUsers,
    getOptionLabel: (option) => option?.displayName ?? "N/A",
  };
  const deliveryProps = {
    options: deliveryUsers,
    getOptionLabel: (option) => option?.displayName ?? "N/A",
  };

  function handleInput(e) {
    if (e.target.value === "pending") {
      setProblemsSelectStatus(false);
      setDeliverySelectStatus(false);
      setPrintingSelectStatus(true);
    } else if (e.target.value === "in_delivery") {
      setProblemsSelectStatus(false);
      setPrintingSelectStatus(false);
      setDeliverySelectStatus(true);
    } else if (e.target.value === "problems") {
      setDeliverySelectStatus(false);
      setPrintingSelectStatus(false);
      setProblemsSelectStatus(true);
    } else if (
      e.target.value === null ||
      e.target.value === "process" ||
      e.target.value === "unassigned" ||
      e.target.value === "printed" ||
      e.target.value === "received"
    ) {
      setDeliverySelectStatus(false);
      setPrintingSelectStatus(false);
      setProblemsSelectStatus(false);
    }
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  function handleAssignStatus() {
    let selectedPrinting = printingUsers.find(
      (user) =>
        user.displayName === input.uidPrinting || user.uid === input.uidPrinting
    );

    let selectedDelivery = deliveryUsers.find(
      (user) =>
        user.displayName === input.uidDelivery || user.uid === input.uidDelivery
    );
    let selectedDistribution = distributionUsers.find(
      (user) =>
        user.displayName === input.uidDelivery || user.uid === input.uidDelivery
    );
    let selectedPickup = pickupUsers.find(
      (user) =>
        user.displayName === input.uidDelivery || user.uid === input.uidDelivery
    );

    dispatch(
      changeOrderStatus({
        idOrder: orderId,
        orderStatus: input?.orderStatus || order?.orderStatus,
        uidPrinting: selectedPrinting?.uid || order?.uidPrinting,
        uidDelivery: selectedDelivery?.uid || order?.uidDelivery,
        uidDistribution: selectedDistribution?.uid || order?.uidDistribution,
        uidPickup: selectedPickup?.uid || order?.uidPickup,
        uidClient: order?.clientUid,
        report: problemsSelectStatus || input?.report || "",
        editor: editor,
        order_number: order?.order_number,
      })
    ).then(() => fetchOrders("refresh"));
    setEditStatus(false);
  }

  return (
    <td key={column.id} align={column.align} className={classes}>
      <div className="flex items-center w-fit">
        {column.id === "price" && (
          <span className="text-sm font-bold">${value}</span>
        )}
        {column.id === "order_number" && (
          <span className="font-bold">{order.order_number}</span>
        )}
        {column.id === "createdAt" && (
          <>
            <span className="text-sm">{value}</span>
          </>
        )}
        {column.id === "paymentId" && (
          <span className="text-sm">{order.paymentId}</span>
        )}
        {column.id === "transactionAmount" && (
          <>
            <Button
              color="inherit"
              variant="text"
              className="hover:underline"
              onClick={() => setPriceModal(true)}
            >
              <span className="min-w-20 w-full text-start">
                ${formatPrice(order.transactionAmount)}
              </span>
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog open={priceModal} onClose={() => setPriceModal(false)}>
              <DialogTitle className="text-center">Monto</DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8 w-[300px]">
                <section className="flex flex-col justify-start items-start ">
                  <ul className="flex flex-col items-start justify-start [&>li]:text-lg gap-y-4">
                    <li>Subtotal: ${formatPrice(order.subtotal_price)}</li>
                    <li>Envío: ${formatPrice(order.shipment_price)}</li>
                    {order.cart.map((item, index) => (
                      <li key={index}>
                        Cupón {index + 1}: {item?.coupon_used?.type[0] || ""}
                        {item?.coupon_used?.ammount || 0}
                      </li>
                    ))}
                  </ul>
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={() => setPriceModal(false)}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {column.id === "orderStatus" && (
          <>
            <button type="button" onClick={() => setEditStatus(true)}>
              <p className="text-[13px] w-[145px] text-start">
                {value === "pending"
                  ? "Pendiente ⏳"
                  : value === "process"
                  ? "En proceso 🔨"
                  : value === "problems"
                  ? "Con problemas 📛"
                  : value === "printed"
                  ? "Impreso 📄"
                  : value === "in_delivery"
                  ? "En delivery 🛸"
                  : value === "received"
                  ? "Recibido ✅"
                  : value === "distribution"
                  ? "En punto de distribución 🏤"
                  : value === "pickup"
                  ? "En punto de retiro 🏃‍♂️"
                  : "🚨 REVISAR ESTADO 🚨"}
              </p>
            </button>
            {/* MODAL FORMULARIO EDITAR ESTADO DE ORDEN */}
            <Dialog open={editStatus} onClose={() => setEditStatus(false)}>
              <DialogTitle className="text-center">Editar estado</DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col items-center gap-4 w-96">
                  <Typography className="">
                    Estado actual:{" "}
                    {value === "pending"
                      ? "Pendiente ⏳"
                      : value === "process"
                      ? "En proceso 🔨"
                      : value === "problems"
                      ? "Con problemas 📛"
                      : value === "printed"
                      ? "Impreso 📄"
                      : value === "in_delivery"
                      ? "En delivery 🛸"
                      : value === "received"
                      ? "Recibido ✅"
                      : value === "distribution"
                      ? "En punto de distribución 🏤"
                      : value === "pickup"
                      ? "En punto de retiro 🏃‍♂️"
                      : "🚨 REVISAR ESTADO 🚨"}
                  </Typography>
                  <Typography>
                    {value === "problems" && !!input.report
                      ? "Motivo: " + input.report
                      : null}
                  </Typography>
                  <div className="w-full">
                    {/* AUTOCOMPLETE DE ESTADOS */}
                    <div className="flex flex-col w-full">
                      {editor === "deliveryUser" && value == "distribution" ? (
                        <div className="flex flex-col gap-1">
                          <p>
                            Dirígete al punto de distribución para retirar el
                            pedido.
                          </p>
                          <Typography className="">
                            <span className="font-bold"> Dirección: </span>
                            {`${order.distributionUser.addresses[0].name} ${order.distributionUser.addresses[0].number}, ${order.distributionUser.addresses[0].locality}, ${order.distributionUser.addresses[0].city}`}
                          </Typography>
                        </div>
                      ) : (
                        <>
                          <label className="py-2" htmlFor="orderStatus">
                            Cambiar estado de orden
                          </label>
                          <select
                            onChange={(e) => handleInput(e)}
                            name="orderStatus"
                            id="orderStatus"
                            className="border rounded-l p-2 bg-white"
                          >
                            {editor === "pickupUser" ? (
                              <>
                                <option value="pickup">Seleccionar</option>
                                <option value="received">
                                  Entregado a cliente ✅
                                </option>
                                <option value="problems">
                                  Reportar problemas 📛
                                </option>
                              </>
                            ) : (
                              false
                            )}

                            {editor === "deliveryUser" &&
                            value !== "distribution" ? (
                              <>
                                <option value="in_delivery">Seleccionar</option>
                                {/* <option value="distribution">
                                  Regresar a punto de distribución 🏤
                                </option> */}
                                <option value="received">
                                  Entregado a cliente ✅
                                </option>
                                <option value="problems">
                                  Reportar problemas 📛
                                </option>
                              </>
                            ) : (
                              false
                            )}
                            {editor === "adminUser" ? (
                              <>
                                <option value="pending">Seleccionar</option>
                                <option value="unassigned">
                                  No asignado 🚦
                                </option>
                                <option value="problems">
                                  Con problemas 📛
                                </option>
                                <option value="pending">Pendiente ⏳</option>
                                <option value="process">En proceso 🔨</option>
                                <option value="printed">Impreso 📄</option>

                                {order?.place?.type === "Envío a domicilio" ? (
                                  <>
                                    <option value="distribution">
                                      Enviado a punto de distribución 🏤
                                    </option>
                                    <option value="in_delivery">
                                      En delivery 🛸
                                    </option>
                                  </>
                                ) : (
                                  <option value="pickup">
                                    Enviado a punto pickup 🏃‍♂️
                                  </option>
                                )}
                                <option value="received">Recibido ✅</option>
                              </>
                            ) : (
                              false
                            )}
                            {editor === "printingUser" ? (
                              <>
                                <option value="printed">Seleccionar</option>
                                <option value="pending">Pendiente ⏳</option>
                                <option value="process">En proceso 🔨</option>
                                <option value="printed">Impreso 📄</option>
                                <option value="problems">
                                  Reportar problemas 📛
                                </option>
                                {order?.place?.type === "Envío a domicilio" ? (
                                  <option value="distribution">
                                    Enviado a punto de distribución 🏤
                                  </option>
                                ) : (
                                  <option value="pickup">
                                    Enviado a punto pickup 🏃‍♂️
                                  </option>
                                )}
                              </>
                            ) : (
                              false
                            )}
                            {editor === "distributionUser" ? (
                              <>
                                <option value="distribution">
                                  Seleccionar
                                </option>
                                <option value="in_delivery">
                                  Entregado a delivery 🛸
                                </option>
                                <option value="problems">
                                  Reportar problemas 📛
                                </option>
                              </>
                            ) : (
                              false
                            )}
                          </select>
                        </>
                      )}
                    </div>
                  </div>

                  {printingSelectStatus && editor === "adminUser" ? (
                    <>
                      <p>Seleccione imprenta:</p>

                      <div className="flex flex-col w-full">
                        <Autocomplete
                          {...printingProps}
                          id="auto-complete"
                          name="uidPrinting"
                          onSelect={(e) => handleInput(e)}
                          renderInput={(params) => (
                            <TextField
                              // error={error.city}
                              name="uidPrinting"
                              placeholder="Elige imprenta..."
                              {...params}
                              label=""
                              variant="standard"
                            />
                          )}
                        />
                      </div>
                    </>
                  ) : // false
                  deliverySelectStatus && editor === "adminUser" ? (
                    <>
                      <p>Seleccione delivery:</p>

                      <div className="flex flex-col w-full">
                        <Autocomplete
                          {...deliveryProps}
                          id="auto-complete"
                          name="uidDelivery"
                          onSelect={(e) => handleInput(e)}
                          renderInput={(params) => (
                            <TextField
                              // error={error.city}
                              name="uidDelivery"
                              placeholder="Elige delivery..."
                              {...params}
                              label=""
                              variant="standard"
                            />
                          )}
                        />
                      </div>
                    </>
                  ) : // false
                  problemsSelectStatus ? (
                    <>
                      <p>Describa el problema:</p>
                      <Input
                        name="report"
                        id="report"
                        placeholder={"Ingrese su problema aquí..."}
                        onChange={(e) => handleInput(e)}
                        className="w-full"
                      />
                    </>
                  ) : (
                    false
                  )}
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={() => handleSetEdiStatus(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={(e) => handleAssignStatus(e)}
                >
                  Aceptar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {column.id === "cart" && (
          <>
            <Button
              color="inherit"
              variant="text"
              onClick={(e) => handleOpenFilesModal(e)}
              // className="border rounded-lg py-2 px-2 hover:bg-[#458552] min-w-24"
            >
              <Inventory2Outlined />
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle className="text-center">
                Detalles del pedido
              </DialogTitle>
              <DialogContent
                dividers
                className="flex flex-col gap-8 w-full max-w-[400px]"
              >
                <section className="flex flex-col gap-4">
                  {order?.cart?.map((order, index) => {
                    return (
                      <div key={index} className="flex flex-col gap-1">
                        <p>Pedido {index + 1}</p>
                        <div className=" bg-[#fff] p-4 rounded-lg">
                          <Accordion
                            expanded={expanded === order.orderUid}
                            onChange={handleChange(order.orderUid)}
                          >
                            <AccordionSummary
                              aria-controls="panel1d-content"
                              id="panel1d-header"
                            >
                              <Typography>
                                Detalles de personalización
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <ul>
                                <li>
                                  <span className="font-light">
                                    Copias por archivo:
                                  </span>
                                  <span className="font-bold">
                                    {order.numberOfCopies}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">
                                    Orientación:
                                  </span>
                                  <span className="font-bold">
                                    {order.orientacion}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">
                                    Forma de impresión:
                                  </span>
                                  <span className="font-bold">
                                    {order.printWay}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">
                                    Total de páginas:
                                  </span>
                                  <span className="font-bold">
                                    {order.totalPages}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">
                                    Tamaño de papel:
                                  </span>
                                  <span className="font-bold">
                                    {order.size}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">
                                    Copias por carilla:
                                  </span>
                                  <span className="font-bold">
                                    {order.copiesPerPage}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">Color:</span>
                                  <span className="font-bold">
                                    {order.color}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">Anillado:</span>
                                  <span className="font-bold">
                                    {order.finishing}
                                  </span>
                                </li>
                                <li>
                                  <span className="font-light">
                                    Agrupación:
                                  </span>
                                  <span className="font-bold">
                                    {order?.group || "Sin información"}
                                  </span>
                                </li>
                              </ul>
                            </AccordionDetails>
                          </Accordion>
                          <Accordion
                            expanded={expanded === index}
                            onChange={handleChange(index)}
                          >
                            <AccordionSummary
                              aria-controls="panel2d-content"
                              id="panel2d-header"
                            >
                              <Typography>Archivos</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <div>
                                <section className="flex flex-col gap-3">
                                  {order.files.map((file, index) => (
                                    <div key={index} className="flex gap-2">
                                      <p>{`${file?.slice(20, 50)}`}</p>
                                      <Tooltip
                                        placement="top"
                                        title="Ver Archivo"
                                      >
                                        <a
                                          target="_blank"
                                          rel="noreferrer"
                                          download
                                          href={`https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/${file}?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289`}
                                        >
                                          <VisibilityIcon
                                            className="hover:bg-gray-500 rounded-lg"
                                            sx={{
                                              height: "0.7em",
                                              width: "0.7em",
                                            }}
                                          />
                                        </a>
                                      </Tooltip>
                                    </div>
                                  ))}
                                </section>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                          {index == 0 && len(order?.libraryCart) > 0 && (
                            <Accordion>
                              <AccordionSummary>
                                <Typography>Articulos de Librería</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {order?.libraryCart?.map((item) => (
                                  <li key={item.id} className="flex gap-2">
                                    <p>{item.name}</p>
                                    <p>{item.quantity}</p>
                                    <p>{item.price}</p>
                                  </li>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          )}
                          {index == 0 &&
                            len(order?.description?.trim()) > 0 && (
                              <Accordion>
                                <AccordionSummary>
                                  <Typography>Comentarios</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <p>{order.description}</p>
                                </AccordionDetails>
                              </Accordion>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </section>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={() => setOpen(false)}>
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {column.id === "assigned" && (
          <>
            <Button
              color="inherit"
              variant="text"
              onClick={() => {
                handleOpenAssignedModal();
              }}
              // className="border rounded-lg py-2 px-2 hover:bg-[#458552] min-w-24"
            >
              <Diversity3 />
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog
              open={openAssignedModal}
              onClose={() => setOpenAssignedModal(false)}
            >
              <DialogTitle className="text-center">Responsables</DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-2">
                    <li>
                      Imprenta:{" "}
                      {order?.printingUser
                        ? order.printingUser.displayName
                        : "Sin asignar"}
                    </li>

                    <li>
                      Punto de Distribución:{" "}
                      {order?.distributionUser
                        ? order.distributionUser.displayName
                        : "Sin asignar"}
                    </li>

                    {order?.place?.type === "Envío a domicilio" ? (
                      <li>
                        Delivery:{" "}
                        {order?.deliveryUser
                          ? order.deliveryUser.displayName
                          : "Sin asignar"}
                      </li>
                    ) : (
                      <li>
                        Punto Pick Up:{" "}
                        {order?.pickupUser
                          ? order.pickupUser.displayName
                          : "Sin asignar"}
                      </li>
                    )}
                  </ul>
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={() => setOpenAssignedModal(false)}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {column.id === "clientUid" && (
          <>
            <Button
              color="inherit"
              variant="text"
              onClick={() => {
                handleOpenClientModal(value);
              }}
              // className="border rounded-lg py-2 px-2 hover:bg-[#458552] min-w-24"
            >
              <PermIdentity />
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog
              open={openClientModal}
              onClose={() => setOpenClientModal(false)}
            >
              <DialogTitle className="text-center flex items-center justify-between">
                <Typography variant="h6">Información del Cliente </Typography>
                <Button
                  variant="text"
                  onClick={() => setOpenClientModal(false)}
                >
                  <Close />
                </Button>
              </DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col gap-4">
                  <ul>
                    <li>Nombre: {order.clientUser?.displayName}</li>
                    <li className="flex items-center gap-2">
                      <span>Teléfono: {order.clientUser?.phone}</span>
                    </li>
                    <li>Email: {order.clientUser?.email}</li>
                  </ul>
                </section>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="success">
                  <a
                    href={`https://wa.me/${order?.clientUser?.areaCode}${order?.clientUser?.phone}?text=Hola! Te escribimos desde XIRO para darte información sobre tu pedido.`}
                  >
                    <WhatsAppIcon />
                  </a>
                </Button>
                <Button variant="contained" color="info">
                  <a
                    href={`tel:+${order?.clientUser?.areaCode}${order?.clientUser?.phone}?`}
                  >
                    <PhoneForwardedIcon />
                  </a>
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {column.id === "place" && (
          <>
            <Button
              color="inherit"
              variant="text"
              onClick={() => {
                setPlaceModal(true);
              }}
            >
              {order?.place?.type === "Envío a domicilio" ? (
                <>
                  <MopedOutlined className="h-4 w-4" /> | Envío
                </>
              ) : order?.place?.type === "Retiro" ? (
                <>
                  <WarehouseOutlined className="h-4 w-4" /> |{" "}
                  {order?.place?.type}
                </>
              ) : (
                order?.place?.type || "Revisar pedido"
              )}
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog open={placeModal} onClose={() => setPlaceModal(false)}>
              <DialogTitle className="text-center">
                Información del cliente
              </DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col justify-start items-start ">
                  <div>
                    <ul className="flex flex-col items-start justify-start gap-3">
                      <li className="text-[12px] text-start">
                        Distancia: {order?.cart[0]?.distance?.text}{" "}
                      </li>
                      <li className="text-[12px] text-start">
                        Disponibilidad: {`${order?.availability}`}
                      </li>
                      <li className="text-[12px] text-start">
                        Ciudad: {value?.address?.city}{" "}
                      </li>
                      <li className="text-[12px] text-start">
                        Localidad: {value?.address?.locality}
                      </li>
                      <li className="text-[12px] text-start">
                        Calle:
                        {` ${value?.address?.name} ${value?.address?.number}`}
                      </li>
                      <li className="text-[12px] text-start">
                        Piso/Casa: {value?.address?.floorOrApartment}{" "}
                      </li>
                      <li className="text-[12px] text-start">
                        C.P: {value?.address?.zipCode}{" "}
                      </li>
                    </ul>
                  </div>
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={() => setPlaceModal(false)}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {column.id === "paymentStatus" && (
          <div className="w-28 flex flex-col justify-center items-start capitalize text-[13px]">
            {order.paymentStatus === "approved" ? (
              <span className="text-green-600">aprobado</span>
            ) : (
              <span className="text-red-500">{order.paymentStatus}</span>
            )}

            {order.statusDetail === "accredited" ? (
              <span className="text-green-600">acreditado</span>
            ) : (
              <span className="text-red-500">{order.statusDetail}</span>
            )}
          </div>
        )}
      </div>
    </td>
  );
}

OrdersRow.propTypes = {
  value: propTypes.any,
  column: propTypes.any,
  printingUsers: propTypes.array,
  deliveryUsers: propTypes.array,
  distributionUsers: propTypes.array,
  pickupUsers: propTypes.array,
  orderId: propTypes.any,
  order: propTypes.any,
  editor: propTypes.any,
  fetchOrders: propTypes.any,
  classes: propTypes.any,
};
