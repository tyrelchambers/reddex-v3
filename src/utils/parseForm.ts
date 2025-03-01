import type { NextApiRequest } from "next";
import path from "path";
import formidable from "formidable";
import { readFile } from "fs/promises";
import { rmSync } from "fs";
import axios from "axios";
import {
  BANNER_UPLOAD_URL,
  PULL_ZONE,
  THUMBNAIL_UPLOAD_URL,
} from "~/url.constants";
import { env } from "~/env";
import queryString from "node:querystring";

export const parseForm = async (
  req: NextApiRequest,
): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    const uploadDir = path.resolve(
      __dirname,
      "../",
      "../",
      "../",
      "../",
      "uploads",
    );
    const uploadType = req.headers["upload-type"];

    const form = formidable({
      multiples: false,
      maxFiles: 1,
      maxFileSize: 2 * 1024 * 1024,
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}-${
          part.originalFilename || "unknown"
        }`;

        return filename;
      },
      filter: (part) => {
        return (
          part.name === "filepond" &&
          (part.mimetype?.includes("image") || false)
        );
      },
    });

    form.parse(req, async function (err, fields, files) {
      if (err) {
        if (err instanceof Error) {
          reject(err);
        } else {
          reject(Error("Something went wrong"));
        }
      }

      try {
        if (Array.isArray(files.filepond)) {
          if (files.filepond[0]) {
            const newFilename = `${uploadDir}/${files.filepond[0].newFilename}`;
            const saveFile = await readFile(newFilename);

            const imageProcessingOptionsBanner = queryString.stringify({
              crop: `1500,500`,
              crop_gravity: "center",
            });

            const imageProcessingOptionsThumbnail = queryString.stringify({
              width: "200",
              height: "200",
              aspect_ratio: "1:1",
              crop_gravity: "center",
            });

            const processingOptions =
              uploadType === "thumbnail"
                ? imageProcessingOptionsThumbnail
                : imageProcessingOptionsBanner;

            const folder = uploadType === "thumbnail" ? "thumbnail" : "banner";

            await axios
              .put(
                uploadType === "thumbnail"
                  ? THUMBNAIL_UPLOAD_URL(files.filepond[0].newFilename)
                  : BANNER_UPLOAD_URL(files.filepond[0].newFilename),
                saveFile,
                {
                  headers: {
                    "content-type": "application/octet-stream",
                    AccessKey: env.BUNNY_PASSWORD,
                  },
                },
              )
              .then(() => {
                rmSync(newFilename, { recursive: true });
              })
              .catch((error) => {
                console.log(error);
              });

            resolve({
              url: `${PULL_ZONE}/${folder}/${files.filepond[0].newFilename}?${processingOptions}`,
            });
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          reject(error);
        }
      }
    });
  });
};
