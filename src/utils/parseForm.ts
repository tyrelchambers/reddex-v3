import type { NextApiRequest } from "next";
import mime from "mime";
import { join } from "path";
import * as dateFn from "date-fns";
import formidable from "formidable";
import { mkdir, readFile, stat } from "fs/promises";
import { rmdir, rmdirSync } from "fs";
import axios from "axios";
import {
  BANNER_UPLOAD_URL,
  PULL_ZONE,
  THUMBNAIL_UPLOAD_URL,
} from "~/url.constants";
import { env } from "~/env.mjs";

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
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
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
          mime.getExtension(part.mimetype || "") || "unknown"
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
        if (files.filepond) {
          const saveFile = await readFile(
            `${uploadDir}/${files.filepond[0].newFilename}`
          );

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
            })
            .catch((err) => {
              if (err) {
                throw new Error(err);
              }
            });

          resolve({
            url: `${PULL_ZONE}/thumbnails/${files.filepond[0].newFilename}`,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};
