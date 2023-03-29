import React from "react";
import ReactQuill from "react-quill";

export default function ContentEditor({ value, onChange, phText }) {
  // value: content
  // onChange: setContent
  // phText: placeholder text (for update)

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const containerStyle = {
    maxHeight: "300px", // set your preferred max height here
    overflowY: "scroll",
  };

  return (
    <div style={containerStyle}>
      <ReactQuill
        value={value}
        theme={"snow"}
        onChange={onChange}
        modules={modules}
        placeholder={phText}
      />
    </div>
  );
}
