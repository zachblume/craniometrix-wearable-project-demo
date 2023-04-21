import { CheckIcon, HandThumbUpIcon, UserIcon } from "@heroicons/react/20/solid";
import { useEffect, useId, useState, useid } from "react";
import { useAnimate } from "framer-motion";
import { useQuery, supabase } from "@/lib/useQuery";
import { ClockIcon, HeartIcon, MapIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import PageTitle from "@/components/Layout/PageTitle";
import Main from "@/components/Layout/Main";
import PageWrapper from "@/components/Layout/PageWrapper";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Chart from "@/components/Chart";
import Link from "next/link";

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
                        className=" mt-6 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2 pb-32"
                    >
                        {recommendations.map((recommendation, i) => (
                            <Recommendation key={i} recommendation={recommendation} />
                        ))}
                    </ul>
                    <div className="mt-4 flex">
                        <Link
                            href="#"
                            className="text-sm font-medium text-orange-600 hover:text-orange-500 "
                        >
                            Or view all recommendations
                            <span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </div>
                </div>
            </Main>
        </PageWrapper>
    );
};

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
                }
            );
        } else {
            // animate back to normal state
            animate("li", { scale: 1 }, { duration: 0.3 });
            animate(
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
        setOpen(!open);
    };

    return (
        <div key={i} ref={scope}>
            <li
                className="flow-root cursor-pointer -mt-1"
                onMouseOver={() => (open ? null : animate("div", { scale: 1.03 }))}
                onMouseLeave={() => (open ? null : animate("div", { scale: 1 }))}
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
                            <Link href="#" className="focus:outline-none">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <span>{recommendation.title}</span>
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </h3>
                        <p className="mt-1 text-base text-gray-500">{recommendation.description}</p>
                    </div>
                </div>
                {open && (
                    <span className="relative w-full pt-3 block">
                        <Chart
                            data={{
                                // 30 keys and values, where the keys are consecutive date strings like 01/01/2023
                                // and the values are minutes of eating randomly fluctuation in a pattern:
                                "01/01/2023": Math.floor(Math.random() * 10) + 1,
                                "01/02/2023": Math.floor(Math.random() * 10) + 1,
                                "01/03/2023": Math.floor(Math.random() * 10) + 1,
                                "01/04/2023": Math.floor(Math.random() * 10) + 1,
                                "01/05/2023": Math.floor(Math.random() * 10) + 1,
                                "01/06/2023": Math.floor(Math.random() * 10) + 1,
                                "01/07/2023": Math.floor(Math.random() * 10) + 1,
                                "01/08/2023": Math.floor(Math.random() * 10) + 1,
                                "01/09/2023": Math.floor(Math.random() * 10) + 1,
                                "01/10/2023": Math.floor(Math.random() * 10) + 1,
                                "01/11/2023": Math.floor(Math.random() * 10) + 1,
                                "01/12/2023": Math.floor(Math.random() * 10) + 1,
                                "01/13/2023": Math.floor(Math.random() * 10) + 1,
                                "01/14/2023": Math.floor(Math.random() * 10) + 1,
                                "01/15/2023": Math.floor(Math.random() * 10) + 1,
                                "01/16/2023": Math.floor(Math.random() * 10) + 1,
                                "01/17/2023": Math.floor(Math.random() * 10) + 1,
                                "01/18/2023": Math.floor(Math.random() * 10) + 1,
                                "01/19/2023": Math.floor(Math.random() * 10) + 1,
                                "01/20/2023": Math.floor(Math.random() * 10) + 1,
                                "01/21/2023": Math.floor(Math.random() * 10) + 1,
                                "01/22/2023": Math.floor(Math.random() * 10) + 1,
                                "01/23/2023": Math.floor(Math.random() * 10) + 1,
                                "01/24/2023": Math.floor(Math.random() * 10) + 1,
                                "01/25/2023": Math.floor(Math.random() * 10) + 1,
                            }}
                        />
                    </span>
                )}
            </li>
        </div>
    );
};

export default Home;
