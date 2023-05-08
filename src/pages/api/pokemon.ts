import client from "@/apis/client";
import { NamedAPIResourceList } from "@/types/pokemon";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const methodHandler: { [method: string]: Function } = {
    GET: async () => {
      let response;
      try {
        response = await client.get<NamedAPIResourceList>('https://pokeapi.co/api/v2/pokemon/?limit=10000');
        res.end(JSON.stringify(response.data))
      } catch (error) {
        res.status(500).json({message: "Can't get Pokemon list"});
      }
    },
  };

  if (req.method) {
    const action = methodHandler[req.method];
    if (!action) res.status(405).json({ message: "Method not allowed" });
    action();
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}