"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartProvider";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import ReactCountUp from "./countUp";
import Link from "next/link";
import { LuLoaderCircle } from "react-icons/lu";

export default function AddToCartmodel({ loading, product }) {
  //   console.log("product", product);
  const { productExistsInCart } = useCart();
  return (
    <>
      {loading || productExistsInCart(product?._id) ? (
        <Button
          disabled={loading || productExistsInCart(product?._id)}
          effect="gooeyLeft"
          className={`mt-2 w-full ${
            loading
              ? "bg-gray-300"
              : productExistsInCart(product?._id)
              ? "bg-secondary-clr"
              : "bg-primary-clr"
          } text-white py-2 rounded-md hover:bg-green-700 transition`}
        >
          {loading ? (
            <div className="h-4 w-3/4 bg-gray-400"></div>
          ) : productExistsInCart(product?._id) ? (
            "Already in cart"
          ) : (
            "Add To Cart"
          )}
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger className="w-full">
            <Button
              disabled={loading}
              effect="gooeyLeft"
              className={`mt-2 w-full ${
                loading ? "bg-gray-300" : "bg-primary-clr"
              } text-white py-2 rounded-md hover:bg-green-700 transition`}
            >
              {loading ? (
                <div className="h-4 w-3/4 bg-gray-400"></div>
              ) : (
                "Add To Cart"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="z-50 mt-10 max-w-[80%] md:max-w-2xl lg:max-w-3xl h-fit max-h-[90%]">
            <Modal product={product} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

const Modal = ({ product }) => {
  // console.log("product", product);

  const [imageTwoError, setImageTwoError] = useState(false);
  const [variantCheck, setVariantCheck] = useState(product?.variants[0]);
  //   console.log("variantCheck", variantCheck);

  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToCartLoading } = useCart();

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="bg-white h-fit p-2 md:p-4 lg:p-6 rounded-lg w-full relative overflow-y-scroll">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="w-full md:w-1/3">
          <Image
            src={
              imageTwoError
                ? "/placeholder.svg"
                : (product?.variants && product?.variants[0]?.images[1]
                    ? product?.variants && product?.variants[0]?.images[1]
                    : product?.variants && product?.variants[0]?.images[0]) ||
                  "/placeholder.svg"
            }
            alt={product?.title}
            onError={() => setImageTwoError(true)}
            className="w-full object-contain"
            width={280}
            height={280}
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>

          <div className="flex items-center gap-2">
            <span>
              <ReactCountUp
                amt={product?.salePrice || product?.price}
                prefix="₹"
                className="text-lg text-primary-clr font-bold"
              />
              /-
            </span>

            <span>
              {product?.price && product?.price !== product?.salePrice && (
                <ReactCountUp
                  amt={product?.price}
                  prefix="₹"
                  className="text-sm line-through text-gray-500"
                />
              )}
              /-
            </span>
          </div>

          {/* Product Details Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <div className="text-sm space-y-2">
              <p>{product?.description}</p>
            </div>
          </div>

          {!product?.isSingleVariantProduct && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">variants</h3>
              <div className="flex max-w-[200px] items-center  h-9 ">
                {product.variants.map((variant, index) => (
                  <Button
                    type="button"
                    key={index}
                    variant="ghost"
                    onClick={() => setVariantCheck(variant)}
                    className={`px-4 py-2 text-xl hover:bg-transparent font-medium text-gray-600 border border-gray-400 aria-label="Decrease quantity ${
                      variant.flavor === variantCheck.flavor &&
                      "bg-primary-clr text-white"
                    }`}
                  >
                    {variant.flavor}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}

          <div className="mb-4 flex flex-col gap-2">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="w-fit flex-between gap-5">
              <div className="flex-1 flex max-w-[200px] items-center border border-gray-400 h-9">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={decreaseQuantity}
                  className="px-4 py-2 text-xl hover:bg-transparent font-medium text-gray-600  focus:outline-none"
                  aria-label="Decrease quantity"
                >
                  −
                </Button>
                <span className="flex-1 px-4 py-2 text-center border-x">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={increaseQuantity}
                  className="px-4 py-2 text-xl font-medium text-gray-600 hover:bg-transparent focus:outline-none"
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
              <ReactCountUp
                amt={product?.salePrice * quantity || product?.price * quantity}
                prefix="₹"
                className=" text-xl font-semibold"
              />
            </div>
            <div className="w-full h-fit flex-center flex-col md:flex-row gap-2">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(
                    product,
                    quantity,
                    variantCheck || product.variants[0]
                  );
                }}
                disabled={addToCartLoading}
                title={
                  addToCartLoading ? "Adding to cart" : "Click to add in cart"
                }
                size="sm"
                effect="shine"
                className="rounded-none w-full md:w-[200px] text-white bg-primary-clr hover:bg-green-700 py-2 transition"
              >
                Add To Cart{" "}
                {addToCartLoading && (
                  <LuLoaderCircle className="animate-spin" />
                )}
              </Button>
              <Link
                href={`/products/${product?.sku}`}
                target="_blank"
                className="w-full h-fit"
              >
                <Button
                  type="button"
                  size="sm"
                  effect="gooeyRight"
                  className="rounded-none w-full md:w-[200px] text-white bg-primary-clr hover:bg-green-700 py-2 transition"
                >
                  Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
