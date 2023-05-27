import client from "@/apis/client";
import { NamedAPIResourceList, Pokemon } from "@/types/pokemon";
import axios from "axios";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.end([]);
    return;
  }

  // cached full name list and reuse
  redisClient.on('error', err => console.log('Redis Client Error', err));
  // await redisClient.connect();

  let namedList;
  try {
    namedList = await redisClient.hGetAll('cachedNamedList');
    console.log('namedList :>> ', namedList);
    console.log('nameList :>> ', JSON.stringify(namedList));
    if (_.isEmpty(namedList)) {
      try {
        const namedListResponse = await client.get<NamedAPIResourceList>(
          "https://pokeapi.co/api/v2/pokemon/?limit=200"
        );
        namedList = namedListResponse;
        const formattedResponse = namedListResponse.data.results.map(obj => Object.values(obj));
        for (const [key, value] of formattedResponse) {
          console.log('[key, value] :>> ', [key, value]);
          await redisClient.hSet('cachedNamedList', key, value);
        }
      } catch (e) {
        res.status(500).json({ message: "Can't get Pokemon list" });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Redis Client got error" });
  }

  let response;
  const methodHandler: { [method: string]: Function } = {
    GET: async () => {
      try {
        const apiResponse = await client.get<NamedAPIResourceList>(
          "https://pokeapi.co/api/v2/pokemon/?limit=200"
        );
        response = apiResponse.data.results.filter((item) => {
          const url = item.url.split("/");
          const isIdIncluded = (url.pop() || url.pop())?.includes(id);
          const isNameIncluded = item.name.includes(id);
          return isIdIncluded || isNameIncluded;
        });
        try {
          const responseList = await Promise.all(
            response.map((r) => axios.get<Pokemon>(r.url))
          );
          const dataList = responseList.map((r) => ({
            id: r.data.id,
            name: r.data.name,
            imgUrl: r.data.sprites.front_default,
          }));
          res.end(JSON.stringify(dataList));
        } catch (e) {
          res.status(500).json({ message: "Can't get Pokemon list" });
        }
      } catch (error) {
        res.status(500).json({ message: "Can't get Pokemon list" });
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
