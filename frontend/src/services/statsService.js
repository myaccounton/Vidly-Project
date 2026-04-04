import http from "./httpService";

export async function getStatsRevenue() {
  const { data } = await http.get("/stats/revenue");
  const n = Number(data?.totalRevenue);
  return { totalRevenue: Number.isFinite(n) ? n : 0 };
}

export async function getStatsRentalCount() {
  const { data } = await http.get("/stats/count");
  const n = Number(data?.totalRentals);
  return { totalRentals: Number.isFinite(n) ? n : 0 };
}
