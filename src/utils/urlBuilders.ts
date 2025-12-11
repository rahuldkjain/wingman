import { format } from "date-fns";
import type { Airport } from "../data/airports";

export interface SearchRequest {
  origin: Airport;
  destination: Airport;
  departDate: Date;
  returnDate?: Date;
  tripType: "oneway" | "roundtrip";
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: "economy" | "business" | "first";
  nonStop: boolean;
}

export type UrlBuilder = (req: SearchRequest) => string;

const formatDate = (date: Date, pattern: string) => format(date, pattern);

export const buildWegoUrl: UrlBuilder = (req) => {
  const originCode = `c${req.origin.code.toLowerCase()}`;
  const destCode = `c${req.destination.code.toLowerCase()}`;
  const departStr = formatDate(req.departDate, "yyyy-MM-dd");

  let routePart = `${originCode}-${destCode}-${departStr}`;
  if (req.tripType === "roundtrip" && req.returnDate) {
    const returnStr = formatDate(req.returnDate, "yyyy-MM-dd");
    routePart += `:${destCode}-${originCode}-${returnStr}`;
  }

  const cabin =
    req.cabinClass === "business"
      ? "business"
      : req.cabinClass === "first"
      ? "first"
      : "economy";
  const pax = `${req.passengers.adults}a:${req.passengers.children}c:${req.passengers.infants}i`;

  const query = new URLSearchParams();
  if (req.nonStop) query.append("direct_only", "true");
  query.append("sort", "score");
  query.append("order", "desc");

  return `https://www.wego.co.in/flights/searches/${routePart}/${cabin}/${pax}?${query.toString()}`;
};

export const buildSkyscannerUrl: UrlBuilder = (req) => {
  const origin = req.origin.code.toLowerCase();
  const dest = req.destination.code.toLowerCase();
  const depart = formatDate(req.departDate, "yyMMdd");
  const ret =
    req.tripType === "roundtrip" && req.returnDate
      ? formatDate(req.returnDate, "yyMMdd")
      : "";

  const path = `transport/flights/${origin}/${dest}/${depart}/${ret}`;

  const query = new URLSearchParams();
  // Correct parameter for adults is 'adultsv2', 'adults' is likely ignored or legacy.
  // Some sources suggest 'adultsv2' is the standard now.
  // However, if 1 adult is default, adding 'adults=1' explicitly might be safer if v2 fails,
  // but let's stick to what was working partially and fix the children issue.
  // The issue reported: "It is adding 1 adult and 1 children".
  // This happens if 'childrenv2' is present even with value 0, or if 'children' param is used incorrectly.
  // skyscanner uses childrenv2=age|age|...

  query.append("adultsv2", req.passengers.adults.toString());

  if (req.passengers.children > 0) {
    // We don't have ages, defaulting to 12 for now as a safe bet or just repeating a dummy age
    // Better approach: skip if 0.
    // If we must provide ages, we'd need input. For now, let's not append if 0.
    const childAges = Array(req.passengers.children).fill(12).join("|");
    query.append("childrenv2", childAges);
  }

  if (req.passengers.infants > 0) {
    query.append("infants", req.passengers.infants.toString());
  }

  query.append("cabinclass", req.cabinClass);
  query.append("ref", "home");
  query.append("rtn", req.tripType === "roundtrip" ? "1" : "0");
  if (req.nonStop) query.append("preferdirects", "true");
  query.append("outboundaltsenabled", "false");
  query.append("inboundaltsenabled", "false");

  return `https://www.skyscanner.co.in/${path}/?${query.toString()}`;
};

export const buildKayakUrl: UrlBuilder = (req) => {
  const origin = req.origin.code.toUpperCase();
  const dest = req.destination.code.toUpperCase();
  const depart = formatDate(req.departDate, "yyyy-MM-dd");
  const ret =
    req.tripType === "roundtrip" && req.returnDate
      ? `/${formatDate(req.returnDate, "yyyy-MM-dd")}`
      : "";

  let query = "";
  if (req.nonStop) {
    query = "?fs=fdDir%3Dtrue";
  }

  return `https://www.kayak.co.in/flights/${origin}-${dest}/${depart}${ret}${query}`;
};

