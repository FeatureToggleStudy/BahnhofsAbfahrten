import { OpenDataStation, Station } from 'types/station';
import axios from 'axios';

// https://developer.deutschebahn.com/store/apis/info?name=StaDa-Station_Data&version=v2&provider=DBOpenData
// istanbul ignore next
const authKey = `Bearer ${process.env.OPENDATA_AUTH_KEY || ''}`;

export default async (rawSearchTerm: string): Promise<Station[]> => {
  let searchTerm = rawSearchTerm;

  if (searchTerm.length === 2) {
    searchTerm = searchTerm[0];
  }

  const url = `https://api.deutschebahn.com/stada/v2/stations?searchstring=*${encodeURIComponent(
    searchTerm.replace(/ /g, '*')
  )}*`;

  const result = (await axios.get<{ result: OpenDataStation[] }>(url, {
    withCredentials: true,
    headers: {
      Authorization: authKey,
    },
  })).data;

  return result.result.map(s => ({
    title: s.name,
    favendoId: s.number,
    id: String(s.evaNumbers[0] ? s.evaNumbers[0].number : undefined),
    DS100: s.ril100Identifiers[0]
      ? s.ril100Identifiers[0].rilIdentifier
      : undefined,
    raw: global.PROD ? undefined : s,
  }));
};
