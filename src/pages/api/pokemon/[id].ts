import client from "@/apis/client";
import { NamedAPIResourceList } from "@/types/pokemon";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.end([]);
    return;
  }
  let response;
  const methodHandler: { [method: string]: Function } = {
    GET: async () => {
      try {
        const apiResponse = await client.get<NamedAPIResourceList>('https://pokeapi.co/api/v2/pokemon');
        response = apiResponse.data.results.filter(item => item.name.includes(id));
        res.end(JSON.stringify(response))
        // res.status(200).json({message: id});
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