export const buildGoogleFlightsUrl: UrlBuilder = (req) => {
  const origin = req.origin.code;
  const dest = req.destination.code;
  const depart = formatDate(req.departDate, "yyyy-MM-dd");

  // Use the plain language query format which is more reliable for Google Flights
  // Format: "Flights to [Dest] from [Origin] on [Date] [TripType]"
  let q = `Flights to ${dest} from ${origin} on ${depart}`;

  if (req.tripType === "oneway") {
    q += ` oneway`;
  } else if (req.tripType === "roundtrip" && req.returnDate) {
    const ret = formatDate(req.returnDate, "yyyy-MM-dd");
    q += ` returning ${ret}`;
  }

  if (req.cabinClass !== "economy") {
    q += ` ${req.cabinClass} class`;
  }

  // Passenger handling for query string
  // "with 2 adults" or "with 1 adult 2 children"
  const parts = [];
  if (req.passengers.adults > 0)
    parts.push(
      `${req.passengers.adults} adult${req.passengers.adults > 1 ? "s" : ""}`
    );
  if (req.passengers.children > 0)
    parts.push(
      `${req.passengers.children} child${
        req.passengers.children > 1 ? "ren" : ""
      }`
    );
  if (req.passengers.infants > 0)
    parts.push(
      `${req.passengers.infants} infant${req.passengers.infants > 1 ? "s" : ""}`
    );

  if (parts.length > 0) {
    q += ` with ${parts.join(" ")}`;
  }

  const params = new URLSearchParams();
  params.append("q", q);
  params.append("curr", "INR"); // Assuming INR based on context, or can be dynamic

  return `https://www.google.com/travel/flights?${params.toString()}`;
};

export const buildIxigoUrl: UrlBuilder = (req) => {
  const params = new URLSearchParams();
  params.append("from", req.origin.code);
  params.append("to", req.destination.code);
  params.append("date", formatDate(req.departDate, "ddMMyyyy"));
  if (req.tripType === "roundtrip" && req.returnDate) {
    params.append("returnDate", formatDate(req.returnDate, "ddMMyyyy"));
  }
  params.append("adults", req.passengers.adults.toString());
  params.append("children", req.passengers.children.toString());
  params.append("infants", req.passengers.infants.toString());
  params.append(
    "class",
    req.cabinClass === "economy"
      ? "e"
      : req.cabinClass === "business"
      ? "b"
      : "e"
  );
  if (req.nonStop) params.append("stops", "0");

  return `https://www.ixigo.com/search/result/flight?${params.toString()}`;
};

export const buildCleartripUrl: UrlBuilder = (req) => {
  const params = new URLSearchParams();
  params.append("adults", req.passengers.adults.toString());
  params.append("childs", req.passengers.children.toString());
  params.append("infants", req.passengers.infants.toString());
  params.append("class", req.cabinClass === "economy" ? "Economy" : "Business");
  params.append("depart_date", formatDate(req.departDate, "dd/MM/yyyy"));
  params.append("from", req.origin.code);
  params.append("to", req.destination.code);
  if (req.tripType === "roundtrip" && req.returnDate) {
    params.append("return_date", formatDate(req.returnDate, "dd/MM/yyyy"));
  }
  params.append("intl", "n");
  if (req.origin.country !== "India" || req.destination.country !== "India") {
    params.append("intl", "y");
  }

  return `https://www.cleartrip.com/flights/results?${params.toString()}`;
};

export const buildGoibiboUrl: UrlBuilder = (req) => {
  const origin = req.origin.code;
  const dest = req.destination.code;
  const depart = formatDate(req.departDate, "dd/MM/yyyy");

  let itinerary = `${origin}-${dest}-${depart}`;
  let tripType = "O";
  if (req.tripType === "roundtrip" && req.returnDate) {
    const ret = formatDate(req.returnDate, "dd/MM/yyyy");
    itinerary += `_${dest}-${origin}-${ret}`;
    tripType = "R";
  }

  const params = new URLSearchParams();
  params.append("itinerary", itinerary);
  params.append("tripType", tripType);
  params.append(
    "paxType",
    `A-${req.passengers.adults}_C-${req.passengers.children}_I-${req.passengers.infants}`
  );
  params.append("intl", "false");
  params.append("cabinClass", req.cabinClass === "economy" ? "E" : "B");

  return `https://www.goibibo.com/flight/search?${params.toString()}`;
};

export const buildMakeMyTripUrl: UrlBuilder = (req) => {
  const origin = req.origin.code;
  const dest = req.destination.code;
  const depart = formatDate(req.departDate, "dd/MM/yyyy");

  let itinerary = `${origin}-${dest}-${depart}`;
  let tripType = "O";
  if (req.tripType === "roundtrip" && req.returnDate) {
    const ret = formatDate(req.returnDate, "dd/MM/yyyy");
    itinerary += `_${dest}-${origin}-${ret}`;
    tripType = "R";
  }

  const params = new URLSearchParams();
  params.append("itinerary", itinerary);
  params.append("tripType", tripType);
  params.append(
    "paxType",
    `A-${req.passengers.adults}_C-${req.passengers.children}_I-${req.passengers.infants}`
  );
  params.append("intl", "false");
  params.append("cabinClass", req.cabinClass === "economy" ? "E" : "B");

  return `https://www.makemytrip.com/flight/search?${params.toString()}`;
};

