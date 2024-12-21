import { useEffect } from "react";

const ScrollOnRefresh = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [window]);
  return null
}

export default ScrollOnRefresh