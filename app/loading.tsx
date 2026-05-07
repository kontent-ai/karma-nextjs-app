import { Loader } from "@/components/Loader.tsx";

export default function Loading() {
  return (
    <div className="flex flex-grow items-center justify-center py-20">
      <Loader />
    </div>
  );
}
