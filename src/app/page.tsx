import { Movies } from "./movies";

export default function Home() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="h-full px-4 py-6 lg:px-8">
          <Movies />
        </div>
      </div>
    </div>
  );
}
