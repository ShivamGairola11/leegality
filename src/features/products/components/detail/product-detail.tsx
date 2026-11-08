import { Suspense } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Rating } from "@/components/ui/rating";
import { BuyBox } from "@/features/cart/components/buy-box";
import { formatLabel } from "@/lib/utils";
import type { Product } from "../../types";
import { PriceTag } from "../price-tag";
import { ProductGridSkeleton } from "../product-skeletons";
import { StockStatus } from "../stock-status";
import { BackButton } from "./back-button";
import { ProductGallery } from "./product-gallery";
import { ProductHighlights } from "./product-highlights";
import { ProductReviews } from "./product-reviews";
import { RelatedProducts } from "./related-products";

export function ProductDetail({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const category = formatLabel(product.category);

  return (
    <div className="flex-1 px-4 py-4 sm:px-6 lg:py-6">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: category, href: `/?category=${encodeURIComponent(product.category)}` },
            { label: product.title },
          ]}
        />
      </div>

      <article className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4 md:sticky md:top-20 md:self-start">
          <BackButton />
          <ProductGallery productId={product.id} images={images} title={product.title} />
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Rating value={product.rating} size="md" />
              <span aria-hidden="true">·</span>
              <span>{product.reviews.length} reviews</span>
            </div>
            <PriceTag
              price={product.price}
              discountPercentage={product.discountPercentage}
              size="lg"
            />
            <div>
              <StockStatus stock={product.stock} />
            </div>
            <BuyBox product={product} />
            <dl className="space-y-1 text-sm">
              <div className="flex gap-1.5">
                <dt className="font-semibold text-slate-800">Brand:</dt>
                <dd className="text-slate-600">{product.brand ?? "Unbranded"}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-semibold text-slate-800">Category:</dt>
                <dd className="text-slate-600">{category}</dd>
              </div>
            </dl>
          </section>

          <section aria-label="Delivery and returns">
            <ProductHighlights
              shippingInformation={product.shippingInformation}
              warrantyInformation={product.warrantyInformation}
              returnPolicy={product.returnPolicy}
            />
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900">Description</h2>
            <p className="max-w-prose text-sm leading-relaxed text-slate-600">{product.description}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Reviews</h2>
            <ProductReviews rating={product.rating} reviews={product.reviews} />
          </section>
        </div>
      </article>

      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <RelatedProducts category={product.category} excludeId={product.id} />
      </Suspense>
    </div>
  );
}
