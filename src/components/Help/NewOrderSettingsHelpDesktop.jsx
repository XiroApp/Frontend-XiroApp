import React from "react";
import { Box, Modal } from "@mui/material";
import helpJson from "./helpText.json";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "#121212",
  borderRadius: "8px",
  boxShadow: 24,
};
export default function NewOrderSettingsHelpDesktop({
  currentSetting,
  setHelpModal,
  helpModal,
}) {
  const renderHelp = helpJson.find((help) => help.setting === currentSetting);

  return (
    <Modal
      open={helpModal}
      onClose={() => setHelpModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="md:w-1/3 md:ml-96"
    >
      <Box sx={{ ...style }}>
        <section className=" p-4 ">
          <h2
            id="parent-modal-title"
            className="text-start text-[20px] font-[300] "
          >
            {renderHelp?.title}
          </h2>
        </section>
        <section className="flex flex-col items-center px-5 pb-8 gap-5">
          {renderHelp?.content.map((content, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 w-11/12 bg-[#1e1e1e] p-4 rounded-lg"
            >
              <span className="text-[14px]">{content.title}</span>
              <span className="opacity-70 text-[14px]">{content.subtitle}</span>
              <span className="text-[12px]">{content.text}</span>
            </div>
          ))}
        </section>
      </Box>
    </Modal>
  );
}
