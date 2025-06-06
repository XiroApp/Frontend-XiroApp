import React from "react";
import { Box, Button, Modal } from "@mui/material";
import helpJson from "./helpText.json";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "#61774d",
  borderRadius: "8px",
  boxShadow: 24,
};

export default function NewOrderSettingsHelp({
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
        <section className=" p-4 flex justify-between">
          <h2
            id="parent-modal-title"
            className="text-start text-white text-[20px] font-[300] "
          >
            {renderHelp.title}
          </h2>

          <Button
            variant="text"
            color="white"
            className="text-md text-white"
            onClick={() => setHelpModal(false)}
          >
            X
          </Button>
        </section>
        <section className="flex flex-col items-center px-5 pb-8 gap-5">
          {renderHelp?.content?.map((content, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 w-11/12 bg-[#fff] p-4 rounded-lg"
            >
              <span className="text-[14px]">{content?.title}</span>
              <span className="opacity-70 text-[14px]">
                {content?.subtitle}
              </span>
              <span className="text-[12px]">{content?.text}</span>
            </div>
          ))}
        </section>
      </Box>
    </Modal>
  );
}
