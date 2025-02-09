// components/Sidebar.js
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="w-64 text-[#800000] flex flex-col">
            <div className="p-4 text-2xl font-bold">University</div>
            <div className="flex-grow">
                <nav className="flex flex-col p-4 space-y-4">
                    <Link href="/programs" legacyBehavior>
                        <a className="hover:bg-red-900 hover:text-white p-2 rounded">Programs</a>
                    </Link>
                    <Link href="/allocate-semester" legacyBehavior>
                        <a className="hover:bg-red-900 hover:text-white p-2 rounded">Allocate Semester to Program</a>
                    </Link>
                    <Link href="/departments" legacyBehavior>
                        <a className="hover:bg-red-900 hover:text-white p-2 rounded">Departments</a>
                    </Link>
                    <Link href="/subjects" legacyBehavior>
                        <a className="hover:bg-red-900 hover:text-white p-2 rounded">Subjects</a>
                    </Link>
                    <Link href="/syllabus" legacyBehavior>
                        <a className="hover:bg-red-900 hover:text-white p-2 rounded">Syllabus</a>
                    </Link>
                    <Link href="/allocate-subject" legacyBehavior>
                        <a className="hover:bg-red-900 hover:text-white p-2 rounded">Allocate Subjects to Program Semester</a>
                    </Link>
                    
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
