import { Button } from "@mui/material";

export default function JsonToExcelConverter({
  text = "Descargar Excel",
  icon,
  action,
}) {
  const exportFile = async () => {
    await action();
  };

  return (
    // <Tooltip content={tooltipText}>
    <Button onClick={exportFile} variant="contained" color="primary">
      {icon}
      {/* {text} */}
      Descargar Excel
    </Button>
    // </Tooltip>
  );
}
