import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { Settings } from "../config";
import propTypes from "prop-types";
const STORAGE_URL = Settings.STORAGE_URL;
const STORAGE_QUERY = Settings.STORAGE_TOKEN_QUERY;

PDFRender.propTypes = {
  newFile: propTypes.string,
  setLoading: propTypes.func,
};

export default function PDFRender({ newFile, setLoading }) {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const handleLoadedDocument = () => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
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
            fileUrl={`${STORAGE_URL}${newFile}${STORAGE_QUERY}`}
          />
        </div>
      </div>
    </div>
  );
}
