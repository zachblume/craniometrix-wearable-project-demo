import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import Image from "next/image";
const classNames = (...classes) => classes.filter(Boolean).join(" ");
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const GlobalLayout = ({ children }) => {
    // use router to mark the ojbect for the current path as current:true
    const router = useRouter();
    const navigation = [
        { name: "Recommendations", href: "/", icon: UsersIcon },
        { name: "Realtime Alerts", href: "/alerts", icon: HomeIcon },
        { name: "Wandering Protection", href: "/wandering", icon: FolderIcon },
        { name: "Activity Patterns", href: "/activity", icon: CalendarIcon },
        { name: "Provider Dashboard", href: "/providers", icon: ChartPieIcon },
    ].map((item) => ({ ...item, current: item.href === router.pathname }));

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const supabase = useSupabaseClient();

    return (
        <div className={inter.className}>
            <>
                <ToastContainer />

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col shadow-md">
                    {/* Sidebar component */}
                    <div className="flex grow flex-col gap-y-14 overflow-y-auto bg-orange-600 px-6">
                        <div className="flex h-16 shrink-0 items-center">
                            <Brand />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "bg-orange-700 text-white"
                                                            : "text-orange-100 hover:text-white hover:bg-orange-700",
                                                        "group flex gap-x-3 rounded-md p-2 leading-6 font-semibold"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current
                                                                ? "text-white"
                                                                : "text-orange-100 group-hover:text-white",
                                                            "h-6 w-6 shrink-0"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li className="-mx-6 mt-auto">
                                    <a
                                        onClick={() => supabase.auth.signOut()}
                                        href="#"
                                        className="flex items-center gap-x-4 px-6 py-3 font-semibold leading-6 text-white hover:bg-orange-700"
                                    >
                                        <Image
                                            className="h-8 w-8 rounded-full bg-orange-700"
                                            src="/avatar.jpg"
                                            alt="avatar"
                                            height={100}
                                            width={100}
                                        />
                                        <span className="sr-only">Your profile</span>
                                        <span aria-hidden="true">Zach Blume</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Mobile top bar */}
                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-orange-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-orange-100 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 font-semibold leading-6 text-white">Dashboard</div>
                    <a href="#">
                        <span className="sr-only">Your profile</span>
                        <Image
                            className="h-8 w-8 rounded-full bg-orange-700"
                            src="/avatar.jpg"
                            alt="avatar"
                            height={100}
                            width={100}
                        />
                    </a>
                </div>

                {/* Mobile sidebar */}
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Mobile Sidebar sub component */}
                                    <div className="flex grow flex-col gap-y-14 overflow-y-auto bg-orange-600 px-6 pb-2">
                                        <div className="flex h-16 shrink-0 items-center">
                                            <Brand />
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul
                                                role="list"
                                                className="flex flex-1 flex-col gap-y-7"
                                            >
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current
                                                                            ? "bg-orange-700 text-white"
                                                                            : "text-orange-100 hover:text-white hover:bg-orange-700",
                                                                        "group flex gap-x-3 rounded-md p-2 leading-6 font-semibold"
                                                                    )}
                                                                >
                                                                    <item.icon
                                                                        className={classNames(
                                                                            item.current
                                                                                ? "text-white"
                                                                                : "text-orange-100 group-hover:text-white",
                                                                            "h-6 w-6 shrink-0"
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                    {item.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Main */}
                <main className="py-0 lg:pl-72">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </>
        </div>
    );
};
export default GlobalLayout;

const Brand = () => (
    <img
        src="/logo.svg"
        alt="Your Company"
        // transform the svg to be white on trasnparent, and centered, using tailwind classes
        className="h-20 mt-12 w-auto invert"
    />
);
