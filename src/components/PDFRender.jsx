import React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

export default function PDFRender({ newFile, setLoading }) {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const handleLoadedDocument = () => {
    setLoading(false);
  };
  return (
    <div className="w-full h-full rounded-lg bg-white p-2">
      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#eeeeee",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            display: "flex",
            justifyContent: "center",
            padding: "8px",
          }}
        ></div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Viewer
            initialPage={0}
            onDocumentLoad={handleLoadedDocument}
            // defaultScale={1}
            // viewMode={ViewMode.DualPage}
            theme={{
              theme: "light",
              // direction: TextDirection.RightToLeft,
            }}
            plugins={[pageNavigationPluginInstance]}
            fileUrl={`https://firebasestorage.googleapis.com/v0/b/xiro-app-2ec87.firebasestorage.app/o/${newFile}?alt=media&token=e7b0f280-413a-4546-aa2b-da0cd3523289`}
          />
        </div>
      </div>
    </div>
  );
}
