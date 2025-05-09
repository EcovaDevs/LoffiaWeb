"use client";

import ProductCard from "@/components/ui/productCard";
import { specialOfferProducts } from "@/constants/product";
import { fadeIn, staggerContainer } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SpecialOffers = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "4");

        const response = await fetch(
          `/api/products/special-offer-products?${params}`
        );
        const data = await response.json();
        console.log("Special Offers:", data);

        const specialOfferProductArray =
          data?.specialOfferProducts?.map((item) => item.product) || [];

        // console.log("Special Offers:", specialOfferProductArray);

        setProducts(specialOfferProductArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="w-full h-fit flex flex-col items-center justify-center gap-4 md:gap-6 p-4 sm:p-6  md:p-8"
    >
      <motion.h2
        variants={fadeIn("down", 0.2)}
        className="text-2xl font-semibold"
      >
        Special Offers
      </motion.h2>
      <div className="w-full grid md:flex grid-cols-2  items-center justify-center gap-3 md:gap-6">
        {!loading
          ? products?.map(
              (product, index) =>
                product && (
                  <motion.div
                    key={index}
                    variants={fadeIn("up", 0.3 + index * 0.1)}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                )
            )
          : Array.from({ length: 4 }, (_, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", 0.3 + index * 0.1)}
              >
                <ProductCard
                  loading={loading}
                  product={specialOfferProducts[index]}
                />
              </motion.div>
            ))}
      </div>

      {/* <div className="w-full flex flex-wrap items-center justify-center gap-6">
        {products &&
          products.map((product, index) => (
            <motion.div key={index} variants={fadeIn("up", 0.3 + index * 0.1)}>
              <ProductCard product={product} />
            </motion.div>
          ))}
      </div> */}
    </motion.div>
  );
};

export default SpecialOffers;
