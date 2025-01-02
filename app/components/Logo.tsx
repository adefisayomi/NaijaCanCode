import { Link } from "@remix-run/react";

interface LogoProps {
  isDark?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ isDark = false, className = "" }) => {
  const logoSrc = "/logo_main.png";

  return (
    <div className="flex items-center">
      <Link to="/" className="flex w-fit items-center gap-1">
        <img
          src={logoSrc}
          alt="logo"
          className={`w-[150px] h-auto ${className}`}
        />
      </Link>
    </div>
  );
};

export default Logo;
