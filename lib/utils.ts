export function formatToTimeAgo(date: string) {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = time - now;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const result = diff / day;

  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(Math.round(result), "day");
}

export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

export const toCloudflareImageUrl = (imageId: string) =>
  `https://imagedelivery.net/yJC6Z7NpaGQ_RoEViD1TVw/${imageId}`;
