import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { YOUTUBE_URL } from "~/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const channelId = req.query.channelId as string;

    const videos = await axios
      .get<unknown>(YOUTUBE_URL(channelId), {
        headers: {
          Referer: req.headers.referer,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err instanceof Error) {
          console.log(err.message);

          throw new Error(err.message);
        }
      });

    res.status(200).json({ videos: videos });
  } catch (error) {
    console.log(error);
  }
}