export const buildEaseMyTripUrl: UrlBuilder = (req) => {
  // Format: https://www.easemytrip.com/flights.html with params?
  // Or use the search url structure: https://flight.easemytrip.com/FlightList/Index?srch=BLR-Bangalore-India|DEL-Delhi-India|18/12/2025&px=1-0-0&cbn=0&ar=undefined&isow=true&isdm=true&lang=en-us

  // NOTE: EaseMyTrip seems to use different endpoints for OneWay vs RoundTrip.
  // OneWay: /FlightList/Index
  // RoundTrip: /FlightListRT/Index

  const originStr = `${req.origin.code}-${req.origin.city}-${req.origin.country}`;
  const destStr = `${req.destination.code}-${req.destination.city}-${req.destination.country}`;
  const depart = formatDate(req.departDate, "dd/MM/yyyy");

  let endpoint = "FlightList/Index";
  let srch = `${originStr}|${destStr}|${depart}`;

  if (req.tripType === "roundtrip" && req.returnDate) {
    endpoint = "FlightListRT/Index";
    srch += `-${formatDate(req.returnDate, "dd/MM/yyyy")}`;
  }

  const params = new URLSearchParams();
  params.append("srch", srch);
  params.append(
    "px",
    `${req.passengers.adults}-${req.passengers.children}-${req.passengers.infants}`
  );
  params.append("cbn", "0"); // Cabin class? 0=Economy?
  params.append("ar", "undefined");
  params.append("isow", req.tripType === "oneway" ? "true" : "false");
  params.append("isdm", "true"); // Domestic?
  params.append("lang", "en-us");

  return `https://flight.easemytrip.com/${endpoint}?${params.toString()}`;
};

export const buildYatraUrl: UrlBuilder = (req) => {
  const params = new URLSearchParams();
  params.append("origin", req.origin.code);
  params.append("originCountry", req.origin.country === "India" ? "IN" : "XX");
  params.append("destination", req.destination.code);
  params.append(
    "destinationCountry",
    req.destination.country === "India" ? "IN" : "XX"
  );
  params.append("flight_depart_date", formatDate(req.departDate, "dd/MM/yyyy"));
  if (req.tripType === "roundtrip" && req.returnDate) {
    params.append("arrivalDate", formatDate(req.returnDate, "dd/MM/yyyy"));
  }
  params.append("type", req.tripType === "roundtrip" ? "R" : "O");
  params.append("class", "Economy");
  params.append("ADT", req.passengers.adults.toString());
  params.append("CHD", req.passengers.children.toString());
  params.append("INF", req.passengers.infants.toString());
  params.append("viewName", "normal");
  params.append("source", "fresco-flights");

  return `https://flight.yatra.com/air-search-ui/dom2/trigger?${params.toString()}`;
};

export const buildAdaniOneUrl: UrlBuilder = (req) => {
  const domIntl = "D";
  const type = req.tripType === "roundtrip" ? "R" : "O";
  const cabin = "ECO";
  const pax = `${req.passengers.adults}_${req.passengers.children}_${req.passengers.infants}`;
  const origin = req.origin.code;
  const dest = req.destination.code;
  const depart = formatDate(req.departDate, "ddMMyyyy");
  const ret =
    req.tripType === "roundtrip" && req.returnDate
      ? `-${formatDate(req.returnDate, "ddMMyyyy")}`
      : "";

  const path = `${domIntl}/${type}/${cabin}/${pax}/${origin}-${dest}-${depart}${ret}/REGF`;
  return `https://www.adanione.com/flight/bookingV2/srp/ADLONE/${path}`;
};

export const providers = [
  { name: "Wego", builder: buildWegoUrl },
  { name: "Skyscanner", builder: buildSkyscannerUrl },
  { name: "Kayak", builder: buildKayakUrl },
  { name: "Google Flights", builder: buildGoogleFlightsUrl },
  { name: "Ixigo", builder: buildIxigoUrl },
  { name: "Cleartrip", builder: buildCleartripUrl },
  { name: "Goibibo", builder: buildGoibiboUrl },
  { name: "MakeMyTrip", builder: buildMakeMyTripUrl },
  { name: "EaseMyTrip", builder: buildEaseMyTripUrl },
  { name: "Yatra", builder: buildYatraUrl },
  { name: "Adani One", builder: buildAdaniOneUrl },
];
