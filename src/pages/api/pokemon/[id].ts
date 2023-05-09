import client from "@/apis/client";
import { NamedAPIResourceList, Pokemon } from "@/types/pokemon";
import axios from "axios";
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
        const apiResponse = await client.get<NamedAPIResourceList>('https://pokeapi.co/api/v2/pokemon/?limit=200');
        response = apiResponse.data.results.filter(item => {
          const url = item.url.split('/');
          const isIdIncluded = (url.pop() || url.pop())?.includes(id);
          const isNameIncluded = item.name.includes(id);
          return isIdIncluded || isNameIncluded;
        });
        try {
          const responseList = await Promise.all(response.map(r => axios.get<Pokemon>(r.url)));
          const dataList = responseList.map((r) => ({
            id: r.data.id,
            name: r.data.name,
            imgUrl: r.data.sprites.front_default
          }));
          res.end(JSON.stringify(dataList))
        } catch (e) {
          res.status(500).json({message: "Can't get Pokemon list"});
        }
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