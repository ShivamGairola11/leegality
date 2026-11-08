import { Rating } from "@/components/ui/rating";
import type { Review } from "../../types";

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-slate-500">No reviews yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review, index) => (
        <li key={`${review.reviewerEmail}-${index}`}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-semibold text-slate-800">{review.reviewerName}</span>
            <Rating value={review.rating} />
          </div>
          <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
