import { Rating } from "@/components/ui/rating";
import type { Review } from "../../types";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface ProductReviewsProps {
  rating: number;
  reviews: Review[];
}

function RatingBreakdown({ rating, reviews }: ProductReviewsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-surface-muted p-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="shrink-0 text-center sm:w-28">
        <p className="text-3xl font-semibold text-slate-900">{rating.toFixed(1)}</p>
        <Rating value={rating} showValue={false} />
        <p className="mt-1 text-xs text-slate-500">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>
      <ul className="flex-1 space-y-1.5" aria-label="Rating breakdown">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter((review) => Math.round(review.rating) === stars).length;
          const percent = (count / reviews.length) * 100;
          return (
            <li key={stars} className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-8 shrink-0">{stars} ★</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <span className="block h-full rounded-full bg-star" style={{ width: `${percent}%` }} />
              </span>
              <span className="w-4 shrink-0 text-right">{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProductReviews({ rating, reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-slate-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-5">
      <RatingBreakdown rating={rating} reviews={reviews} />
      <ul className="space-y-5">
        {reviews.map((review, index) => (
          <li key={`${review.reviewerEmail}-${index}`} className="flex gap-3">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
            >
              {initials(review.reviewerName)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm font-semibold text-slate-800">{review.reviewerName}</span>
                <Rating value={review.rating} />
              </div>
              <time dateTime={review.date} className="text-xs text-slate-400">
                {dateFormatter.format(new Date(review.date))}
              </time>
              <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
