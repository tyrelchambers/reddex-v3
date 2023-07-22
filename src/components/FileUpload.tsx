import React, { Ref } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageResize from "filepond-plugin-image-resize";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageResize
);

interface Props {
  type: "thumbnail" | "banner";
  uploadRef: Ref<FilePond>;
  disabled?: boolean;
}

const FileUpload = ({ type, uploadRef, disabled }: Props) => {
  const resizeTo = {
    banner: {
      height: 200,
      width: 200,
    },
    thumbnail: {
      height: 500,
      width: 1500,
    },
  };

  return (
    <FilePond
      ref={uploadRef}
      allowMultiple={false}
      maxFiles={1}
      server={{
        url: "/api/upload",
        headers: {
          "upload-type": type,
        },
      }}
      imageResizeTargetHeight={resizeTo[type].height}
      imageResizeTargetWidth={resizeTo[type].width}
      instantUpload={false}
      allowProcess={false}
      disabled={disabled}
    />
  );
};

export default FileUpload;
