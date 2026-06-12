import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_SECRET!,
});

const rwClient = client.readWrite;

export async function postTweet(text: string): Promise<string | null> {
  try {
    const { data } = await rwClient.v2.tweet(text);
    console.log(`Tweet posted: ${data.id}`);
    return data.id;
  } catch (err: any) {
    console.error("Tweet failed:", err.message);
    return null;
  }
}

export async function postTweetWithMedia(
  text: string,
  mediaPath: string
): Promise<string | null> {
  try {
    const mediaId = await rwClient.v1.uploadMedia(mediaPath);
    const { data } = await rwClient.v2.tweet({
      text,
      media: { media_ids: [mediaId] },
    });
    console.log(`Tweet with media posted: ${data.id}`);
    return data.id;
  } catch (err: any) {
    console.error("Tweet with media failed:", err.message);
    return null;
  }
}
