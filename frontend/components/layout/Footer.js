import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white p-2">
            <div className="container mx-auto text-center">
                <p className="mb-4">&copy; {new Date().getFullYear()} Manish Gupta. All rights reserved.
                
                    <Link href="/privacy" legacyBehavior>
                        <a className="hover:underline">Privacy Policy</a>
                    </Link>
                    {' | '}
                    <Link href="/terms" legacyBehavior>
                        <a className="hover:underline">Terms of Service</a>
                    </Link>
                </p>
            </div>
        </footer>
    );
};
export default Footer;