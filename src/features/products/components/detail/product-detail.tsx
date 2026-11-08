import { Rating } from "@/components/ui/rating";
import { formatLabel, formatPrice } from "@/lib/utils";
import type { Product } from "../../types";
import { BackButton } from "./back-button";
import { ProductGallery } from "./product-gallery";
import { ProductReviews } from "./product-reviews";

export function ProductDetail({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="px-4 py-4 sm:px-6 lg:py-6">
      <article className="grid gap-6 rounded-lg bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2 md:gap-0">
        <div className="flex flex-col gap-4 md:pr-8">
          <BackButton />
          <ProductGallery images={images} title={product.title} />
        </div>

        <div className="divide-y divide-gray-200 md:border-l md:border-gray-200 md:pl-8">
          <section className="space-y-3 pb-5">
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold text-slate-900">
                {formatPrice(product.price)}
              </span>
              <Rating value={product.rating} size="md" />
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-1.5">
                <dt className="font-semibold text-slate-800">Brand:</dt>
                <dd className="text-slate-600">{product.brand ?? "Unbranded"}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-semibold text-slate-800">Category:</dt>
                <dd className="text-slate-600">{formatLabel(product.category)}</dd>
              </div>
            </dl>
          </section>

          <section className="space-y-2 py-5">
            <h2 className="text-base font-semibold text-slate-900">Description</h2>
            <p className="max-w-prose text-sm leading-relaxed text-slate-600">{product.description}</p>
          </section>

          <section className="space-y-3 pt-5">
            <h2 className="text-base font-semibold text-slate-900">Reviews</h2>
            <ProductReviews reviews={product.reviews} />
          </section>
        </div>
      </article>
    </div>
  );
}
