import * as t from "io-ts";

const mapCodec = (k: t.Mixed, v: t.Mixed) => t.array(t.tuple([k, v]));

const Link = t.type(
  {
    tour: t.string,
    stop: t.string,
  },
  "Link",
);

const Stop = t.type(
  {
    id: t.string,
    body: t.string,
    line: t.number,
    relPath: t.string,
    repository: t.string,
    title: t.string,
    children: t.array(Link),
  },
  "Stop",
);

const Tour = t.type(
  {
    id: t.string,
    title: t.string,
    body: t.string,
    stops: t.array(Stop),
    repositories: mapCodec(t.string, t.string),
  },
  "Tour",
);

const Index = t.type(
  {
    index: mapCodec(t.string, t.string),
  },
  "Index",
);

export type Tour = t.TypeOf<typeof Tour>;
export type Stop = t.TypeOf<typeof Stop>;
export type Link = t.TypeOf<typeof Link>;
export type Index = t.TypeOf<typeof Index>;

export type ParseError = { kind: "json" } | { kind: "logical"; type: string };

function makeParser(
  codec: any,
): (json: string) => t.TypeOf<typeof codec> | ParseError {
  return (json: string): t.TypeOf<typeof codec> | ParseError => {
    try {
      return codec
        .decode(JSON.parse(json))
        .mapLeft((_: t.Errors) => ({ kind: "logical", type: codec.name }))
        .value;
    } catch (_) {
      return { kind: "json" };
    }
  };
}

function makeSerializer(codec: any): (x: t.TypeOf<typeof codec>) => string {
  return (x: t.TypeOf<typeof codec>): string => {
    return JSON.stringify(codec.encode(x));
  };
}

export default {
  parseTour: makeParser(Tour) as (json: string) => Tour | ParseError,
  parseStop: makeParser(Stop) as (json: string) => Stop | ParseError,
  parseLink: makeParser(Link) as (json: string) => Link | ParseError,
  parseIndex: makeParser(Index) as (json: string) => Index | ParseError,
  serializeTour: makeSerializer(Tour) as (x: Tour) => string,
  serializeStop: makeSerializer(Stop) as (x: Stop) => string,
  serializeLink: makeSerializer(Link) as (x: Link) => string,
  serializeIndex: makeSerializer(Index) as (x: Index) => string,
};
