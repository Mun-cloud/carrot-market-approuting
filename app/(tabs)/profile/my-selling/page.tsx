import NavHeader from "@/components/nav-header";
import { cachedMySellingProducts } from "./actions";
import { notFound } from "next/navigation";
import ListProduct from "@/components/list-product";

const MySellingPage = async () => {
  const products = await cachedMySellingProducts();
  if (!products) {
    notFound();
  }
  return (
    <>
      <NavHeader>나의 판매 목록</NavHeader>
      <div className="p-5 flex flex-col gap-5">
        {products.map((product) => (
          <ListProduct
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            photo={product.photo}
            created_at={product.created_at}
          />
        ))}
      </div>
    </>
  );
};

export default MySellingPage;
