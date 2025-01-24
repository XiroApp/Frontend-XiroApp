import { Box, Tooltip } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AddressCard({ address, handleClickOpen, handleClickDeleteAddress }) {
  return (
    <>
      {/* CARD */}
      <Box
        component="span"
        sx={{ p: 1, borderRadius: "25px", padding: "1em" }}
        className="h-40 w-44 md:w-56 md:h-56 lg:h-56 lg:w-56 flex flex-col items-center justify-center  bg-[#fff]"
      >
        <div className="relative flex flex-col items-center justify-center w-full h-full   text-black">
          <div className="absolute top-0 right-0 flex gap-2">
            <Tooltip title="Editar" placement="top" arrow>
              <EditIcon
                onClick={() => handleClickOpen(address)} // Enviar dirección al abrir el formulario
                color="action"
                sx={{ height: "1em", width: "1em" }}
                className="hover:bg-[#c9d9bb] rounded-lg"
              />
            </Tooltip>
            <Tooltip title="Eliminar" placement="top" arrow>
              <DeleteIcon
                onClick={()=>handleClickDeleteAddress(address)}
                color="action"
                sx={{ height: "1em", width: "1em" }}
                className="hover:bg-[#c9d9bb] rounded-lg"
              />
            </Tooltip>
          </div>

          <div className="absolute bottom-0 flex flex-col justify-start gap-3 w-full items-start text-black">
            <PlaceIcon
              color="primary"
              sx={{ height: "1.3em", width: "1.3em" }}
            />
            <div className="flex flex-col items-start">
              <span className="text-sm">
                {address?.name?.length < 15
                  ? address.name
                  : `${address.name.slice(0, 15)}...`}{" "}
                {address.number}
              </span>
              <span className="text-sm opacity-60">{address.tag}</span>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
