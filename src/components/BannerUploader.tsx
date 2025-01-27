/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import FileUpload from "./FileUpload";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  image: string | undefined | null;
  imageRef: any;
  removeImage: () => void;
}

const BannerUploader = ({ image, imageRef, removeImage }: Props) => {
  return (
    <div className="flex flex-col">
      <p className="label text-foreground">Cover image</p>
      <p className="sublabel text-muted-foreground">
        Optimal image size 1500 x 500
      </p>
      {!image ? (
        <FileUpload uploadRef={imageRef} type="banner" />
      ) : (
        <div className="flex flex-col">
          <div className="relative h-[300px] overflow-hidden rounded-xl">
            <Image src={image} objectFit="cover" alt="" fill />
          </div>
          <Button variant="outline" className="mt-4" onClick={removeImage}>
            Remove banner
          </Button>
        </div>
      )}
    </div>
  );
};

export default BannerUploader;
