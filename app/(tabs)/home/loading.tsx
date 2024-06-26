const Loading = () => {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, i) => (
        <div className="flex gap-5" key={i}>
          <div className="size-28 bg-neutral-700 rounded-md" />
          <div className="flex flex-col gap-2 *:rounded-md *:bg-neutral-700 *:h-5">
            <div className="w-40" />
            <div className="w-20" />
            <div className="w-10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
