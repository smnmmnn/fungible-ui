export default function UserMessage({ message }: { message: string }) {
  return (
    <div className="w-full flex justify-start flex-col items-end gap-1.5">
      <div className="px-4 py-2.25 bg-posthog-3000-150 rounded-xl">
        {message}
      </div>
    </div>
  );
}

