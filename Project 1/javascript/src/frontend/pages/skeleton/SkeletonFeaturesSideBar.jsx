import { SkeletonCardBox } from "./SkeletonCardBox";

export const SkeletonFeaturesSidebar = () => {
  return (
    <div className="flex flex-col items-start justify-center p-10 w-1/2 overflow-y-auto">
      <div className="flex flex-col items-start gap-6 w-full">
        {[...Array(5)].map((_, index) => (
          <SkeletonCardBox key={index} />
        ))}
      </div>
    </div>
  );
};