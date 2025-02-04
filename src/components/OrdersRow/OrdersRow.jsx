import {
  Autocomplete,
  Button,
  Input,
  TableCell,
  TextField,
  Tooltip,
} from "@mui/material";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import React from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import { useDispatch } from "react-redux";
import {
  changeOrderStatus,
  getAllOrders,
  getUserByUid,
} from "../../redux/actions/adminActions";
import { ApiConstants } from "../../Common/constants";

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
  printingUsers,
  deliveryUsers,
  orderId,
  order,
  editor,
  fetchOrders,
}) {
  const dispatch = useDispatch();
  /* VIEW FILES MODAL */
  const [open, setOpen] = useState(false);

  const handleOpenFilesModal = (e) => {
    setOpen(true);
  };
  /* VIEW CLIENT MODAL */
  const [openClientModal, setOpenClientModal] = useState(false);
  const [clientInfo, setClientInfo] = useState({});

  const handleOpenClientModal = async (uid) => {
    setOpenClientModal(true);
    let clientData = await getUserByUid(uid);
    setClientInfo(clientData);
  };

  /* FILES ACCORDION */
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  /* STATUS ACCORDION */
  const [editStatus, setEditStatus] = useState(false);
  const [printingSelectStatus, setPrintingSelectStatus] = useState(false);
  const [deliverySelectStatus, setDeliverySelectStatus] = useState(false);
  const [problemsSelectStatus, setProblemsSelectStatus] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [placeModal, setPlaceModal] = useState(false);

  const handleSetEdiStatus = (e) => {
    setEditStatus(false);
    setPrintingSelectStatus(false);
    setDeliverySelectStatus(false);
    setProblemsSelectStatus(false);
  };

  /* STATUS PRINTING */
  const [input, setInput] = useState({
    orderId: orderId,
    uidPrinting: order.uidPrinting || "unassigned",
    uidDelivery: order.uidDelivery || "unassigned",
    clientUid: order.clientUid || "unassigned",
    orderStatus: order.orderStatus || "unassigned",
    report: order.report || "unassigned",
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
    if (e.target.value === "process") {
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
      e.target.value === "pending" ||
      e.target.value === "printed" ||
      e.target.value === "received"
    ) {
      setDeliverySelectStatus(false);
      setPrintingSelectStatus(false);
      setProblemsSelectStatus(false);
    }
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  function handleAssignStatus(e) {
    let selectedPrinting = printingUsers.find(
      (user) =>
        user.displayName === input.uidPrinting || user.uid === input.uidPrinting
    );
    let selectedDelivery = deliveryUsers.find(
      (user) =>
        user.displayName === input.uidDelivery || user.uid === input.uidDelivery
    );

    dispatch(
      changeOrderStatus({
        idOrder: input.orderId,
        orderStatus: input.orderStatus,
        uidPrinting: selectedPrinting?.uid || "unassigned",
        uidDelivery: selectedDelivery?.uid || "unassigned",
        uidClient: input.clientUid,
        report: input.report || "unassigned",
        editor: editor,
      })
    ).then(() => fetchOrders());
    setEditStatus(false);
  }

  return (
    <>
      <TableCell key={column.id} align={column.align} className="p-0 m-0">
        {column.id === "order_number" && (
          <>
            <span className="text-sm font-bold">{value}</span>
          </>
        )}
        {column.id === "orderStatus" && (
          <>
            <Button
              color="inherit"
              variant="text"
              onClick={(e) => setEditStatus(true)}
            >
              <Typography className="">
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
                  : "🚨 REVISAR ESTADO 🚨"}
              </Typography>
            </Button>
            {/* MODAL FORMULARIO EDITAR ESTADO DE ORDEN */}
            <Dialog open={editStatus} onClose={(e) => setEditStatus(false)}>
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
                      : "🚨 REVISAR ESTADO 🚨"}
                  </Typography>
                  <Typography>
                    Motivo: "{value === "problems" && !!input.report ? input.report : null}"
                  </Typography>
                  <div className="w-full">
                    {/* AUTOCOMPLETE DE ESTADOS */}
                    <div className="flex flex-col w-full">
                      <label className="py-2" for="orderStatus">
                        Cambiar estado de orden
                      </label>
                      <select
                        onChange={(e) => handleInput(e)}
                        name="orderStatus"
                        id="orderStatus"
                        className="border rounded-l p-2 bg-white"
                      >
                        {editor === "deliveryUser" ? (
                          <>
                            <option value="printed">Seleccionar</option>
                            {/* <option value="printed">Impreso 📄</option> */}
                            <option value="problems">Con problemas 📛</option>
                            <option value="in_delivery">En delivery 🛸</option>
                            <option value="received">Recibido ✅</option>
                          </>
                        ) : (
                          false
                        )}
                        {editor === "adminUser" ? (
                          <>
                            <option value="pending">Seleccionar</option>
                            <option value="unassigned">No asignado 🚦</option>
                            <option value="pending">Pendiente ⏳</option>
                            <option value="process">En proceso 🔨</option>
                            <option value="printed">Impreso 📄</option>
                            <option value="problems">Con problemas 📛</option>
                            <option value="in_delivery">En delivery 🛸</option>
                            <option value="received">Recibido ✅</option>
                          </>
                        ) : (
                          false
                        )}
                        {editor === "printingUser" ? (
                          <>
                            <option value="pending">Seleccionar</option>
                            <option value="pending">Pendiente ⏳</option>
                            <option value="process">En proceso 🔨</option>
                            <option value="printed">Impreso 📄</option>
                            <option value="problems">Con problemas 📛</option>
                            <option value="in_delivery">En delivery 🛸</option>
                            {/* <option value="received">Recibido ✅</option> */}
                          </>
                        ) : (
                          false
                        )}
                        {/* <option value="pending">Seleccionar</option>
                        <option value="unassigned">No asignado 🚦</option>
                        <option value="pending">Pendiente ⏳</option>
                        <option value="process">En proceso 🔨</option>
                        <option value="printed">Impreso 📄</option>
                        <option value="problems">Con problemas 📛</option>
                        <option value="in_delivery">En delivery 🛸</option>
                        <option value="received">Recibido ✅</option> */}
                      </select>
                    </div>
                  </div>

                  {printingSelectStatus ? (
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
                  deliverySelectStatus ? (
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
                  onClick={(e) => handleSetEdiStatus(false)}
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
        {typeof value === "object" && value.length && (
          <>
            <Button
              color="inherit"
              variant="text"
              onClick={(e) => handleOpenFilesModal(e)}
              // className="border rounded-lg py-2 px-2 hover:bg-[#458552] min-w-24"
            >
              <Typography>Ver Pedido</Typography>
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog open={open} onClose={(e) => setOpen(false)}>
              <DialogTitle className="text-center">
                Detalles del pedido
              </DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col gap-4">
                  {value.map((order, index) => {
                    return (
                      <div key={index} className="flex flex-col gap-1">
                        <h3>Pedido {index + 1}</h3>
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
                        </div>
                      </div>
                    );
                  })}
                </section>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={(e) => setOpen(false)}>
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {column.id === "paymentId" && (
          <span className="font-bold">{value}</span>
        )}
        {column.id === "statusDetail" && (
          <div>
            {" "}
            {value === "accredited" ? (
              <div className="flex flex-col items-center gap-1">
                {/* <DoneIcon
                  sx={{ width: "1.4rem", height: "1.4rem" }}
                  className="text-green-500"
                /> */}
                <span className="text-green-500 ">acreditado</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <ErrorIcon
                  sx={{ width: "1.4rem", height: "1.4rem" }}
                  className="text-red-500"
                />
                <span className="text-red-500">{value}</span>
              </div>
            )}
          </div>
        )}
        {column.id === "paymentStatus" && (
          <div className="font-bold">
            {value === "approved" ? (
              <div className="flex flex-col items-center gap-1">
                {/* <DoneIcon
                  sx={{ width: "1.4rem", height: "1.4rem" }}
                  className="text-green-500"
                /> */}
                <span className="text-green-500">aprobado</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <ErrorIcon
                  sx={{ width: "1.4rem", height: "1.4rem" }}
                  className="text-red-500"
                />
                <span className="text-red-500">{value}</span>
              </div>
            )}
          </div>
        )}
        {column.id === "transactionAmount" && (
          <>
            <Button
              color="inherit"
              variant="text"
              className="hover:underline"
              onClick={(e) => setPriceModal(true)}
            >
              <Typography>${order.transactionAmount}</Typography>
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog open={priceModal} onClose={(e) => setPriceModal(false)}>
              <DialogTitle className="text-center">Monto</DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col justify-start items-start ">
                  <ul className="flex flex-col items-start justify-start">
                    <li>
                      <span className="text-[12px] text-black">
                        {`Subtotal: $${order.subtotal_price}`}
                      </span>
                    </li>
                    <li>
                      <span className="text-[12px] text-black">
                        {`Envío: $${order.shipment_price}`}
                      </span>
                    </li>
                    {order.cart.map((item, index) => (
                      <li>
                        <span className="text-[12px] text-black">
                          {`Cupón ${index + 1}: ${
                            item?.coupon_used?.type[0] || ""
                          } ${item?.coupon_used?.ammount || 0}`}
                        </span>
                      </li>
                    ))}
                    {/* <li>
                      <span className="text-[12px] text-black">
                        {`Cupón: ${order.cart[0].details.coupon}`}
                      </span>
                    </li> */}
                  </ul>
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={(e) => setPriceModal(false)}
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
              <Typography> Ver cliente</Typography>
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog
              open={openClientModal}
              onClose={(e) => setOpenClientModal(false)}
            >
              <DialogTitle className="text-center">
                Información del cliente
              </DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col gap-4">
                  <ul>
                    <li>Nombre: {clientInfo?.displayName}</li>
                    <li className="flex items-center gap-2">
                      <span>Teléfono: {clientInfo?.phone}</span>
                      <a
                        className="underline hover:text-green-500 flex items-center p-1 border rounded-md "
                        href={`https://wa.me/${clientInfo.areaCode}${clientInfo?.phone}?text=Hola, deseo comunicarme con el soporte de XIRO.`}
                      >
                        <WhatsAppIcon />
                      </a>
                      <a
                        className="underline hover:text-blue-500 flex items-center p-1 border rounded-md "
                        href={`tel:+${clientInfo.areaCode}${clientInfo?.phone}?`}
                      >
                        <PhoneForwardedIcon />
                      </a>
                    </li>
                    <li>Email: {clientInfo?.email}</li>
                  </ul>
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={(e) => setOpenClientModal(false)}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {column.id === "createdAt" && (
          <>
            <span className="text-sm">{value}</span>
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
              // className="border rounded-lg py-2 px-2 hover:bg-[#458552] min-w-24"
            >
              <Typography>
                <div className="flex justify-center items-start">
                  <span className="">
                    {`${
                      value.type === "Envío a domicilio" ? "Envío" : value.type
                    } | `}
                  </span>
                  <span className="">
                    {`     ${order.cart[0].details.availability}`}
                  </span>
                </div>
              </Typography>
            </Button>

            {/* MODAL FORMULARIO */}
            <Dialog open={placeModal} onClose={(e) => setPlaceModal(false)}>
              <DialogTitle className="text-center">
                Información del cliente
              </DialogTitle>
              <DialogContent dividers className="flex flex-col gap-8">
                <section className="flex flex-col justify-start items-start ">
                  <div>
                    <ul className="flex flex-col items-start justify-start gap-3">
                      <li className="text-[12px] text-start">
                        Distancia: {order.cart[0].distance.text}{" "}
                      </li>
                      <li className="text-[12px] text-start">
                        Disponibilidad: {order.cart[0].details.availability}
                      </li>
                      <li className="text-[12px] text-start">
                        Ciudad: {value.address.city}{" "}
                      </li>
                      <li className="text-[12px] text-start">
                        Localidad: {value.address.locality}
                      </li>
                      <li className="text-[12px] text-start">
                        Calle:
                        {` ${value.address.name} ${value.address.number}`}
                      </li>
                      <li className="text-[12px] text-start">
                        Piso/Casa: {value.address.floorOrApartment}{" "}
                      </li>
                      <li className="text-[12px] text-start">
                        C.P: {value.address.zipCode}{" "}
                      </li>
                    </ul>
                  </div>
                </section>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={(e) => setPlaceModal(false)}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </TableCell>
    </>
  );
}
