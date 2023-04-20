import useSwr from "swr";
import { PostgrestClient } from "@supabase/postgrest-js";

const REST_URL = "https://postgrest-on-heroku.herokuapp.com";
const postgrest = new PostgrestClient(REST_URL);

const useQuery = (query) => {
    const fetcher = async () => {
        const { data, error } = await query;
        if (error) throw error;
        return data;
    };
    return useSwr(query?.url?.href, fetcher);
};

export { useQuery, postgrest };
