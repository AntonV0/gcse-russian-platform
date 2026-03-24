import { signOut } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
      >
        Log out
      </button>
    </form>
  );
}
