const StreamingPlayer = ({ videoId }: { videoId: string }) => {
  return (
    <iframe
      src={`https://${process.env.CLOUDFLARE_DOMAIN}/${videoId}/iframe`}
      title="Example Stream video"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    ></iframe>
  );
};

export default StreamingPlayer;
