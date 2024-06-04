async function getProduct() {
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
}

const ProductDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const product = await getProduct();
  return <div>ProductDetailPage {id}</div>;
};

export default ProductDetailPage;
