import { animated } from "@react-spring/web";
import { Link, useLocation, useNavigate } from "react-router";
import { useRef } from "react";
import { tv } from "tailwind-variants";
import SearchWhiteIcon from "~/assets/search-white.svg";
import Input from "~/components/Input";
import { useOpenModalAnimation } from "../../animation/useOpenModalAnimation";
import { RiMapPin5Fill } from "react-icons/ri";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const link = tv({
  base: "flex h-10 items-center px-4 text-sm",
});

export const SearchMenuDialog = ({ open, onOpenChange, ...props }: Props) => {
  const location = useLocation();
  const transition = useOpenModalAnimation({ open });

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCloseModal = () => onOpenChange(false);

  const handleSubmit = () => {
    const query = encodeURIComponent(inputRef.current?.value || "");
    navigate(`/home?q=${query}`);
    handleCloseModal();
  };

  const handleSearchNearSession = () => {
    const success = (pos: GeolocationPosition) => {
      if (location.search) {
        navigate(
          `/home?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&sortKey=nearest&${location.search.replace("?", "")}`,
        );
      } else {
        navigate(
          `/home?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&sortKey=nearest`,
        );
      }
      handleCloseModal();
    };

    const error = (e: unknown) => {
      toast.error("位置情報の取得に失敗しました");
      console.error(e);
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });
  };

  return transition((style, item) => {
    if (!item) {
      return;
    }

    return (
      <>
        <animated.div style={style} className="absolute top-0 z-10 w-[375px]">
          <div
            {...props}
            className="absolute z-10 flex w-full max-w-[375px] flex-col bg-white pt-10"
          >
            <div className="flex space-x-2 p-4">
              <Input
                className="h-10"
                placeholder="キーワードで検索"
                ref={inputRef}
              />
              <button
                onClick={handleSubmit}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-500 hover:opacity-80"
              >
                <img
                  src={SearchWhiteIcon}
                  alt=""
                  loading="lazy"
                  className="fill-white"
                />
              </button>
              <button
                onClick={handleSearchNearSession}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-500 hover:opacity-80"
              >
                <RiMapPin5Fill color="white" size={22} />
              </button>
            </div>
            <Link
              to={"/home?sortKey=latest"}
              className={link()}
              onClick={handleCloseModal}
            >
              新着のセッション
            </Link>
            <Link
              to={"/home?sortKey=mostReplies"}
              className={link()}
              onClick={handleCloseModal}
            >
              盛り上がってるセッション
            </Link>
            <Link
              to={"/home?sortKey=oldest"}
              className={link()}
              onClick={handleCloseModal}
            >
              もうすぐ終了するセッション
            </Link>
          </div>
        </animated.div>
        <animated.div
          style={{ opacity: style.opacity }}
          className="absolute top-0 h-full w-[375px] bg-slate-600/60"
          onClick={handleCloseModal}
        ></animated.div>
      </>
    );
  });
};
