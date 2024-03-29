import client from '@/apis/client';
import { MAX_DEX_NO } from '@/configs/constants';
import { NamedAPIResourceList, Pokemon } from '@/types/pokemon';
import { createRedisClient } from '@/utils/redis';
import axios from 'axios';
import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;
  if (!search || Array.isArray(search)) {
    res.end([]);
    return;
  }

  // default page 0
  const page = req.query.page ? +req.query.page || 0 : 0;
  // default page limit 30
  const pageLimit = req.query.pageLimit ? +req.query.pageLimit || 30 : 30;
  // default asc sorting
  const sort = req.query.sort || 'asc';

  // cached full name list and reuse
  let cachedNamedList: { [key: string]: string };

  try {
    const redisClient = await createRedisClient();
    cachedNamedList = await redisClient.hGetAll('cachedNamedList');
    if (_.isEmpty(cachedNamedList)) {
      try {
        const namedListResponse = await client.get<NamedAPIResourceList>('https://pokeapi.co/api/v2/pokemon/?limit=' + MAX_DEX_NO);
        const formattedResponse = namedListResponse.data.results.map((obj) => Object.values(obj));
        let orderId = 1;
        for (const [key, value] of formattedResponse) {
          orderId++;
          await redisClient.hSet('cachedNamedList', `${orderId}_${key}`, value);
        }
        cachedNamedList = await redisClient.hGetAll('cachedNamedList');
      } catch (e) {
        res.status(500).json({ message: "Can't get Pokemon list" });
      }
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    res.status(500).json({
      message: "Can't get Pokemon list",
      error: 'Failed to connect to Redis:' + error,
    });
  }

  let response;
  const methodHandler: { [method: string]: Function } = {
    GET: async () => {
      try {
        response = Object.entries(cachedNamedList)
          // TODO: refactor
          // Find a better way instead of sorting on every requests
          // Cached on a singleton service could be a way but it's gonna consume RAM
          .sort((a, b) => {
            const aOrderId = Number(a[0].split('_')[0]) ?? 0;
            const bOrderId = Number(b[0].split('_')[0]) ?? 0;
            if (sort === 'desc') {
              return aOrderId > bOrderId ? -1 : 1;
            } else {
              return aOrderId > bOrderId ? 1 : -1;
            } 
          })
          .filter((e) => {
            const url = e[1].split('/');
            const isIdIncluded = (url.pop() || url.pop())?.includes(search);
            const isNameIncluded = e[0].includes(search.toLowerCase());
            return isIdIncluded || isNameIncluded;
          })
          .slice(page * pageLimit, (page + 1) * pageLimit);
        try {
          const responseList = await Promise.all(
            response.map((r) => {
              const apiRes = axios.get<Pokemon>(r[1]);
              return apiRes;
            }),
          );

          const dataList = responseList.map((r) => ({
            id: r.data.id,
            name: r.data.name,
            imgUrl: r.data.sprites.front_default,
          }));
          res.end(JSON.stringify({ data: dataList, nextCursor: page + 1 }));
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
    if (!action) res.status(405).json({ message: 'Method not allowed' });
    action();
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
