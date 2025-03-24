import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { useRef } from "react";
import { tv } from "tailwind-variants";
import { Input } from "~/components/Input";
import { RiMapPin5Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { SearchWhite } from "~/components/Icons";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const link = tv({
  base: "flex h-10 items-center px-4 text-sm",
});

const menuVariants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const SearchModal = ({ open, onOpenChange, ...props }: Props) => {
  const location = useLocation();
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 z-20 w-full"
          >
            <div
              {...props}
              className="absolute z-10 flex w-full flex-col bg-white pt-10"
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
                  <SearchWhite className="fill-white" />
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
          </motion.div>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 z-10 h-full w-full bg-slate-600/60"
            onClick={handleCloseModal}
          />
        </>
      )}
    </AnimatePresence>
  );
};
