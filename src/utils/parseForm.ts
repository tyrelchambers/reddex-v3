import type { NextApiRequest } from "next";
import mime from "mime";
import { join } from "path";
import * as dateFn from "date-fns";
import formidable from "formidable";
import { mkdir, readFile, stat } from "fs/promises";
import { rmdirSync } from "fs";
import axios from "axios";
import {
  BANNER_UPLOAD_URL,
  PULL_ZONE,
  THUMBNAIL_UPLOAD_URL,
} from "~/url.constants";
import { env } from "~/env.mjs";
import queryString from "query-string";

export const parseForm = async (
  req: NextApiRequest
): Promise<{ url: string }> => {
  return new Promise(async (resolve, reject) => {
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/uploads/${dateFn.format(Date.now(), "dd-MM-Y")}`
    );
    const uploadType = req.headers["upload-type"];

    try {
      await stat(uploadDir);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if ("code" in e && e.code === "ENOENT") {
          await mkdir(uploadDir, { recursive: true });
        } else {
          console.error(e);
          reject(e);
          return;
        }
      }
    }

    const form = formidable({
      multiples: false,
      maxFiles: 1,
      maxFileSize: 2 * 1024 * 1024,
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
          mime.extension(part.mimetype || "") || "unknown"
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
      try {
        if (Array.isArray(files.filepond)) {
          if (files.filepond[0]) {
            const saveFile = await readFile(
              `${uploadDir}/${files.filepond[0].newFilename}`
            );

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
                }
              )
              .then(() => {
                rmdirSync(uploadDir, { recursive: true });
              });

            resolve({
              url: `${PULL_ZONE}/${folder}/${files.filepond[0].newFilename}?${processingOptions}`,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};
