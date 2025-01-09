import { Spinner } from "@phosphor-icons/react/dist/ssr";


const ButtonLoader = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full items-center justify-center gap-2 rounded bg-gray-200 p-3 text-gray-400">
      <Spinner className="h-5 w-5 animate-spin" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default ButtonLoader;