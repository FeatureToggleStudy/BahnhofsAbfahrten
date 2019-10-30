import { Crd, LocL, ParsedProduct } from 'types/HAFAS';

function parseCoordinates(crd: Crd) {
  return {
    lng: crd.x / 1000000,
    lat: crd.y / 1000000,
  };
}

export default (locL: LocL, products: ParsedProduct[]) => ({
  id: locL.extId,
  title: `${locL.name}`,
  coordinates: locL.crd && parseCoordinates(locL.crd),
  products: locL.pRefL && locL.pRefL.map(p => products[p]),
  raw: global.PROD ? undefined : locL,
});
