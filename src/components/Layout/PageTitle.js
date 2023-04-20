import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const PageTitle = ({ title, children, breadCrumbs, description }) => {
    return (
        <div>
            <div>
                <nav className="flex" aria-label="Breadcrumb">
                    <ol role="list" className="flex items-center space-x-4">
                        <li>
                            <div className="flex">
                                <a
                                    href="#"
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Home
                                </a>
                            </div>
                        </li>
                        {breadCrumbs.map((breadcrumb, i) => (
                            <li key={i}>
                                <div className="flex items-center">
                                    <ChevronRightIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <Link
                                        href={breadcrumb.url}
                                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        {breadcrumb.text}
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
            <div className="mt-3 mb-5 md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight">
                        {title}
                    </h1>
                </div>

                <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">{children}</div>
            </div>
            <p className="mt-3">{description}</p>
        </div>
    );
};
export default PageTitle;
