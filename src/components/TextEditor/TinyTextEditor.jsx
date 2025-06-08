// function TinyTextEditor() {
//   return (
//     <div className="w-full text-2xl text-center py-4">En construcción...</div>
//   );
// }

// export default TinyTextEditor;

import { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import propTypes from "prop-types";

TinyTextEditor.propTypes = {
  setValue: propTypes.func,
  initialValue: propTypes.string,
  disabled: propTypes.bool,
};

export default function TinyTextEditor({
  setValue,
  initialValue,
  disabled = false,
}) {
  const editorRef = useRef(null);

  // Asegurar que initialValue siempre sea una cadena
  const safeInitialValue = typeof initialValue === "string" ? initialValue : "";

  // Función para actualizar el contenido cuando cambia
  const handleEditorChange = () => {
    if (editorRef.current) {
      setValue(editorRef.current.getContent());
    }
  };

  // Actualizar el contenido del editor cuando cambia initialValue
  useEffect(() => {
    if (editorRef.current && safeInitialValue) {
      editorRef.current.setContent(safeInitialValue);
    }
  }, [safeInitialValue]);

  return (
    <div className="w-full h-full">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        disabled={disabled}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          // Asegurarse de que el editor tenga el contenido inicial correcto
          if (safeInitialValue) {
            editor.setContent(safeInitialValue);
          }
        }}
        initialValue={safeInitialValue}
        init={{
          // height: 800,
          menubar: false,
          plugins: [
            "preview",
            "importcss",
            "searchreplace",
            "autolink",
            "autosave",
            "save",
            "directionality",
            "code",
            "visualblocks",
            "visualchars",
            "fullscreen",
            "image",
            "link",
            "media",
            "codesample",
            "table",
            "charmap",
            "pagebreak",
            "nonbreaking",
            "anchor",
            "insertdatetime",
            "advlist",
            "lists",
            "wordcount",
            "help",
            "charmap",
            "quickbars",
            "emoticons",
            "accordion",
          ],
          toolbar:
            "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onChange={handleEditorChange}
      />
    </div>
  );
}
