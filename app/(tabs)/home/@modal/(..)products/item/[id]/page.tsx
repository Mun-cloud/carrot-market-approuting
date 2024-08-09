import { notFound } from "next/navigation";
import ModalBackBtn from "../../../_components/ModalBackBtn";
import ProductDetail from "@/app/products/item/[id]/_components/product-detail";
import {
  getCachedProduct,
  getIsProductOwner,
} from "@/app/products/item/[id]/actions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProduct(Number(params.id));
  return { title: product?.title };
}

const Modal = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsProductOwner(product.userId);

  return (
    <div className="absolute h-full w-full z-50 bg-black items-center left-0 top-0 flex justify-center bg-opacity-60 overflow-auto">
      <ModalBackBtn />
      <div className="max-w-screen-sm w-[90vw] flex justify-center h-[80vh]">
        <ProductDetail product={product} id={id} isOwner={isOwner} />
      </div>
    </div>
  );
};

export default Modal;
