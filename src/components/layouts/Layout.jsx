import { Outlet, useLoaderData } from "react-router-dom";
import Navbar from "./LayoutComponents/Navbar";
import Footer from "./LayoutComponents/Footer";
import Sidebar from "./LayoutComponents/Sidebar";

export default function Layout() {
  const genres = useLoaderData();

  return (
    <div className="min-h-screen flex flex-col bg-nav-bluenavy">
      <Navbar />

      <section className="flex-1 w-full md:grid md:grid-cols-7">

        <div className="w-full md:col-span-1
        bg-nav-bluenavy
        overflow-x-auto">
          <Sidebar genres={genres} />
        </div>

        <div className="w-full md:col-span-6 bg-base-100 rounded-bl-3xl">
          <Outlet />
        </div>
      </section>

      <Footer />
    </div>
  );
}