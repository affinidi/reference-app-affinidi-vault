import NavBar from "src/components/NavBar/NavBar";

interface LandingProps {
    children: React.ReactNode;
}

const Layout: React.FC<LandingProps> = ({ children }) => {
   return (
        <div>
            <NavBar />
            {children}
        </div>
    )
}
export default Layout