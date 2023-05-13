import { NextApiRequest, NextApiResponse } from "next";
import { parseForm } from "~/utils/parseForm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = await parseForm(req);

  res.status(200).send(url);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
