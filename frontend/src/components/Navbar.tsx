import { Link, type LinkProps } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const linkClass = "no-underline font-semibold text-blue-600 hover:underline hover:text-blue-800";

const RouterLink = (props: LinkProps) => {
  return <Link {...props} className={twMerge(linkClass, props.className)} />;
};

const Navbar = () => {
  return (
    <nav className="bg-white text-black px-4 py-2 flex gap-4">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/sample/users">Users</RouterLink>
      <RouterLink to="/sample/test/martin/likes/ice-cream?flavor=chocolate">Test Dynamic Routes</RouterLink>
    </nav>
  );
};

export default Navbar;
