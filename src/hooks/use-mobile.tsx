import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      // Check screen width
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT
      
      // Check if device has touch capability
      const hasTouchScreen = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            (navigator as any).msMaxTouchPoints > 0
      
      // Check user agent for mobile devices
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Device is considered mobile if it has small screen AND (touch capability OR mobile user agent)
      const isMobileDevice = isSmallScreen && (hasTouchScreen || isMobileUserAgent)
      
      setIsMobile(isMobileDevice)
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkIsMobile)
    
    // Initial check
    checkIsMobile()
    
    return () => mql.removeEventListener("change", checkIsMobile)
  }, [])

  return !!isMobile
}

export function useHasTouchScreen() {
  const [hasTouch, setHasTouch] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkTouchSupport = () => {
      const hasTouchScreen = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            (navigator as any).msMaxTouchPoints > 0
      setHasTouch(hasTouchScreen)
    }

    checkTouchSupport()
  }, [])

  return hasTouch
}
