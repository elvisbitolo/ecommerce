import AdminSignIn from "./sign-in";

export const metadata = {
  title: "Admin sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminSignIn />;
}
