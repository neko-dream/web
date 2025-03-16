const SKELETON_QTE = 2;

export const SessionSkeleton = () => {
  return (
    <div className="mt-4 animate-pulse space-y-6 px-4">
      {Array(SKELETON_QTE)
        .fill(0)
        .map((_, i) => {
          return (
            <div key={i} className="flex">
              <div className="h-16 w-16 rounded-2xl bg-gray-100" />
              <div className="ml-4 flex w-full flex-col justify-between">
                <div className="h-6 rounded-md bg-gray-100" />
                <div className="mt-1 h-4 w-32 rounded-md bg-gray-100" />
                <div className="flex space-x-8">
                  <div className="h-4 w-16 rounded-md bg-gray-100" />
                  <div className="h-4 w-16 rounded-md bg-gray-100" />
                  <div className="h-4 w-16 rounded-md bg-gray-100" />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
