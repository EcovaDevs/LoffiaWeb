"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddToCartBtn from "./components/AddToCartBtn";
import { Button } from "@/components/ui/button";
import { FrequentlyBoughtTogether } from "./components/BroughtTogether";
import CustomerReviews from "./components/CustomerReviews";
import FrequentlyAskedQuestions from "./components/FrequentlyAskedQuestions";
import Ingredient from "./components/Ingredient";
import ProductDiscover from "./components/ProductDiscover";
import PurposeAndTrust from "./components/PurposeAndTrust";
import RelatedProduct from "./components/RelatedProduct";
import SkeletonLoader from "./components/SkeletonLoader";
import TheStories from "./components/TheStories";
import WriteReview from "./components/WriteReview";
import ReactCountUp from "@/components/ui/countUp";
import { certificationsData } from "@/constants/data";

const ProductDetail = ({ productSku }) => {
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  console.log(product);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [hasOrdered, setHasOrdered] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productSku}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setSelectedVariant(data.variants[0]); // Set the first variant as default
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSku]);

  useEffect(() => {
    const checkOrderHistory = async () => {
      if (!session?.user?._id || !product?._id) return;

      try {
        const response = await fetch(`/api/order/get/${session.user._id}`);
        const data = await response.json();

        if (response.ok) {
          const hasOrderedProduct = data.orders?.some((order) =>
            order.products.some((p) => p.product_id._id === product?._id)
          );
          setHasOrdered(hasOrderedProduct);
        }
      } catch (error) {
        console.error("Error checking order history:", error);
      }
    };

    checkOrderHistory();
  }, [session?.user?._id, product?._id]);

  if (loading) return <SkeletonLoader />;

  if (!product) return <div>Product not found</div>;

  return (
    <>
      <section className="w-full h-full pt-12 md:pt-24">
        <AddToCartBtn product={product} selectedVariant={selectedVariant} />

        <motion.div
          initial={{ opacity: 0, y: -150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 p-4 md:px-8 lg:px-10 xl:px-14 overflow-hidden"
        >
          <ImageGallery images={selectedVariant?.images} />
          <Details
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        </motion.div>
        <FrequentlyBoughtTogether />
        <RelatedProduct
          category={product?.category?.title}
          currentProductId={product?._id}
        />
        <ProductDiscover productData={product} />
        <Ingredient
          sku={productSku}
          productTitle={product?.title}
          productIngredientHighlights={product?.ingredientHighlights || []}
        />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <Image
            src={"/banner3.jpeg"}
            alt="Banner"
            width={1000}
            height={540}
            className="w-full "
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <Image
            src={"/banner2.jpeg"}
            alt="Banner"
            width={1000}
            height={540}
            className="w-full "
          />
        </motion.div>
        <TheStories />
        <PurposeAndTrust />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <Image
            src={"/banner1.png"}
            alt="Banner"
            width={1000}
            height={540}
            className="w-full"
          />
        </motion.div>
        <FrequentlyAskedQuestions faqs={product?.faqs} />
        {hasOrdered && <WriteReview productId={product?._id} />}
        <CustomerReviews productId={product?._id} />
      </section>
    </>
  );
};

export default ProductDetail;

export const ImageGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(true);

  const scrollUp = () => {
    if (scrollPosition > 0) {
      setScrollPosition(scrollPosition - 1);
      setShowScrollDown(true);
    }
    if (scrollPosition <= 1) {
      setShowScrollUp(false);
    }
  };

  const scrollDown = () => {
    if (scrollPosition < images.length - 4) {
      setScrollPosition(scrollPosition + 1);
      setShowScrollUp(true);
    }
    if (scrollPosition >= images.length - 5) {
      setShowScrollDown(false);
    }
  };

  const scrollLeft = () => {
    if (scrollPosition > 0) {
      setScrollPosition(scrollPosition - 1);
      setShowScrollRight(true);
    }
    if (scrollPosition <= 1) {
      setShowScrollLeft(false);
    }
  };

  const scrollRight = () => {
    if (scrollPosition < images.length - 2) {
      setScrollPosition(scrollPosition + 1); // Fixed: was missing proper assignment
      setShowScrollLeft(true);
    }
    if (scrollPosition >= images.length - 3) {
      // Adjusted threshold
      setShowScrollRight(false);
    }
  };

  useEffect(() => {
    setActiveImage(images[0]);
    setScrollPosition(0);
    setShowScrollUp(false);
    setShowScrollLeft(false);
    setShowScrollRight(images.length > 2); // Adjusted for horizontal scroll
    setShowScrollDown(images.length > 4); // Keep vertical scroll logic
  }, [images]);

  return (
    <>
      <div
        id="image-section"
        className="relative lg:sticky lg:top-28 z-10 w-full min-h-[500px] lg:h-fit space-y-4 overflow-hidden"
      >
        <div
          id="images-gallery"
          className="w-full min-h-[500px] lg:h-[65vh] flex flex-col lg:flex-row gap-4 select-none"
        >
          <div
            id="active-image"
            className="w-full lg:w-[80%] h-[400px] lg:h-full relative order-1 lg:order-2 overflow-hidden"
          >
            {images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Active product image ${index + 1}`}
                fill
                className={` absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
                  activeImage === image ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          <div
            id="images"
            className="relative w-full lg:w-[20%] h-24 lg:h-full overflow-hidden order-2 lg:order-1 mb-4 lg:mb-0 overflow-x-hidden lg:overflow-y-hidden"
          >
            <Button
              id="scroll-left"
              type="button"
              onClick={scrollLeft}
              disabled={!showScrollLeft}
              className="lg:hidden absolute top-0 left-0 z-10 h-full lg:h-fit w-8 lg:w-full text-black bg-gray-200 hover:bg-gray-300 rounded-none p-0 transition-colors"
            >
              <span className="-rotate-90">▲</span>
            </Button>
            <Button
              id="scroll-up"
              type="button"
              onClick={scrollUp}
              disabled={!showScrollUp}
              className="hidden lg:block absolute top-0 left-0 z-10 h-full lg:h-fit w-8 lg:w-full text-black bg-gray-200 hover:bg-gray-300 rounded-none p-0 transition-colors"
            >
              <span>▲</span>
            </Button>
            <div className="h-full w-full lg:mt-6 px-8 lg:px-0 overflow-x-scroll overflow-y-hidden lg:overflow-x-hidden lg:overflow-y-scroll scroll-none">
              <div
                className="flex lg:flex-col gap-2 h-full"
                style={{
                  transform: `translate${
                    window.innerWidth >= 1024 ? "Y" : "X"
                  }(-${scrollPosition * 100}%)`,
                }}
              >
                {images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`image ${index + 1}`}
                    width={200}
                    height={200}
                    className={`h-full w-auto lg:w-full lg:h-auto lg:max-h-32 cursor-pointer transition-all ${
                      activeImage === image &&
                      "border-2 border-primary-clr shadow-xl"
                    }`}
                    onClick={() => setActiveImage(image)}
                  />
                ))}
              </div>
            </div>
            <Button
              id="scroll-right"
              type="button"
              onClick={scrollRight}
              disabled={!showScrollRight}
              className="lg:hidden absolute top-0 right-0 z-10 h-full lg:h-fit w-8 lg:w-full text-black bg-gray-200 hover:bg-gray-300 rounded-none p-0 transition-colors"
            >
              <span className="-rotate-90">▼</span>
            </Button>
            <Button
              id="scroll-right"
              type="button"
              onClick={scrollDown}
              disabled={!showScrollDown}
              className="hidden lg:block absolute bottom-0 left-0 z-10 h-full lg:h-fit w-8 lg:w-full text-black bg-gray-200 hover:bg-gray-300 rounded-none p-0 transition-colors"
            >
              <span>▼</span>
            </Button>
          </div>
        </div>

        <div
          id="certified-by-logos"
          className="w-full h-16 lg:h-20 flex-center flex-wrap gap-6 bg-[#F9F6F0] rounded-lg py-2 px-4 md:px-6 lg:px-8 mb-4 lg:mb-0"
        >
          <i className="w-fit font-semibold font-serif text-primary-clr overflow-hidden">
            Certified By
          </i>
          <div
            className="w-full h-full flex-1 flex gap-6 overflow-x-scroll no-scrollbar overflow-y-hidden"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {certificationsData.map((c, index) => (
              <Image
                key={index}
                src={c.img}
                alt={c.alt}
                title={c.alt}
                width={100}
                height={100}
                className="w-fit h-full"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Details = ({ product, selectedVariant, setSelectedVariant }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const description = product.description;
  const shortDescription = description.split(".").slice(0, 2).join(".");

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };
  return (
    <>
      <div
        id="product-details-section"
        className="w-full h-fit flex-1 space-y-4 overflow-hidden"
      >
        <div className="w-fit bg-[#F9F6F0] text-xs py-1 px-4 overflow-hidden">
          {product?.category.title}
        </div>
        <div className="space-y-1">
          <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary-clr font-semibold">
            {product?.title}
          </div>
          <div className="space-y-1 text-primary-clr">
            <div className="flex gap-2 items-end">
              <div className="text-md md:text-lg lg:text-2xl xl:text-3xl font-semibold">
                <ReactCountUp
                  amt={product?.salePrice ? product?.salePrice : product?.price}
                  prefix="₹"
                />
                /-
              </div>
              {product?.price && (
                <ReactCountUp
                  amt={product?.price}
                  prefix="₹"
                  className="line-through text-gray-500"
                />
              )}
            </div>
            <div className="text-xs">Price include GST</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm md:text-md lg:text-lg xl:text-xl">
            Description
          </div>
          <p className="text-xs md:text-sm">
            {showFullDescription ? description : shortDescription}
            {description.length > shortDescription.length && (
              <Button
                variant="link"
                size="sm"
                className="w-fit p-0 text-xs md:text-sm ml-3"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Read less" : "Read more"}
              </Button>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {product?.variants.map((variant, index) => (
            <div
              key={index}
              className={`text-sm text-primary-clr border border-gray-300 p-1 px-3 cursor-pointer`}
            >
              {variant.netQuantity}
            </div>
          ))}
        </div>
        {!product?.isSingleVariantProduct && (
          <div className="flex flex-wrap gap-3">
            {product?.variants.map((variant, index) => (
              <div
                key={index}
                className={`text-sm text-primary-clr border border-gray-300 p-1 px-3 cursor-pointer ${
                  selectedVariant.flavor === variant.flavor &&
                  "bg-primary-clr text-white"
                }`}
                onClick={() => handleVariantChange(variant)}
              >
                {variant.flavor.toUpperCase()}
              </div>
            ))}
          </div>
        )}
        <hr className="border border-gray-300" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8 xl:gap-10 overflow-hidden">
          {[
            { img: "/assets/emi.png", lable: "EMI Available" },
            { img: "/assets/cod.png", lable: "Cash on Delivery Available" },
            {
              img: "/assets/freeShipping.png",
              lable: "Free Shipping On Orders Above ₹999",
            },
          ].map((s, index) => (
            <div
              key={index}
              className="flex items-center flex-col gap-2 text-center overflow-hidden"
            >
              <Image
                src={s.img}
                alt={s.lable}
                width={400}
                height={400}
                className="w-10 h-10"
              />
              <span>{s.lable}</span>
            </div>
          ))}
        </div>
        {product?.benefits.length > 0 && (
          <div className="space-y-1">
            <div className="text-md md:text-lg lg:text-xl xl:text-2xl">
              How this Formula supports your wellness
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 py-2 overflow-hidden">
              {product?.benefits.map((benefit, index) => (
                <div key={index} className="w-full h-full relative group">
                  <div className="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-100 bg-[#FDFBF9] translate-x-1 translate-y-1 flex items-center flex-col gap-1 text-center border border-secondary-clr rounded-xl p-2 px-4 md:px-6 ease-in-out duration-300 overflow-hidden"></div>
                  <div className="relative w-full h-full bg-[#FDFBF9] flex items-center flex-col gap-1 text-center border border-secondary-clr rounded-xl p-2 px-4 md:px-6 hover:shadow-sm ease-in-out duration-300 overflow-hidden">
                    <Image
                      src="/assets/harmless/iconThreeHover.svg"
                      alt={benefit}
                      width={400}
                      height={400}
                      className="w-7 h-7"
                    />
                    <span className="text-balance text-center text-xm sm:text-sm md:text-base">
                      {benefit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
