import classNames from "@/utils/classnames";

const API = async () => {
  return (
    <div
      className={classNames(
        "flex w-full",
        "sm:p-4 lg:p-8",
        "gap-x-20",
        "justify-center lg:justify-start"
      )}
    >
      <div
        className={classNames(
          "flex w-full flex-col shadow rounded-2xl shrink-0",
          "space-between"
        )}
      ></div>
    </div>
  );
};

export default API;
