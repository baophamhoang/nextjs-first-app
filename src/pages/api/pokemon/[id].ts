import client from "@/apis/client";
import { NamedAPIResourceList, Pokemon } from "@/types/pokemon";
import { createRedisClient } from "@/utils/redis";
import axios from "axios";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.end([]);
    return;
  }

  // cached full name list and reuse
  let cachedNamedList: {[key: string]: string};

  try {
    const redisClient = await createRedisClient();
    cachedNamedList = await redisClient.hGetAll('cachedNamedList');
    if (_.isEmpty(cachedNamedList)) {
      try {
        const namedListResponse = await client.get<NamedAPIResourceList>(
          "https://pokeapi.co/api/v2/pokemon/?limit=10000"
        );
        const formattedResponse = namedListResponse.data.results.map(obj => Object.values(obj));
        for (const [key, value] of formattedResponse) {
          await redisClient.hSet('cachedNamedList', key, value);
        }
        cachedNamedList = await redisClient.hGetAll('cachedNamedList');
      } catch (e) {
        res.status(500).json({ message: "Can't get Pokemon list" });
      }
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
  
  // try {
  //   namedList = await redisClient.hGetAll('cachedNamedList');
  //   if (_.isEmpty(namedList)) {
  //     try {
  //       const namedListResponse = await client.get<NamedAPIResourceList>(
  //         "https://pokeapi.co/api/v2/pokemon/?limit=200"
  //       );
  //       namedList = namedListResponse;
  //       const formattedResponse = namedListResponse.data.results.map(obj => Object.values(obj));
  //       for (const [key, value] of formattedResponse) {
  //         console.log('[key, value] :>> ', [key, value]);
  //         await redisClient.hSet('cachedNamedList', key, value);
  //       }
  //     } catch (e) {
  //       res.status(500).json({ message: "Can't get Pokemon list" });
  //     }
  //   }
  // } catch (e) {
  //   res.status(500).json({ message: "Redis Client got error" });
  // }

  let response;
  const methodHandler: { [method: string]: Function } = {
    GET: async () => {
      try {
        response = Object.entries(cachedNamedList).filter((e) => {
          const url = e[1].split("/");
          const isIdIncluded = (url.pop() || url.pop())?.includes(id);
          const isNameIncluded = e[0].includes(id);
          return isIdIncluded || isNameIncluded;
        });
        try {
          const responseList = await Promise.all(
            response.map((r) => axios.get<Pokemon>(r[1]))
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
