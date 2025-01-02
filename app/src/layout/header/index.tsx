import DesktopHeader from "./DesktopHeader"
import useResponsive from "~/src/hooks/useResponsive"
import MobileHeader from "./MobileHeader"



export default function Header () {
    const isDesktop = useResponsive() === 'desktop'
    return isDesktop ? <DesktopHeader /> : <MobileHeader />
}