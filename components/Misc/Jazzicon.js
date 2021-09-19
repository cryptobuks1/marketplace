import { useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';

function Jazzicon({account, diameter}) {
  const avatarRef = useRef();
  useEffect(() => {
    const element = avatarRef.current;
    if (element && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(diameter, seed);
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [account, avatarRef]);
  return <div ref={avatarRef} />;
}

export default Jazzicon;