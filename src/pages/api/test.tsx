import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

type ApiResponse<T> = {
  message?: string,
  data?: T
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Data>>
) {
  const methodHandler: { [method: string]: Function } = {
    GET: () => {
      res.status(200).json({ data: { name: "John Doe" } });
    },
    POST: () => {
      res.status(200).json({ message: "Posted succesfully." });
    },
  };

  if (req.method) {
    const action = methodHandler[req.method];
    if (!action) res.status(404).json({ message: "Invalid method." });
    action();
  } else {
    res.status(404).json({ message: "Invalid method." });
  }
}
