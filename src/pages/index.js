import { useQuery, postgrest } from "@/lib/db";
import Table from "@/components/Table";
import PageTitle from "@/components/Layout/PageTitle";
import Main from "@/components/Layout/Main";
import PageWrapper from "@/components/Layout/PageWrapper";
import { toast } from "react-toastify";

const capitlizeKeys = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        newObj[key.charAt(0).toUpperCase() + key.slice(1)] = obj[key];
    });
    return newObj;
};

const Home = () => {
    // const { data: recommendations, error, mutate } = useQuery(postgrest.from("recommendations").select("*"));
    // const insert = async (obj) => (await postgrest.from("products").insert(obj)) && mutate();
    // const update = async (obj, conditions) =>
    //     (await postgrest.from("products").update(obj).match(conditions)) && mutate();

    const title = "Recommendations";
    const description =
        "Personalized suggestions based on past activity, gait, balance, habits, and more.";
    const breadCrumbs = [{ url: "/", text: title }];

    return (
        <PageWrapper>
            <PageTitle {...{ title, description, breadCrumbs }}>
                {/* <button type="button" className="ml-3 btn-primary">
                    Primary button
                </button> */}
            </PageTitle>
            <Main>sdfsdf</Main>
        </PageWrapper>
    );
};
export default Home;
