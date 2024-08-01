import { notFound } from "next/navigation";
import { getCachedProduct } from "../actions";
import EditProductForm from "./_components/edit-product-form";

const ProductEditPage = async ({ params }: { params: { id: number } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <EditProductForm original={product} />
    </div>
  );
};

export default ProductEditPage;
