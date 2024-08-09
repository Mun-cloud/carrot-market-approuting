import ModalBackBtn from "../../../_components/ModalBackBtn";

const ModalLoading = () => {
  return (
    <div className="absolute h-full w-full z-50 bg-black items-center left-0 top-0 flex justify-center bg-opacity-60 overflow-auto">
      <ModalBackBtn />
      <div className="max-w-screen-sm w-[90vw] flex flex-col h-[80vh] overflow-auto bg-neutral-800 rounded-lg">
        <div className="animate-pulse aspect-square w-full bg-neutral-600" />
        <div className="flex items-center justify-between p-5 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-neutral-600 animate-pulse" />
            <div className="w-[100px] h-[22px] rounded-md bg-neutral-600 animate-pulse" />
          </div>
        </div>
        <div className="p-5 space-y-3 gap-3">
          <div className="h-[30px] w-[150px] bg-neutral-600 animate-pulse rounded-md" />
          <div className="space-y-2">
            <div className="h-[22px] w-[200px] bg-neutral-600 animate-pulse rounded-md" />
            <div className="h-[22px] w-[180px] bg-neutral-600 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLoading;
