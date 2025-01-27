/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import FileUpload from "./FileUpload";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  thumbnail: string | undefined | null;
  thumbnailRef: any;
  removeImage: () => void;
}

const ThumbnailUploader = ({ thumbnail, thumbnailRef, removeImage }: Props) => {
  return (
    <div className="flex flex-col">
      <p className="label text-foreground">Thumbnail</p>
      <p className="sublabel text-muted-foreground">
        Optimal image size 200 x 200
      </p>
      {!thumbnail ? (
        <FileUpload uploadRef={thumbnailRef} type="thumbnail" />
      ) : (
        <div className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <Image src={thumbnail} alt="" fill className="object-cover" />
          </div>
          <Button variant="outline" className="mt-4" onClick={removeImage}>
            Remove thumbnail
          </Button>
        </div>
      )}
    </div>
  );
};

export default ThumbnailUploader;
