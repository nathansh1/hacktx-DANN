// components/Placeholder.tsx
'use client'; // Ensure this is a client component

import { usePathname } from 'next/navigation'; // Use usePathname instead of useRouter
import Home from './Home';
import Contact from '../contact/page';
import Problem from '../problems/page';
import Dashboard from '../dashboard/page';
import { useEffect, useState } from 'react';

const Placeholder = () => {
    const pathname = usePathname(); // Get the current pathname
    const [componentToRender, setComponentToRender] = useState<JSX.Element | null>(null);

    useEffect(() => {
        switch (pathname) {
            case '/':
                setComponentToRender(<Home />);
                break;
            case '/contact':
                setComponentToRender(<Contact />);
                break;
            case '/problems':
                setComponentToRender(<Problem />);
                break;
            case '/dashboard':
                setComponentToRender(<Dashboard />);
                break;
            default:
                setComponentToRender(<Home />); // Default component
        }
    }, [pathname]); // Run effect when pathname changes

    return (
        <div>
            {componentToRender}
        </div>
    );
};

export default Placeholder;
