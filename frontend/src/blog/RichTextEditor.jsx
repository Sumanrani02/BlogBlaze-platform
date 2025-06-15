import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing your amazing blog post here...",
  readOnly = false,
  theme = "snow",
}) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],

        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],

        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "clean",
  ];

  return (
    <div className="relative font-inter">
      <ReactQuill
        theme={theme}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        className="bg-white rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-blue-light focus-within:border-blue-light"
      />
      {readOnly && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg cursor-not-allowed">
          <span className="text-blue-darker text-lg font-semibold">
            Read Only
          </span>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
