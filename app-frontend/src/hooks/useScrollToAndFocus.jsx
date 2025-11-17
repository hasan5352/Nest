import { useEffect } from "react";

function useScrollToAndFocus(element) {
  element.scrollIntoView({behavior: "smooth", block: "center"});
  setTimeout(() => element.focus(), 50);
}

export default useScrollToAndFocus;