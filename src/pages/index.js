import { useAnimate } from "framer-motion";
import { useQuery, supabase } from "@/lib/useQuery";
import PageTitle from "@/components/Layout/PageTitle";
import Main from "@/components/Layout/Main";
import PageWrapper from "@/components/Layout/PageWrapper";
import { toast } from "react-toastify";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

const Home = () => {
    // const { data: recommendations, error, mutate } = useQuery(supabase.from("recommendations").select("*"));
    // const insert = async (obj) => (await supabase.from("products").insert(obj)) && mutate();
    // const update = async (obj, conditions) =>
    //     (await supabase.from("products").update(obj).match(conditions)) && mutate();

    const supabase = useSupabaseClient();
    const user = useUser();

    const title = "Recommendations";
    const description =
        "Personalized suggestions based on past activity, gait, balance, habits, and more.";
    const breadCrumbs = [{ url: "/", text: title }];

    return (
        <PageWrapper>
            <PageTitle {...{ title, description, breadCrumbs }}>
                <button type="button" className="ml-3 btn-primary">
                    Configure top symptoms
                </button>
            </PageTitle>
            <Main>
                <div className="relative">
                    <ul
                        role="list"
                        className=" mt-6 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2"
                    >
                        {recommendations.map((recommendation, i) => (
                            <Recommendation key={i} recommendation={recommendation} />
                        ))}
                    </ul>
                    <div className="mt-4 flex">
                        <a
                            hid="#"
                            className="text-sm font-medium text-orange-600 hover:text-orange-500 "
                        >
                            Or view all recommendations
                            <span aria-hidden="true"> &rarr;</span>
                        </a>
                    </div>
                </div>
            </Main>
        </PageWrapper>
    );
};
export default Home;

// Make this a card
const Card = ({}) => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">{children[0]}</div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">{children[1]}</div>
    </div>
);
import { ClockIcon, HeartIcon, MapIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

const recommendations = [
    {
        title: "Continue to intervene with evening meals",
        description:
            "After intervening during evening meals, your loved one's appetite has decreased back to baseline.",
        icon: HeartIcon,
        background: "bg-pink-500",
    },
    {
        title: "Add a realtime alert to prevent wandering",
        description:
            "Your loved one has been wandering at night. Set up a realtime alert for when they leave the house.",
        icon: MapIcon,
        background: "bg-blue-500",
    },
    {
        title: "Encourage daily exercise",
        description:
            "Set a alert for daily minimum light exersice such as walking, to improve health.",
        icon: PlayCircleIcon,
        background: "bg-green-500",
    },
    {
        title: "Encourage earlier sleep times",
        description:
            "The patient has been staying up later than usual. Set a reminder to encourage earlier sleep times.",
        icon: ClockIcon,
        background: "bg-red-500",
    },
];

const Recommendation = ({ recommendation, key: i }) => {
    const [scope, animate] = useAnimate();
    const [open, setOpen] = useState(false);

    const showRecommendation = async () => {
        setOpen(!open);
        if (!open) {
            await animate("li", { position: "absolute" }, { duration: 0 });
            await animate(
                "li",
                {
                    scale: 1,
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.03)",
                },
                {
                    duration: 0.5,
                    // fix the glitchy transition rendering
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                }
            );
        } else {
            // animate back to normal state
            await animate("li", { scale: 1 }, { duration: 0.5 });
            await animate(
                "li",
                {
                    position: "relative",
                    width: "auto",
                    height: "auto",
                    top: "auto",
                    left: "auto",
                    right: "auto",
                    bottom: "auto",
                    zIndex: "auto",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "none",
                    padding: "0",
                    boxShadow: "none",
                },
                { duration: 0 }
            );
        }
    };

    return (
        <div key={i} ref={scope}>
            <li
                className="flow-root cursor-pointer"
                // onMouseOver={() => (open ? null : animate("div", { scale: 1.03 }))}
                // onMouseLeave={() => (open ? null : animate("div", { scale: 1 }))}
                onClick={(e) => {
                    e.preventDefault();
                    showRecommendation();
                }}
            >
                <div
                    className={
                        (open ? "" : "hover:bg-gray-50 hover:shadow-sm ") +
                        "relative -m-2 flex items-center space-x-6 rounded-xl p-4 focus-within:ring-2 focus-within:ring-orange-500"
                    }
                >
                    <div
                        className={
                            "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg " +
                            recommendation.background
                        }
                    >
                        <recommendation.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="text-base font-medium text-gray-900">
                            <a hid="#" className="focus:outline-none">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <span>{recommendation.title}</span>
                                <span aria-hidden="true"> &rarr;</span>
                            </a>
                        </h3>
                        <p className="mt-1 text-base text-gray-500">{recommendation.description}</p>
                    </div>
                </div>
            </li>
        </div>
    );
};
import { CheckIcon, HandThumbUpIcon, UserIcon } from "@heroicons/react/20/solid";
import { useEffect, useId, useState, useid } from "react";

const timeline = [
    {
        id: 1,
        content: "Applied to",
        target: "Front End Developer",
        hid: "#",
        date: "Sep 20",
        datetime: "2020-09-20",
        icon: UserIcon,
        iconBackground: "bg-gray-400",
    },
    {
        id: 2,
        content: "Advanced to phone screening by",
        target: "Bethany Blake",
        hid: "#",
        date: "Sep 22",
        datetime: "2020-09-22",
        icon: HandThumbUpIcon,
        iconBackground: "bg-blue-500",
    },
    {
        id: 3,
        content: "Completed phone screening with",
        target: "Martha Gardner",
        hid: "#",
        date: "Sep 28",
        datetime: "2020-09-28",
        icon: CheckIcon,
        iconBackground: "bg-green-500",
    },
    {
        id: 4,
        content: "Advanced to interview by",
        target: "Bethany Blake",
        hid: "#",
        date: "Sep 30",
        datetime: "2020-09-30",
        icon: HandThumbUpIcon,
        iconBackground: "bg-blue-500",
    },
    {
        id: 5,
        content: "Completed interview with",
        target: "Katherine Snyder",
        hid: "#",
        date: "Oct 4",
        datetime: "2020-10-04",
        icon: CheckIcon,
        iconBackground: "bg-green-500",
    },
];

const Feed = () => (
    <div className="flow-root">
        <ul role="list" className="-mb-8">
            {timeline.map((event, eventIdx) => (
                <li key={event.id}>
                    <div className="relative pb-8">
                        {eventIdx !== timeline.length - 1 ? (
                            <span
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                            />
                        ) : null}
                        <div className="relative flex space-x-3">
                            <div>
                                <span
                                    className={
                                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white " +
                                        event.iconBackground
                                    }
                                >
                                    <event.icon className="h-5 w-5 text-white" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {event.content}{" "}
                                        <a hid={event.hid} className="font-medium text-gray-900">
                                            {event.target}
                                        </a>
                                    </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                    <time dateTime={event.datetime}>{event.date}</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);
